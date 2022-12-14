'use strict';
const fs = require("fs/promises");
const { expect } = require("chai");
const faker = require("faker");
const path = require("path");



["fr","en"].forEach((lang)=>{
  describe(`/${lang}/store/ order`,function(){
    this.bail(true);
    let page;

    before(async function(){
      page = await this.newPage({block: true});
      let strings = await fs.readFile(path.join(__dirname, "fixtures/snipcart_fr.json"), {encoding:"utf8"});
      page.on("request", function(interceptedRequest){
        let url = interceptedRequest.url();
        if(url.indexOf("cdn.snipcart.com/themes/v3.3.0/l10n/fr.json") !== -1){
          interceptedRequest.respond({
            status: 200,
            contentType: "application/json",
            headers:{
              "Access-Control-Allow-Origin": "*",
            },
            body: strings,
          }, 1);
        }
        interceptedRequest.continue();
      })
      await page.deleteCookie(... await page.cookies(`${href}/${lang}/store/`));
      await page.goto(`${href}/${lang}/store/`);
      await page.waitForSelector(`[data-test="store-main"]`);
    });

    it("have an empty cart", async function(){
      let items = await page.$$eval(`[data-test="snipcart-items"]`, cartItems=>{
        return cartItems.map(c=>c.textContent);
      });
      expect(items, `No snipcart item total count found`).to.have.property("length").above(0);
      for(let item of items){
        expect(item).to.equal("0");
      }
    });
    it("snip-layout is not shown", async function(){
      try{
        await page.$eval(".snip-layout", l=> l.style.display);
        expect.fail(".snip-layout should not match any visible DomNode");
      }catch(e){}
    });
    it("can navigate to an item", async function(){
      await page.click(`[data-test="store-item-card"] A[href="/${lang}/store/pixel"]`);
      await page.waitForSelector(`[data-test="store-item"]`);
    });

    it("can add this item to the cart", async function(){
      await page.waitForSelector(`#snipcart`, {timeout: 2000}), //Created when snipcart has really loaded
      await page.evaluate(()=>Snipcart.ready);
      await page.click(`[data-test="store-add"]`);
    });
    it("opens the snipcart layout", async function(){
      await page.waitForSelector(".snipcart-modal__container", {visible: true, timeout:2000});
      await page.waitForSelector(".snipcart-item-line", {timeout:4000});
    });
    it("cart is no longer empty", async function(){
      let items = await page.$$eval(`[data-test="snipcart-items"]`, cartItems=>{
        return cartItems.map(c=>c.textContent);
      });
      expect(items, `No snipcart item total count found`).to.have.property("length").above(0);
      for(let item of items){
        expect(item).to.equal("1");
      }
    });
    it("can go to checkout", async function(){
      await page.click("FOOTER.snipcart-cart__footer-buttons > .snipcart-button-primary");
      await page.waitForSelector("#snipcart-checkout-step-billing", {timeout: 1000});
    });
    it("phone number into custom field", async function(){
      let ref = `#snipcart-billing-form INPUT[name="phoneNumber"]`;
      let locales = ["fr"];
      for(let i=0; i<9; i++){
        locales.push(faker.random.locale());
      }
      for(let locale of locales){
        faker.locale = locale;
        let number = faker.phone.phoneNumber();
        await page.type(ref, number);
        expect(await page.$eval(ref, e=>{
          let valid = e.checkValidity(); 
          e.value = '';
          return valid;
        }), `Phone number "${number}" from locale "${locale}" is considered invalid`).to.be.true;
      }
    });
  });
});
