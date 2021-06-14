'use strict';



["fr","en"].forEach((lang)=>{
  describe(`${lang}.`,function(){

    describe("Can load index aliases",function(){
      before(async function(){
        this.page = await this.newPage({block:true});
      });
      [
        `${lang}/`,
        `${lang}`,
        `${lang}/index`,
        `${lang}/index.html`
      ].forEach((l)=>{
        it(`GET /${l}`,async function(){
          await this.page.goto(`${href}/${l}`,{timeout:9000});
          const title = await this.page.$eval("TITLE",h => h.innerText);
          expect(title).to.be.a.string;
          expect(title).to.match(/holusion/i);
        });
      });
    });

    describe(`/${lang}/ navbar links`,function(){
      let page;
      before(async function(){
        page = await this.newPage({block: true});
        //In those tests, it's important to have at least
        // `page.setRequestInterception(true)` somewhere
        await page.goto(`${href}/${lang}/`, {timeout:9000});
      });
      it("Has links to same lang in top navbar",async function(){
        const nav_links = await page.$$eval("#navbar-collapse-1 .nav-link", links => {
          return Promise.resolve(links.map(l => l.href));
        });
        expect( nav_links).to.be.ok;
        expect(nav_links).to.have.property("length").above(1);
        nav_links.forEach(a =>{
          expect(a).to.match(new RegExp(`/(dev/)?${lang}/`));
        })
      });
    })
  });

}); //END of localized tests
