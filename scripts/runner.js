'use strict';
const http = require('http');
const path = require("path");
const url = require('url');
const util = require('util');
const fs = require("fs");
const {exec, spawn} = require("child_process");

const faker = require("faker");
const puppeteer = require('puppeteer');
const devices = puppeteer.devices;
//Tools to serve the site locally
const serveStatic = require("serve-static");
const finalhandler = require('finalhandler');
//XML parser for sitemap.xml test & analysis
const parseString = require('xml-parser');
const expect = require("chai").expect;

const MIN_PRODUCTS_NUMBER = 4;
const MAX_PRODUCTS_NUMBER = 10;

const local_site_files = path.resolve(__dirname,'../_site');
const local_assets_files = path.resolve(__dirname, "../_assets");
const target = process.env["TARGET"] || "local";
const is_extended = process.env["RUN_EXTENDED_TESTS"];
const options = {
  headless:process.env["HEADLESS"] == "false"? false : true,
  executablePath: process.env["PUPPETEER_EXEC_PATH"], // set by github action
  args:["--no-sandbox"]
};

/**
 * Utility function to speed up tests
 * Block selected resources by category
 * Categories are : images, medias, analytics, captcha
 * can also have an additional filter that return true on requests to be intercepted
 */
async function block(page, types, filter){
  await page.setRequestInterception(true);
  if(typeof filter !== "function"){
    filter = _ => false;
  }
  page.on('request', interceptedRequest => {
    let url = interceptedRequest.url();
    //console.log(interceptedRequest.url);
    if(
      (types.indexOf("images") != -1 &&(
         url.endsWith('.png')
      || url.endsWith('.jpg')
    )) ||(types.indexOf("medias") != -1 &&(
         url.endsWith('.mp4')
      || url.endsWith('.ogv')
      || url.endsWith('.webm')
      || url.indexOf("youtube.com") != -1
      || url.indexOf("www.ultimedia.com") != -1
    )) || (types.indexOf("analytics") != -1 &&(
      url.indexOf("google-analytics.com") != -1
    ))|| (types.indexOf("captcha") != -1 &&(
      url.indexOf("gstatic.com") != -1
    )) || filter(url)
    ){
      //console.log("Aborted : ",interceptedRequest.url)
      interceptedRequest.respond("");
    }else{
      interceptedRequest.continue();
    }
  });
}

//Take an array of {src, "prop"} objects and group them by "prop" value
// Example usage : Make an array of image widths.
//                  If result.length == 1, all ilmages have the same size
//                  Otherwise, you know the faulty image
function prettySet(slides, prop){
  let s = new Set(slides.map(slide =>slide[prop]));
  let map = []
  for (let dim of s.values()) {
    let srcs = slides.filter(slide => slide[prop] == dim).map(slide => slide.src);
    map.push(` - ${srcs.join("\n - ")} \n\thave a ${prop} of ${dim}`);
  }
  return map
}


async function getImgSize(img){
  let src;
  src = await img.getProperty("currentSrc").then(v => v.jsonValue());
  if(!src){
    src = await img.getProperty("src").then(v => v.jsonValue());
  }
  const width = await img.getProperty("naturalWidth").then(v => v.jsonValue());
  const height = await img.getProperty("naturalHeight").then(v => v.jsonValue());
  const ok = Number.isInteger(width) && Number.isInteger(height) && 0 < width && 0 < height;
  return { src, width, height, ok};
}

async function forceSameRatio(cells){
  let images = await Promise.all(cells.map(async (cell)=>{
    return await getImgSize(await cell.$("IMG"));
  }));
  //Catch dividebyzero errors
  images.forEach((img)=>{
    expect(img.ok, `${img.src} is not OK (probably: does not exists)`).to.be.true;
  });
  //console.log(images);

  const ratios = prettySet(images.map(img=> {
    let ratio = img.width/img.height;
    ratio = Math.trunc(ratio*10)/10;
    return Object.assign(img, { ratio })
  }), "ratio");
  // allow a length of 1.
  expect(ratios, `Have non-unique ratio : \n${ratios.join("\n")}`).to.have.property("length", 1);
  return images; 
}

