'use strict';

const { expect } = require('chai');
const {promises:fs, constants} = require('fs');
const path = require('path');

module.exports = function testLocations(locations){
  let pages;
  before(async function(){
    pages = await Promise.all(target_devices.map(device=>{
      return;
    }));
  });
  
  for (let loc of locations){
    describe(`page ${loc}`,function(){
      let ln;
      before(async function(){
        //sitemap is generated for a specific target. If target = local, our current test server will not match this target.
        ln = path.join(global.href, loc);
      });

      describe(`default : ${target_devices[0].name}`, function(){
        let page;
        before(async function(){
          page = await this.newPage({block:["external", "medias"], closeAfter: false})
          this.static_checks = this.checkImages(page);
          await page.goto(ln, {timeout:15000, waitUntil: "domcontentloaded"});
        });

        after(async function(){
          await page.close();
        });

        it(`check canonical link for ${loc}`, async function(){
          let c_link = await page.$eval("LINK[rel=canonical]",h => Promise.resolve(h?h.href:null));
          expect(c_link).to.be.a.string;
          expect(
            c_link.replace(/^https?:\/\/[^\/]+/, ""),
            `canonical link ${c_link} seems invalid`
          ).to.equal(loc);
        });
  
        it("Check for deprecated classes",async function(){
          await Promise.all([
            ".main-header-body.full-width",
            ".main-header-body:not(.container) .container", //ie11 makes text overflow when .container is aplied to children instead of header-body
            ".section-main-header > div:not(.main-header-image-wrapper):not(.main-header-body):not(.main-header-overlay)"
          ].map(async(sel)=>{
            const invalid_elements = await page.$$(sel);
            expect(invalid_elements, `"${sel}" should not match anything. Found ${invalid_elements.length} results`).to.have.property("length", 0);
            
          }));
        });

        it("check for deprecation selectors", async function(){
          let deprecated = await page.$$eval("[data-deprecated]", (elems)=>{
            let attrs = [];
            for(let el of elems){ attrs.push(el.dataset.deprecated); }
            return attrs;
          });
          expect(deprecated, `${loc} has the following deprecated elements : ${deprecated.join(", ")}`).to.have.property("length", 0)
        })

        it("check for forbidden arrangements", async function(){
          const rows_in_rows = await page.$$(".row > .row");
          expect(rows_in_rows, "no \".row\" should be directly contained in another \".row\"").to.have.property("length", 0);
        });
  
        it("check missing images", async function(){
          const intercepted_files = await this.static_checks();
          //Some pages DO have no images...
          //expect(intercepted_files).to.have.property('length').above(0);
          const missing_files = intercepted_files.filter(f=> f);
          expect(missing_files,  `Missing files : \n`
          + JSON.stringify(missing_files, null, 2)
          +`\n`).to.have.property("length", 0);
        });
        if(/^\/(fr|en)\/store\/(?!index).+/.test(loc)) {
          describe("store item checks", function(){
            it("has a snipcart button", async function(){
              const btn = await page.$eval(`[data-test="store-add"]`, e=> ({...e.dataset}));
              expect(btn).to.be.ok;
              expect(btn).to.have.property("itemPrice");
              expect(Number.isSafeInteger(parseInt(btn.itemPrice))).to.be.true;
              expect(btn).to.have.property("itemWeight");
              expect(Number.isSafeInteger(parseInt(btn.itemWeight))).to.be.true;
              expect(btn).to.have.property("itemImage");
              try{
                const imageUrl = new URL(btn.itemImage, global.href);
                await fs.access(path.resolve(global.local_site_files, imageUrl.pathname.slice(1)), constants.R_OK)
              }catch(e){
                expect.fail(`Can't access product image file : ${btn.itemImage} : ${e}`);
              }
            });
          });
        }
      });
      
      describe("all devices", function(){

        for (let idx=0; idx < target_devices.length; idx++){
          const device = target_devices[idx];
          describe(`${device.name}`, ()=>{


            it(`has no h-scroll on ${device.name}`, async function(){
              let page = await this.newPage({device, block:["external", "medias"], closeAfter: false});
              try{
                let scrollX = await page.evaluate(()=>{
                  return Promise.resolve(document.scrollingElement.scrollWidth - document.scrollingElement.clientWidth);
                });
                let screenPath = `scr${loc.replace(/\//g, "_")}.jpg`;
                expect(scrollX, `Horizontal scroll capability should be 0.\nScreenshot save at ${screenPath}`).to.equal(0);
              } catch(e){
                await page.screenshot({path: screenPath, fullPage: true});
                throw e;
              } finally{
                await page.close();
              }
             
            });
          })
         
        }
      })
    });
  }
}