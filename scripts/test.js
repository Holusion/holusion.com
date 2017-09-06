'use strict';
const selenium = require ('selenium-webdriver');
const By = selenium.By;
const until = selenium.until;
const expect = require("chai").expect;
require("chai").should();
const jsdom = require("jsdom");

const url = require('url');

var browser = process.env["BROWSER"]||"phantomjs";
let driver = new selenium.Builder().forBrowser(browser).build();
let href = process.env["TARGET"];
let u = url.parse(href);

function get_sizes(items){
  return Promise.all([
    Promise.all(items.map(t =>t.findElements(By.tagName("img")).then((els) => {
      return Promise.all(els.map((el)=>{
        return el.getAttribute("src");
      }))
    }))),
    Promise.all(items.map(t =>t.getSize())),
  ])
  .then((a)=>{
    let hrefs = a[0];
    let sizes = a[1]
    var ref = sizes[0];
    var exp_height = ref.width*9/16;
    expect(ref.height).to.be.within(exp_height-1,exp_height+1);
    sizes.forEach((size, idx)=>{
      expect( size.height,
        `Every thumbnail should have the same height of ${ref.height}px. Got ${size.height}px on :
        ${hrefs[idx]}`
      ).to.equal(ref.height);
    })
  });
}

describe(`${href} :`, function(){
  this.slow(2000);
  this.timeout(6000);
  before(function(){
    expect(href).to.be.ok;
  });
  after(function(){
    driver.quit();
  });

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
        .then((title)=> {
          expect(title).to.match(/holusion/i);
        })
      });
    })


    const store_products = {
      "pixel":{name:"Pixel"},
      "pixelxl":{name:"Pixel XL"},
      "pixelplus":{name:"Pixel +"},
      "opalv":{name:"Opal"},
      "opalh":{name:"Opal"}
    }
    describe(`GET ${href}/${lang}/store/`,()=>{
      let page
      before(()=>{
        page =driver.get(`${href}/${lang}/store/`);
        return page;
      })
      it("has a title with reasonable length",()=>{
        return page.then(_=>driver.getTitle())
        .then((title)=> {
          expect(title).to.match(/(store|boutique)/i);
          /* recommended length is in fact <70 but let's not be too conservative */
          expect(title).to.have.lengthOf.within(25,120);
        })
      })
      it("has thumbnails",()=>{
        return page.then(_=> driver.findElements(By.css(".thumbnail>a")))
        .then((thumbs)=>{
          expect(thumbs).to.have.property("length").above(0);
          //We start an iteration on each shop page from shop index list
          return Promise.all(thumbs.map(t=> t.getAttribute("href")))
          .then((hrefs)=>{
            //Ensure we don't get products list wrong
            let match_names = Object.keys(store_products).join("|");
            let r = new RegExp(`^${href}/${lang}/store/(${match_names})`);
            hrefs.forEach((link)=>{
              expect(link).to.match(r);
            })
            expect(hrefs).to.have.property("length",Object.keys(store_products).length);
            return hrefs;
          })
        })
      })
    });
    //Since we verified in previous test that "store_products" is acurate
    //We can base further store tests on it
    describe("[store products]",function(){
      Object.keys(store_products).forEach((product)=>{
        let pageLink = `${href}/${lang}/store/${product}`;
        describe(`${store_products[product].name}`,()=>{
          let page;
          before(function(){
            page = driver.get(pageLink);
            return page; //trigger wait until it's done.
          })
          it("has valid title",function(){
            return page.then(_=>driver.getTitle())
            .then((title)=>{
              expect(title).to.match(new RegExp(store_products[product].name,"i"));
              /* recommended length is in fact <70 but let's not be too conservative */
              expect(title).to.have.lengthOf.within(25,120);
            })
          })
          it("Have snipcart properties",function(){
            return page.then(_=>driver.findElement(By.css(".button.snipcart-add-item")))
            .then((btn)=>{
              return Promise.all([
                btn => btn.getAttribute("data-item-name")
                  .then((name)=>name.should.be.a.string),
                btn => btn.getAttribute("data-item-price")
                  .then((name)=>name.should.match(/\d+\.\d{2}/)),
                btn => btn.getAttribute("data-item-weight")
                  .then((name)=>name.should.match(/^\d+$/)),
                btn => btn.getAttribute("data-item-url")
                  .then((name)=>name.should.equal(pageLink)),
                btn => btn.getAttribute("data-item-description")
                  .then((name)=>name.should.be.a.string.of.length.above(20)),
               ]);
             });
          });
        });
      });
    })

    /* Check thumbnails */
    describe("[thumbnails]",function(){
      [
        `${href}/${lang}/products/`,
        `${href}/${lang}/store/`,
        `${href}/${lang}/posts/`,
      ].forEach(function(link){
        it(`on ${link}`,function(){
          return driver.get(`${link}`)
          .then(_=> driver.findElements(By.css(".thumbnail>a")))
          .then((thumbs)=> get_sizes(thumbs))
        })
      })
    })
  });
})