async function getThumbnailLinks(cells){
  return await Promise.all(cells.map(async (cell)=>{
    let a = await cell.$("A");
    let handle = await a.getProperty("href");
    let link = await handle.jsonValue();
    await handle.dispose();
    return link;
  }));
}
//Default : run only on small and large "dekstop"
const target_devices = [
  {
    'name': 'small Desktop Chrome 84',
    'userAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36',
    'viewport': {
      'width': 800,
      'height': 600,
      'deviceScaleFactor': 1,
      'isMobile': false,
      'hasTouch': false,
      'isLandscape': true
    }
  }
]
if (is_extended){
  target_devices.push({
    'name': 'large Desktop Chrome 84',
    'userAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36',
    'viewport': {
      'width': 1920,
      'height': 1080,
      'deviceScaleFactor': 1,
      'isMobile': false,
      'hasTouch': false,
      'isLandscape': true
    }
  });
  target_devices.push({
    'name': '4k Desktop Chrome 84',
    'userAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36',
    'viewport': {
      'width': 3840,
      'height': 2160,
      'deviceScaleFactor': 2,
      'isMobile': false,
      'hasTouch': false,
      'isLandscape': true
    }
  });
  const mobile_devices = ([ //Device list : https://github.com/GoogleChrome/puppeteer/blob/master/DeviceDescriptors.js
    'iPad',
    'iPhone 4',
    'iPhone X landscape'
  ]).map( d =>{
    let dev =  devices[d];
    if (!dev) throw new Error("no device named : "+d);
    return dev;
  });
  for (let d of mobile_devices){
    target_devices.push(d);
  }
}


