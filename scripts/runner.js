'use strict';
const http = require('http');
const path = require("path");
const url = require('url');
const util = require('util');
const fs = require("fs");

const puppeteer = require('puppeteer');
//Tools to serve the site locally
const serveStatic = require("serve-static");
const finalhandler = require('finalhandler');
//XML parser for sitemap.xml test & analysis
const parseString = require('xml-parser');
const expect = require("chai").expect;

const MIN_PRODUCTS_NUMBER = 4;
const MAX_PRODUCTS_NUMBER = 10;

const local_site_files = path.resolve(__dirname,'../_site');

const target = process.env["TARGET"];
const is_extended = process.env["RUN_EXTENDED_TESTS"];
const options = {
  //headless:false,
  args:["--no-sandbox"]
};

console.log("Extended tests : ", is_extended);

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
    //console.log(interceptedRequest.url);
    if(
      (types.indexOf("images") != -1 &&(
         interceptedRequest.url.endsWith('.png')
      || interceptedRequest.url.endsWith('.jpg')
    )) ||(types.indexOf("medias") != -1 &&(
         interceptedRequest.url.endsWith('.mp4')
      || interceptedRequest.url.endsWith('.ogv')
      || interceptedRequest.url.endsWith('.webm')
      || interceptedRequest.url.indexOf("youtube.com") != -1
      || interceptedRequest.url.indexOf("www.ultimedia.com") != -1
    )) || (types.indexOf("analytics") != -1 &&(
      interceptedRequest.url.indexOf("google-analytics.com") != -1
    ))|| (types.indexOf("captcha") != -1 &&(
      interceptedRequest.url.indexOf("gstatic.com") != -1
    )) || filter(interceptedRequest.url)
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
    map.push(`${dim} : ${srcs.join(", ")}`);
  }
  return map
}

async function getImgSize(img){
  const src = await img.getProperty("src").then(v => v.jsonValue());
  const width = await img.getProperty("naturalWidth").then(v => v.jsonValue());
  const height = await img.getProperty("naturalHeight").then(v => v.jsonValue());
  const ok = Number.isInteger(width) && Number.isInteger(height) && 0 < width && 0 < height;
  return { src, width, height, ok};
}

