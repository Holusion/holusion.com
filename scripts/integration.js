'use strict';
const url = require('url');
const request = require("request");
const expect = require("chai").expect;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var target = process.env["TARGET"];


const uriFixtures = [ //Look for defined response codes on those URL
  ["/", 301],
  ["/fr", 301],
  ["/en", 301],
  ["/fr/", 200],
  ["/fr/index", 200],
  ["/fr/index.html", 200],
  ["/en/", 200],
  ["/fr/something_imaginary", 404],
  ["/en/something_imaginary", 404],
];


function httpsPath(path, lang){
  return url.resolve("https://"+target,path);
}
function httpPath(path, lang){
  return url.resolve("http://"+target,path);
}

function testStatusCode(fixture){ // [path,status]
  it(`GET ${fixture[0]} ${fixture[1]}`,(done)=>{
    //This is to be bound to test context
    request({url:this.t(fixture[0]),followRedirect:false},function(err,res){
      done(err);
      expect(res.statusCode).to.equal(fixture[1]);
    });
  });
}

function is200(p, cb){
  request({url:p,followRedirect:true},function(err,res){
    expect(err).to.be.null;
    cb(res.statusCode == 200);
  });
}


describe(`Integration tests on ${target} :`,function(){
  before(function(){
    expect(target).to.be.ok;
  });
  describe("https basic tests",function(){
    this.t = httpsPath;
    uriFixtures.forEach(testStatusCode.bind(this))
  });

  describe("http basic tests",function(){
    this.t = httpPath;
    uriFixtures.forEach(testStatusCode.bind(this));

  });
  ["fr","en"].forEach((lang)=>{
    describe(`Snipcart ${httpPath(`/${lang}/store/`)}`,function(){
      this.t = httpPath;
      testStatusCode.bind(this, [`/${lang}/store/`,301])();
    })
    describe(`Snipcart ${httpsPath(`/${lang}/store/`)}`,function(){
      this.t = httpsPath;
      this.dom = new Promise((resolve,reject)=>{
        request({url:this.t(`/${lang}/store/`)},function(err,res,body){
          if(err != null || res.statusCode != 200){
            reject(err||new Error(`invalid status : ${res.statusCode}`))
          }else{
            resolve(new JSDOM(body));
          }
        });
      })
      before(()=>{
        return this.dom.then((dom)=>{
          let add_buttons = dom.window.document.querySelectorAll("A.snipcart-add-item");
          describe(`Snipcart ${httpsPath(`/${lang}/store/`)} products`,()=>{
            add_buttons.forEach((btn)=>{
              let name = btn.getAttribute("data-item-name")||"unnamed";
              it(` ${name} export required`,function(){
                let url = btn.getAttribute("data-item-url");
                expect(url).to.match(new RegExp(`https://${target}/${lang}/store/`));
                expect(btn.getAttribute("data-item-description")).to.be.ok;
                expect(btn.getAttribute("data-item-name")).to.be.ok;
              })
              it(` ${name} has a valid image`,(done)=>{
                let img = btn.getAttribute("data-item-image");
                expect(img).to.be.ok;
                is200.call(this,img,function(found){
                  expect(found).to.be.ok;
                  done();
                })
              }).slow(200);
            })
          })
        })
      });
      //store page should yield 301 on http
      it("export products",()=>{
        return this.dom.then(function(dom){
          let products = dom.window.document.querySelectorAll("DIV.shop-product");
          let add_buttons = dom.window.document.querySelectorAll("A.snipcart-add-item");
          expect(products).to.have.property("length").above(0);
          expect(add_buttons).to.have.property("length").to.equal(products.length);
        });
      });

    })
  })
});
