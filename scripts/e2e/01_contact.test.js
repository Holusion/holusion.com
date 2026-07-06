'use strict';

const { allFakers } = require("@faker-js/faker");


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
      await page.$eval("#contactform-modal.fade", e=>{ e.classList.remove("fade")});
    });
    //We don't reload the page, tests may leak
    beforeEach(async function(){
      // Under parallel load the first click can land before Bootstrap has
      // wired the modal trigger, leaving the modal closed and timing out the
      // hook. Retry the click until the modal actually opens.
      await page.waitForSelector(`[data-test="navbar-contact-button"]`);
      this.form = null;
      for(let attempt = 0; attempt < 3 && !this.form; attempt++){
        // Use a direct DOM click rather than page.click(): under parallel load
        // page.click() can block for its full clickability timeout (>20s) and
        // get killed by the mocha hook timeout before we can retry.
        await page.$eval(`[data-test="navbar-contact-button"]`, el=> el.click());
        this.form = await page.waitForSelector("#contactform-modal.show", {timeout: 5000}).catch(()=>null);
      }
      if(!this.form) throw new Error("contact form modal did not open");
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
      await page.click('#contactform-modal [data-bs-dismiss="modal"]');
      await page.waitForSelector("#contactform-modal:not(.show)");
    })
    //Accept various types of fake data
    const faker_locales = ["en", "fr", "zh_CN"];
    faker_locales.forEach(function(faker_locale){
      describe(`${faker_locale} locale`, function(){
        const faker = allFakers[faker_locale];
        const faker_map = {
          fname: ()=> faker.person.firstName(),
          lname: ()=> faker.person.lastName(),
          email: ()=> faker.internet.email(),
          phone: ()=> faker.phone.number(),
          comments: ()=> faker.lorem.words()
        }
        Object.keys(faker_map).forEach(function (k){
          it(`accept random ${k}`, async function(){
            // not a lot. If someday it misses exceptions, boost it
            for (let i = 0; i <3; i++){
              let item = faker_map[k]();
              expect(await this.write(k,item), `Expect "${item}" to be a valid ${k}`).to.be.true;
            }
          })
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
