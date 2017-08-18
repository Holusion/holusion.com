'use strict';
const selenium = require ('selenium-webdriver');
const By = selenium.By;
const until = selenium.until;
const expect = require("chai").expect;
require("chai").should();
const jsdom = require("jsdom");

const url = require('url').Url;

var browser = process.env["BROWSER"]||"phantomjs";

let driver = new selenium.Builder().forBrowser(browser).build();
let target = process.argv[3]||process.env["TARGET"];




describe(`Test : ${target}`, function(){
  this.slow(2000);
  this.timeout(6000);
  before(function(){
    expect(target).to.be.ok;
  });
  after(function(){
    driver.quit();
  });
  describe("HTTPS",()=>{
    let l_target = new url("/");
    l_target.protocol = "https";
    l_target.hostname = target;
    let href = l_target.format();
    ["fr","en"].forEach((lang)=>{
      [
        `${href}/${lang}/`,
        `${href}/${lang}`,
        `${href}/${lang}/index`,
        `${href}/${lang}/index.html`
      ].forEach((l)=>{
        it(`GET ${l}`,()=>{
          return driver.get(`${l}`)
          .then(()=>driver.getTitle())
          .then((title)=> title.should.match(/holusion/))
        });
      })


      const store_products = {
        "pixel":{name:"Pixel"},
        "pixelxl":{name:"Pixel XL"},
        "pixelplus":{name:"Pixel +"},
        "opalv":{name:"Opal"},
        "opalh":{name:"Opal"}
      }
      it(`GET ${href}/${lang}/store/`,()=>{
        return driver.get(`${href}/${lang}/store/`)
        .then(_=>driver.getTitle())
        .then((title)=> title.should.match(/(store|boutique)/i))
        .then(_=> driver.findElements(By.css(".thumbnail>a")))
        .then((thumbs)=>{
          expect(thumbs).to.have.property("length").above(0);
          //We start an iteration on each shop page from shop index list
          return Promise.all(thumbs.map(t=> t.getAttribute("href")))
        })
        .then((hrefs)=>{
          Object.keys(store_products).forEach(function(p) {
            expect(p).to.satisfy(function(p){
              return hrefs.some(function(link){
                return link.indexOf(`/${lang}/store/p`) != -1;
              })
            }, `expect every poroduct to be in store index. Missing "${p}"`)
          })
        })
      });

      Object.keys(store_products).forEach((product)=>{
        let pageLink = `${href}/${lang}/store/${product}`;
        describe(`GET ${pageLink}`,()=>{
          let page;
          before(function(){
            page = driver.get(pageLink);
            return page; //trigger wait until it's done.
          })
          it("Has product name in title",function(){
            return page.then(_=>driver.getTitle())
            .then((title)=>title.should.match(new RegExp(store_products[product].name,"i")))
          })
          it("Have snipcart properties",function(){
            return page.then(_=>driver.findElement(By.css(".button.snipcart-add-item")))
            .then((btn)=>{
              return Promise.all([
                btn => btn.getAttribute("data-item-name")
                  .then((name)=>name.should.be.a.string),
                btn => btn.getAttribute("data-item-price")
                  .then((name)=>name.should.match(/[0-9.]+/)),
                btn => btn.getAttribute("data-item-url")
                  .then((name)=>name.should.equal(pageLink)),
                btn => btn.getAttribute("data-item-description")
                  .then((name)=>name.should.be.a.string.of.length.above(20)),
               ]);
             });
          });
        });
      });
    });
  });
})