describe(`${target}`,function(){
  let browser;
  let server = null;
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
    return await puppeteer.launch(options).then(async (b) => {
      browser = b;
    });
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
    describe(`${lang}`,function(){

      describe("Can load index aliases",function(){
        beforeEach(async function(){
          this.page = await browser.newPage();
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

      describe(`GET /${lang}/store/`,function(){
        let storePage;
        let thumb_cells;
        let links;
        this.timeout(20000);
        before(async function(){
          storePage = await browser.newPage();
          await block(storePage, ["medias", "analytics", "captcha"]);
          await storePage.goto(`${href}/${lang}/store/`,{timeout:10000});
          thumb_cells = await storePage.$$(".thumbnail-cell");
          links = await Promise.all(thumb_cells.map(async (cell)=>{
            let a = await cell.$("A");
            let handle = await a.getProperty("href");
            let link = await handle.jsonValue();
            await handle.dispose();
            return link;
          }));
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
        it(`thumbnails have 16:9 aspect ratio`, async ()=>{
          await Promise.all(thumb_cells.map(async (cell)=>{
            const thumb = await cell.$("IMG");
            const size = await thumb.boundingBox();
            let expected_width = Math.floor(size.height*16/9);
            expect(size.height).to.be.above(10); //Abritrary "acceptable" number
            //Ignore rounding errors
            expect(size.width).to.be.within(expected_width,expected_width+1);
          }));
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
        describe(`Verify product pages (up to ${MAX_PRODUCTS_NUMBER} products)`,function(){

          //We don't know in advance the size of our array
          for(let i=0;i<MAX_PRODUCTS_NUMBER;i++){
            describe(`test product [${i}]`,function(){
              let page;
              before(async function(){
                if (links.length <= i) {
                  this.skip();
                  return Promise.resolve();
                }
                let link = links[i];
                console.log(link);
                page = await browser.newPage();
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
                const id = await page.$eval(".button.snipcart-add-item", b=>b.getAttribute("data-item-id"));
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
          storePage = await browser.newPage();
          await block(storePage, ["medias", "analytics", "captcha"]);
          await storePage.goto(`${href}/${lang}/store/`,{timeout:10000});
            thumb_cells = await storePage.$$(".thumbnail-cell");

          });
        after(async ()=>{
          await storePage.close();
          for (let cell of thumb_cells){
            cell.dispose();
          }
        });
        it(`has thumbnails`,()=>{
          expect(thumb_cells).to.have.property("length").above(1);
        })
        it(`thumbnails have 16:9 aspect ratio`, async ()=>{
          await Promise.all(thumb_cells.map(async (cell)=>{
            const thumb = await cell.$("IMG");
            const size = await thumb.boundingBox();
            let expected_width = Math.floor(size.height*16/9);
            expect(size.height).to.be.above(10); //Abritrary "acceptable" number
            //Ignore rounding errors
            expect(size.width).to.be.within(expected_width,expected_width+1);
          }));
        });
      })
      describe(`GET /${lang}/products/`,function(){
        let storePage;
        let thumb_cells;
        let links;
        this.timeout(20000);
        before(async ()=>{
          storePage = await browser.newPage();
          await block(storePage, ["medias", "analytics", "captcha"]);
          await storePage.goto(`${href}/${lang}/products/`,{timeout:10000});
          thumb_cells = await storePage.$$(".thumbnail-cell");
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
        it(`thumbnails have 16:9 aspect ratio`, async ()=>{
          let images = await Promise.all(thumb_cells.map(async (cell)=>{
            return await getImgSize(await cell.$("IMG"));
          }));
          images.forEach((img)=>{
            expect(img.ok, `${img.src} is not OK (probably: does not exists)`).to.be.true;
          });
          //console.log(images);
          let ratios = prettySet(images.map(img=> Object.assign(img,{ratio:img.width/img.height})), "ratio");
          expect(ratios, `Have non-unique ratio : \n\t${ratios.join("\n\t")}`).to.have.property("length", 1);
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
                page = await browser.newPage();
                await block(page,["medias", "analytics", "captcha"],function(url){
                  return url == "/vendor/ideal-image-slider/ideal-image-slider.min.js";
                });
                return await page.goto(`${link}`);
              })
              after(async function(){
                if (page){
                  return await page.close();
                }else{
                  return Promise.resolve();
                }
              });
              it("has carousel with all identical images",async ()=>{
                const slides = await page.$$eval(".slides>A.iis-slide",(slides)=>{
                  let res = [];
                  for (let elem of slides){
                    let src = elem.getAttribute("data-src");
                    let width = parseInt(elem.getAttribute("data-actual-width"))
                    let height = parseInt(elem.getAttribute("data-actual-height"))
                    if (width && height){
                      //Image has already been loaded
                      res.push( Promise.resolve ({src, width, height}));
                    }else{
                      res.push(new Promise((resolve, reject)=>{
                        let img = new Image();
                        img.onload = ()=>{
                          resolve({src: src, width: img.naturalWidth, height: img.naturalHeight});
                        }
                        img.src = src;
                        document.body.appendChild(img); //Necessary?
                      }));
                    }
                  }
                  return Promise.all(res);
                });

                expect(slides,
                  `have unreasonable carousel length in ${links[i]}`
                ).to.have.property("length").above(1).below(10);

                let widths = prettySet(slides,"width")
                let heights = prettySet(slides,"height")
                expect(widths, `Have multiple different heights : \n\t${widths.join("\n\t")}`).to.have.property("length",1);
                expect(heights, `Have multiple different heights : \n${heights.join("\n")}`).to.have.property("length",1);

              });
            });
          }
        })
      })
    });

  }); //END of localized tests
  /**
   * End of standard tests
   */
   if (!is_extended) return;
  describe(`Extended tests`,function(){
    const sitemap = parseString(fs.readFileSync(path.join(local_site_files,"sitemap.xml"), 'utf8'));
    before(function(){
      expect(sitemap.root).to.have.property("name", "urlset");
      expect(sitemap.root).to.have.property("children").to.be.an("array").that.have.property("length").above(50);
    });
    let locations = sitemap.root.children.map((node)=>{
      return node.children.find((child)=>{
        return child.name == "loc";
      }).content

    })
    .filter(n => n)
    .filter((loc)=>{
      //remove pdf files
      return ! /\.(pdf|xml)$/.test(loc)
    })
    .map((loc)=> (target== "local")?loc.replace(/^https?:\/\/[^\/]+/, ""):loc)
    for (let loc of locations){
      describe(`${loc}`,function(){
        let page;
        let ln = loc;
        before(async ()=>{
          //sitemap is generated for a specific target. If target = local, our current test server will not match this target.
          ln = path.join(href,loc);
          page = await browser.newPage();
          await block(page,["images", "medias", "analytics", "captcha"]);
          return await page.goto(`${ln}`);
        });
        after(async()=>{
          return await page.close();
        });
        it("have correct canonical link",async ()=>{
          let c_link = await page.$eval("LINK[rel=canonical]",h => h.href);
          expect(c_link.replace(/^https?:\/\/[^\/]+/, "")).to.equal(loc);
          return c_link;
        });
      });
    }
  });
});
