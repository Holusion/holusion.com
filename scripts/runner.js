'use strict';
const puppeteer = require('puppeteer');
const serveStatic = require("serve-static");
const finalhandler = require('finalhandler');
const http = require('http');
const path = require("path");
const expect = require("chai").expect;
const url = require('url');
const util = require('util');

const MIN_PRODUCTS_NUMBER = 4;
const MAX_PRODUCTS_NUMBER = 10;


const target = process.env["TARGET"];

const options = {
  //headless:false,
  args:["--no-sandbox"]
};

/**
 * Utility function to speed up tests
 * Block selected resources by category
 * Categories are : images, medias, analytics, captcha
 */
async function block(page, types){
  await page.setRequestInterception(true);
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
    )) || (types.indexOf("analytics") != -1 &&(
      interceptedRequest.url.indexOf("google-analytics.com") != -1
    ))|| (types.indexOf("captcha") != -1 &&(
      interceptedRequest.url.indexOf("gstatic.com") != -1
    ))
    ){
      //console.log("Aborted : ",interceptedRequest.url)
      interceptedRequest.respond("");
    }else{
      interceptedRequest.continue();
    }
  });
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
      let serve = serveStatic(path.resolve(__dirname,'../_site'), {
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
            await this.page.goto(`${href}/${l}`,{timeout:6000});
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
        before(async ()=>{
          storePage = await browser.newPage();
          await block(storePage, ["medias", "analytics", "captcha"]);
          await storePage.goto(`${href}/${lang}/store/`,{timeout:6000});
          thumb_cells = await storePage.$$(".thumbnail-cell");
          links = await Promise.all(thumb_cells.map(async (cell)=>{
            let a = await cell.$("A");
            let handle = await a.getProperty("href");
            let link = await handle.jsonValue();
            await handle.dispose();
            return link;
          }));
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
            it(`test link [${i}]`,async ()=>{
              if (links.length <= i) return Promise.resolve();
              let link = links[i];
              let page = await browser.newPage();
              await block(page,["images", "medias", "analytics", "captcha"]);
              await page.goto(`${link}`);
              const btn = await page.$(".button.snipcart-add-item");
              const id = await page.$eval(".button.snipcart-add-item", b=>b.getAttribute("data-item-id"));
              expect(id).to.be.a("string");
              expect(id).to.match(/^[\w+_]+(FR|EN)$/);
              await page.close();
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
          await storePage.goto(`${href}/${lang}/store/`,{timeout:6000});
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
    });

  }); //END of localized tests

});
