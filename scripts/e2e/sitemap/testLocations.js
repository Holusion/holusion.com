'use strict';

const { expect } = require('chai');
const fs = require('fs');
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
      let ln, jobs;
      before(async ()=>{
        //sitemap is generated for a specific target. If target = local, our current test server will not match this target.
        ln = path.join(href, loc);
      });

      describe(`default : ${target_devices[0].name}`, function(){
        let page;
        let exist_checks = [];
        before(async function(){
          page = await this.newPage({block:["external", "medias"], closeAfter: false})
          page.on("request", (interceptedRequest)=>{
            let url = interceptedRequest.url();
            if(url.startsWith(href) && /\.(?:png|jpe?g|webp)$/i.test(url)){
              const localPath = url.slice(href.length+1).split("/").map(s=>decodeURIComponent(s)).join("/");
              exist_checks.push((async ()=>{
                try{
                  await fs.promises.access(path.resolve(local_site_files, localPath));
                }catch(e){
                  return localPath;
                }
                return undefined;
              })());
            }
          });
          await page.goto(ln, {timeout:15000, waitUntil: "domcontentloaded"});
        });

        after(async ()=>{
          await page.close();
        });

        it(`check canonical link for ${loc}`, async ()=>{
          let c_link = await page.$eval("LINK[rel=canonical]",h => Promise.resolve(h?h.href:null));
          expect(c_link).to.be.a.string;
          expect(
            c_link.replace(/^https?:\/\/[^\/]+/, ""),
            `canonical link ${c_link} seems invalid`
          ).to.equal(loc);
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
        });
  
        it("check for forbidden arrangements", async ()=>{
          const rows_in_rows = await page.$$(".row > .row");
          expect(rows_in_rows, "no \".row\" should be directly contained in another \".row\"").to.have.property("length", 0);
        });
  
        it("'check missing images", async ()=>{
          const missing_files = (await Promise.all(exist_checks)).filter(f=> f);
          expect(missing_files).to.have.property("length", 0, `Missing files : \n`
          + JSON.stringify(missing_files, null, 2)
          +`\n`);
        });
      })

      
      describe("all devices", function(){

        for (let idx=0; idx < target_devices.length; idx++){
          const device = target_devices[idx];
          describe(`${device.name}`, ()=>{
            let page;
            before(async function(){
            });
            after(async function(){
            });

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