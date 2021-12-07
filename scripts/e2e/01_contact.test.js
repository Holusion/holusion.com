'use strict';

const faker = require("faker");


["fr","en"].forEach((lang)=>{
  describe(`/${lang}/ form validation`,function(){
    let page;
    before(async function(){
      page = await this.newPage({block: true });
      //In those tests, it's important to have at least
      // `page.setRequestInterception(true)` somewhere
      await page.goto(`${global.href}/${lang}/`);
      await page.waitForSelector("#contactform-modal.is-ready");
      //Remove animations to speed up tests
      try{
        await page.$eval("#contactform-modal.fade", e=>{ e.classList.remove("fade")});
      }catch(e){
        console.warn("Eval failed with error : ", e);
      }
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
    });

    it("set-up shows contact form", function(){
      expect(this.form).to.be.ok;
    })
    it("can close contact form", async function(){
      await page.click('#contactform-modal [data-dismiss="modal"]');
      await page.waitForSelector("#contactform-modal:not(.show)");
    })
    //Accept various types of fake data
    const faker_locales = ["en", "fr", "zh_CN"];
    faker_locales.forEach(function(faker_locale){
      describe(`${faker_locale} locale`, function(){
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
          for (let i = 0; i <3; i++){
            let item = faker_map[k]();
            it(`accept ${k} : ${item}`,async function(){
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
});