describe("pre-tests", function(){
  it("run extended tests", function(){
    if(!is_extended){
      this.skip()
    }
  })
  describe("devices", ()=>{
    target_devices.forEach(dev=>{
      it(`${dev.name || "<unknown>"} is a valid device`, ()=>{
        expect(dev).to.have.property("name").to.be.a("string");
        expect(dev).to.have.property("viewport").to.be.a("object");
        expect(dev.viewport).to.have.property("width").to.be.a("number");
        expect(dev.viewport).to.have.property("height").to.be.a("number");
        expect(dev).to.have.property("userAgent").to.be.a("string");
      })
    })
  })
})
// use :
// target_devices.forEach(function(device){})
// to run tests on multiple devices
describe(`${target}.`,function(){
  // Retry all tests in this suite up to 3 times
  this.retries(3);

  let browser;
  let server = null;
  async function newPage(device){
    const page = await browser.newPage();
    if(device){
      await page.emulate(device);
    }
    return page;
  }
  // We pre-set href because it's used to declare tests before "before()" is run.
  // However the ad-hoc port is appended once the server is online.
  // This allow us to use dynamic port numbers.
  // Otherwise tests would crash when run concurrently on the same host
  let href = (target == "local")? "http://localhost" : target;

  before(async function(){
    expect(target).to.be.ok;
    if (target == "local"){
      let serve = serveStatic(local_site_files, {
        'index': ['index.html', 'index.htm'],
        'extensions': ["html"]
      });
      server = http.createServer(function onRequest (req, res) {
        serve(req, res, finalhandler(req, res))
      });
      await util.promisify(server.listen.bind(server))(0);
      href += ":"+ server.address().port;
      console.log("listening on : ",href);
    }
    browser = await puppeteer.launch(options);
  });
  after(async () => {
    let jobs = []
    if (browser){
      jobs.push(browser.close());
    }
    if (server){
      jobs.push(util.promisify(server.close.bind(server))());
    }
    return await Promise.all(jobs);
  });

  it("initialize browser",()=>{
    expect(browser).to.be.not.null;
  });

  ["fr","en"].forEach((lang)=>{
    describe(`${lang}.`,function(){

      describe("Can load index aliases",function(){
        beforeEach(async function(){
          this.page = await newPage();
          await block(this.page,["images", "medias", "analytics", "captcha"]);
        })
        afterEach(async function(){
          await this.page.close();
        });
        [
          `${lang}/`,
          `${lang}`,
          `${lang}/index`,
          `${lang}/index.html`
        ].forEach((l)=>{
          it(`GET ${href}/${l}`,async function(){
            await this.page.goto(`${href}/${l}`,{timeout:10000});
            const title = await this.page.$eval("TITLE",h => h.innerText);
            expect(title).to.be.a.string;
            expect(title).to.match(/holusion/i);
          });
        });
      })
      describe(`/${lang}/ UI`,function(){
        let page;
        before(async function(){
          page = await newPage();
          //In those tests, it's important to have at least
          // `page.setRequestInterception(true)` somewhere
          await block(page,["images", "medias", "analytics", "captcha"]);
          await page.goto(`${href}/${lang}/`);
        });

        after(async function(){
          await page.close();
        });
        it("Has links to same lang in top navbar",async function(){
          const nav_links = await page.$$eval("#navbar-collapse-1 .nav-link", links => {
            return Promise.resolve(links.map(l => l.href));
          });
          expect( nav_links).to.be.ok;
          expect(nav_links).to.have.property("length").above(1);
          nav_links.forEach(a =>{
            expect(a).to.match(new RegExp(`/(dev/)?${lang}/`));
          })
        });
      })
      describe(`/${lang}/ contact form validation`,function(){
        let page;
        before(async function(){
          page = await newPage();
          //In those tests, it's important to have at least
          // `page.setRequestInterception(true)` somewhere
          await block(page,["images", "medias", "analytics", "captcha"]);
          await page.goto(`${href}/${lang}/`);
          await page.waitForSelector("#contactform-modal.is-ready");
          //Remove animations to speed up tests
          await page.$eval("#contactform-modal.fade", e=>{e.classList.remove("fade")});
          page.on('request', function(r){
            let path = r.url();
            if (path == "/contact.php"){
              r.respond(`{"code":200,"message":"OK}`);
            }
          })
        });
        after(async function(){
          await page.close();
        });
        //We don't reload the page, tests may leak
        beforeEach(async function(){
          await page.click("#navbar-contact-button");
          this.form = await page.waitForSelector("#contactform-modal.show");
          this.write = (async function (name, txt){
            let selector = `#contactform-modal [name="${name}"]`
            //Looks like input is not necessarily cleared otherwise
            await page.$eval(selector, e => {e.value = ""})
            if(txt){
              await page.type(selector, txt);
            }
            return await page.$eval(selector, e => e.checkValidity())
          })
        })
        afterEach(async function(){
          //await page.evaluate("closeForm()")
        })
        it("set-up shows contact form", async function(){
          expect(this.form).to.be.ok;
        })
        it("click close contact form", async function(){
          await page.click('#contactform-modal [data-dismiss="modal"]');
          await page.waitForSelector("#contactform-modal:not(.show)");
        })
        //Accept various types of fake data
        const faker_locales = ["en", "fr", "zh_CN"];
        faker_locales.forEach(function(faker_locale){
          describe(`Random data for : ${faker_locale} locale`, function(){
            faker.locale = faker_locale;
            const faker_map = {
              fname: faker.name.firstName,
              lname: faker.name.lastName,
              email: faker.internet.email,
              phone: faker.phone.phoneNumber,
              comments: faker.random.words
            }
            Object.keys(faker_map).forEach(function (k){
              // 5 is not a lot. If someday it misses exceptions, boost it
              for (let i = 0; i <5; i++){
                let item = faker_map[k]();
                it(`accept valid ${k} : ${item}`,async function(){
                  expect(await this.write(k,item), `Expect "${item}" to be a valid ${k}`).to.be.true;
                })
              }
            })
          })
        })
        //Reject empty
        const fields = ["fname", "lname", "comments", "email"]
        fields.forEach(function(k){
          it(`requires ${k} to be not empty`, async function(){
            expect(await this.write(k,""), `empty ${k} should not verify`).to.be.false;
          });
        })
      })//End of form validation


      describe(`GET /${lang}/store/`,function(){
        let storePage;
        let thumb_cells;
        let links;
        this.timeout(20000);
        before(async function(){
          storePage = await newPage();
          await block(storePage, ["medias", "analytics", "captcha"]);
          await storePage.goto(`${href}/${lang}/store/`,{timeout:10000});
          thumb_cells = await storePage.$$("[data-test=card]");
          links = await Promise.all(thumb_cells.map(async (cell)=>{
            let a = await cell.$("A");
            let handle = await a.getProperty("href");
            let link = await handle.jsonValue();
            await handle.dispose();
            return link;
          }))
          links = links.filter(l => ! /.*.xml/.test(l))
          return links;
        })
        after(async ()=>{
          await storePage.close();
          for (let cell of thumb_cells){
            cell.dispose();
          }
        })
        it(`has a title with reasonable length`,async ()=>{
          const title = await storePage.$eval("TITLE",h => h.innerText);
          expect(title).to.match(/(store|boutique)/i);
          /* recommended length is in fact <70 but let's not be too conservative */
          expect(title).to.have.lengthOf.within(25,120);
        })
        it(`has some thumbnails`,async ()=>{
          expect(thumb_cells).to.have.property("length").above(MIN_PRODUCTS_NUMBER); //arbitrary "good" number
        });
        it(`thumbnails have same aspect ratio`, async ()=>{
          return await forceSameRatio(thumb_cells);
        });
        it("links to products are absolute",function(){
          expect(links).to.have.property("length").above(MIN_PRODUCTS_NUMBER);
          links.forEach(function(link){
            expect(link).to.match(/^https?:/i);
          })
        })
        it(`Have less than ${MAX_PRODUCTS_NUMBER} pages`,function(){
          expect(links.length).to.be.below(MAX_PRODUCTS_NUMBER,
            "Too much products. Increase MAX_PRODUCTS_NUMBER in runner.js if it's normal."
          );
        })
        describe(`Verify store pages (up to ${MAX_PRODUCTS_NUMBER} products)`,function(){

          //We don't know in advance the size of our array
          for(let i=0;i<MAX_PRODUCTS_NUMBER;i++){
            describe(`test store page [${i}]`,function(){
              let page;
              before(async function(){
                if (links.length <= i) {
                  this.skip();
                  return Promise.resolve();
                }
                let link = links[i];
                console.log(link);
                page = await newPage();
                await block(page,["images", "medias", "analytics", "captcha"]);
                return await page.goto(`${link}`);
              })
              after(async function(){
                if (page){
                  return await page.close();
                }else{
                  return Promise.resolve();
                }

              });
              it("has snipcart buttons",async ()=>{
                const id = await page.$eval(".btn.snipcart-add-item", b=>b.getAttribute("data-item-id"));
                expect(id).to.be.a("string");
                expect(id).to.match(/^[\w+_]+(FR|EN)$/);
              });
            });
          }
        })
      }) //END of store tests
      describe(`GET /${lang}/posts/`,()=>{
        let storePage;
        let thumb_cells;
        before(async ()=>{
          storePage = await newPage();
          await block(storePage, ["medias", "analytics", "captcha"]);
          await storePage.goto(`${href}/${lang}/store/`,{timeout:10000});
            thumb_cells = await storePage.$$("[data-test=card]");
          });
        after(async ()=>{
          await storePage.close();
          for (let cell of thumb_cells){
            cell.dispose();
          }
        });
        it(`has cards`,()=>{
          expect(thumb_cells).to.have.property("length").above(1);
        })
        it(`cards have unique aspect ratio`, async ()=>{
          return await forceSameRatio(thumb_cells);
        });
      })
      describe(`GET /${lang}/products/`,function(){
        let storePage;
        let thumb_cells;
        let links;
        this.timeout(20000);
        before(async ()=>{
          storePage = await newPage();
          await block(storePage, ["medias", "analytics", "captcha"]);
          await storePage.goto(`${href}/${lang}/products/`,{timeout:10000});
          thumb_cells = await storePage.$$("[data-test=card]");
          links = await Promise.all(thumb_cells.map(async (cell)=>{
            let a = await cell.$("A");
            let handle = await a.getProperty("href");
            let link = await handle.jsonValue();
            await handle.dispose();
            return link;
          }));
          return;
        });
        after(async ()=>{
          for (let cell of thumb_cells){
            cell.dispose();
          }
          return await storePage.close();
        });
        it(`has thumbnails`,()=>{
          expect(thumb_cells).to.have.property("length").above(1);
        })
        it(`thumbnails have same aspect ratio`, async ()=>{
          return await forceSameRatio(thumb_cells)
        });
        describe(`Verify product pages (up to ${MAX_PRODUCTS_NUMBER} products)`,function(){
          //We don't know in advance the size of our array
          for(let i=0;i<MAX_PRODUCTS_NUMBER;i++){
            describe(`test product [${i}]`,function(){
              let page;
              before(async function(){
                let link = links[i];
                if (links.length <= i || /products\/$/.test(link)) {
                  this.skip();
                  return Promise.resolve();
                }
                console.log(link);
                page = await newPage();
                await block(page,["medias", "analytics", "captcha"]);
                return await page.goto(`${link}`);
              })
              after(async function(){
                if (page){
                  return await page.close();
                }else{
                  return Promise.resolve();
                }
              });
              /*
              it("has carousel with all identical images",async ()=>{
                const slides = await page.$$(".carousel-inner>.carousel-item");
                expect(slides,
                  `have unreasonable carousel length in ${links[i]}`
                ).to.have.property("length").above(1).below(10);
                await forceSameRatio(slides);
              });
              //*/
            });
          }
        })
      })
    });

  }); //END of localized tests

  describe(`quality verifications`, function(){
    /*
     * Performs various quality checks to try and detect cache corruptions
     */


    describe("has low noise on assets images", function(){
      let page;
      before(async function(){
        page = await newPage();
        await block(page, ["analytics", "captcha"]);
        await page.goto(`${href}/fr/`,{timeout:10000});
      })
      after(async function(){
        await page.close();
      })
      for (let device of target_devices){
        it(`checks header image noise on ${device.name}`, async function(){
          this.retries(0);
        //Check noise for each target device
          await page.emulate(device);
          const header = await page.waitForSelector("PICTURE#main-header-picture IMG", {timeout: 5000});
          let currentSrc = await header.getProperty("currentSrc").then(v => v.jsonValue());
          if(!currentSrc){
            currentSrc = await header.getProperty("src").then(v => v.jsonValue());
          }
          let origPath;
          if(/\/assets\/[0-9A-F]{6}-[0-9A-F]{64}\.jpg$/i.test(currentSrc)){
            const mainSrc = await header.getProperty("src").then(v => v.jsonValue());
            const {path:srcPath} = url.parse(mainSrc);
            const parts = srcPath.split("/")
            origPath = path.join(local_assets_files, srcPath.replace("assets/", "").replace(/-[0-9A-F]{64}\.jpg$/i,".jpg"));
          }else{
            const {path:srcPath} = url.parse(currentSrc);
            origPath = path.join(local_assets_files, srcPath.replace("assets/", "").replace(/-[0-9A-F]{64}\.jpg$/i,".jpg"));
          }
          expect(origPath).to.be.ok;

          //*
          const diff = await new Promise((resolve, reject)=>{
            exec(`curl -sSL "${currentSrc}" | convert "${origPath}" - -trim +repage -resize 256x256^! -metric PSNR -format "%[distortion]" -compare info:`, function(error, stdout, stderr){
              if(error) return reject(error);
              if(stderr) return reject(stderr);
              resolve(stdout);
            })
          })
          //Depending on version, PSNR diff of identical images could be "inf" or "0"
          if(diff !=="inf" && diff !== "0"){
            expect(parseInt(diff), `PSNR of exported images should be above 40db. Got ${Math.round(diff)}db from ${currentSrc}`).to.be.above(40);
          }
        })
      }
    })

    describe("Has moov atom set to faststart on videos", ()=>{
      it(`checks every files in /static/video`, async function (){
        this.slow(10000);
        this.timeout(15000);
        const walk = async (dir)=>{
          let files = await fs.promises.readdir(dir, {withFileTypes: true})
          files = await Promise.all(files.map(f => {
            return f.isDirectory()? walk(path.join(dir, f.name)): Promise.resolve(path.join(dir, f.name))
          }))

          files = files.reduce((list, fileOrList)=>{
            if(Array.isArray(fileOrList)){
              return list.concat(fileOrList)
            }else{
              return list.concat([fileOrList]);
            }
          }, []);
          return  files;
        }

        const files = await walk(path.join(local_site_files, "static/video"));
        let results = await Promise.all(files.map(file=>{
          return new Promise((resolve, reject)=>{
            let out = [], txt = [];
            const cmd = spawn(`ffmpeg`, ["-y", "-nostdin", "-v", "trace", "-i", file]);
            cmd.on("error", reject);
            const onData =(d) => {
              for (let line of d.toString().split("\n")){
                if(! /^\[[^\]]+\]\s*(stts:|AVIndex|count=\d+)/.test(line)) txt.push(line);
              }
            }
            cmd.stdout.on("data", onData)
            cmd.stderr.on("data", onData)
            cmd.on("close", (code)=>{
              if([0,1].indexOf(code) === -1) { //code 1 is also acceptable
                console.error("ffmpeg failed with code %d full output : %s", code, txt.join("\n"));
                return reject(new Error(`ffmpeg for ${file} exited with status : ${code}.`))
              }
              resolve([file, txt]);
            });
          });
        }));
        for (let [file, lines] of results){
          const moovIndex = lines.findIndex(l=> /type:'moov'/.test(l));
          const mdatIndex = lines.findIndex(l=> /type:'mdat'/.test(l));
          expect(moovIndex, `expected 'moov' atom to be present in output of ${file}. Output is : ${lines.join("\n")}`).to.not.equal(-1);
          expect(moovIndex, `expected 'moov' to be before 'mdat' in ${file}. This probably means encoding wasn't done right`).to.be.below(mdatIndex);
        }
      })
      //
    })
  })

   /** EXTENDED TESTS **/
   describe(`sitemap.`,function(){
     const sitemap = parseString(fs.readFileSync(path.join(local_site_files,"sitemap.xml"), 'utf8'));
     it("have a urlset and many children",function(done){
       //Perform basic validation on sitemap
       expect(sitemap.root).to.have.property("name", "urlset");
       expect(sitemap.root).to.have.property("children").to.be.an("array").that.have.property("length").above(50);
       done()
     });

     const locations = sitemap.root.children
     .map((node)=>{
       return node.children.find((child)=>{
         return child.name == "loc";
       }).content
     })
     .filter(n => n) //remove any undefined content
     .map((loc)=> (target== "local")?loc.replace(/^https?:\/\/[^\/]+/, ""):loc);
     
    it("Have no PDF or XML files",function(){
      const filtered_locs = locations.filter((loc)=>{ //remove pdf files
        return ! /\.(pdf|xml)$/.test(loc);
      });
      expect(filtered_locs).to.deep.equal(locations);
    });
    /**
     * End of standard tests
     */
    if (!is_extended) return;
    // Perform load tests for EVERY location (can be quite long...)
    
    describe("(EXTENDED)",function(){
      for (let loc of locations){
        describe(`page ${loc}`,function(){
          let page;
          let ln;
          before(async ()=>{
            //sitemap is generated for a specific target. If target = local, our current test server will not match this target.
            ln = path.join(href,loc);
            page = await newPage();
            await block(page,["medias", "analytics", "captcha"]);
            await page.goto(`${ln}`, {timeout:9000, waitUntil: "domcontentloaded"});
          });
          after(async()=>{
            return await page.close();
          });
          it(`check canonical link for ${loc}`,async ()=>{
            let c_link = await page.$eval("LINK[rel=canonical]",h => h.href);
            expect(
              c_link.replace(/^https?:\/\/[^\/]+/, ""),
              `canonical link ${c_link} seems invalid`
            ).to.equal(loc);
            return c_link;
          });
          it("Check for deprecated classes",async ()=>{
            await Promise.all([
              ".main-header-body.full-width",
              ".main-header-body:not(.container) .container", //ie11 makes text overflow when .container is aplied to children instead of header-body
              ".section-main-header > div:not(.main-header-image-wrapper):not(.main-header-body):not(.main-header-overlay)"
            ].map(async(sel)=>{
              const invalid_elements = await page.$$(sel);
              expect(invalid_elements, `"${sel}" should not match anything. Found ${invalid_elements.length} results`).to.have.property("length", 0);
              
            }));
          })

        });

        describe(`device fit for ${loc}`, function(){
          let ln;
          let devicePage;
          before(()=>{
            //sitemap is generated for a specific target. If target = local, our current test server will not match this target.
            ln = path.join(href,loc);
          });

          beforeEach(async ()=>{
            devicePage = await newPage();
          });
          afterEach(async ()=>{
            await devicePage.close();
          })
          for (let device of target_devices){
            it(`has no h-scroll on ${device.name}`, async function(){
              await devicePage.emulate(device);
              await devicePage.goto(ln, {timeout:9000, waitUntil: "domcontentloaded"});
              let scrollX = await devicePage.evaluate(()=>{
                window.scrollBy(1,0);
                return Promise.resolve(window.scrollX);
              })
              expect(scrollX, `Horizontal scroll should be locked to 0`).to.equal(0);
            });
          }
        })
      }
    })
  });
});
