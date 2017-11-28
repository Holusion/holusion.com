'use strict';
const puppeteer = require('puppeteer');
const serveStatic = require("serve-static");
const finalhandler = require('finalhandler');
const http = require('http');
const path = require("path");
const expect = require("chai").expect;
const url = require('url');

const MIN_PRODUCTS_NUMBER = 4;
const MAX_PRODUCTS_NUMBER = 10;


const target = process.env["TARGET"];
const href = (target == "local")? "http://localhost:4005" : target;

const options = {
  //headless:false,
  args:["--no-sandbox"]
};

async function blockMedias(page){
  await page.setRequestInterception(true);
  page.on('request', interceptedRequest => {
    if (interceptedRequest.url.endsWith('.png')
    || interceptedRequest.url.endsWith('.jpg')
    || interceptedRequest.url.endsWith('.mp4')
    ){
      interceptedRequest.abort();
      //console.log("Aborted : ",interceptedRequest.url)
    }else
      interceptedRequest.continue();
  });
}

describe(`${target}`,function(){
  let browser;
  let server = null;
  before(async() => {
    expect(target).to.be.ok;
    if (target == "local"){
      let serve = serveStatic(path.resolve(__dirname,'../_site'), {
        'index': ['index.html', 'index.htm'],
        'extensions': ["html"]
      });
      server = http.createServer(function onRequest (req, res) {
        serve(req, res, finalhandler(req, res))
      });
      await server.listen(4005);
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
      jobs.push(server.close());
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
          await blockMedias(this.page);
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
              await page.goto(`${link}`);
              const btn = await page.$(".button.snipcart-add-item");
              const id = await page.$eval(".button.snipcart-add-item", b=>b.getAttribute("data-item-id"));
              expect(id).to.be.a("string");
              expect(id).to.match(/^[\w+_]+(FR|EN)$/);
              await page.close();
            });
          }
        })
      })
    });
  });
});
