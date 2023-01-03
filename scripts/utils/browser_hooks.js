'use strict';


const fs = require('fs').promises;
const path = require('path');
const os = require('os');


const puppeteer = require('puppeteer');
const chromeArgs = [
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-renderer-backgrounding',
  '--no-sandbox',
];
const options = {
  headless: process.env["HEADLESS"] == "false"? false : true,
  executablePath: process.env["PUPPETEER_EXEC_PATH"], // set by github action
  args: chromeArgs,
};

const FILE = path.join(os.tmpdir(), 'mocha_puppeteer_wsEndpoint');


//Global browser
exports.mochaGlobalSetup = async function(){
  this.browser = await puppeteer.launch(options);
  await fs.writeFile(FILE, this.browser.wsEndpoint());
}

exports.mochaGlobalTeardown = async function(){
  await this.browser.close();
  await fs.unlink(FILE);
}

exports.mochaHooks = {
  async beforeAll(){
    const wsEndpoint = await fs.readFile(FILE, {encoding:"utf8"});
    if (!wsEndpoint) {
      throw new Error('Puppeteer\'s wsEndpoint not found');
    }
    this.browser = await puppeteer.connect({browserWSEndpoint:wsEndpoint});
    this._pages = [];
    this.newPage = async ({device, block:blockOpts=true, closeAfter=true}={})=>{
      const page = await this.browser.newPage();

      //Fix for not-clickable errors https://stackoverflow.com/a/61239346/3793838
      page.on("load", function(){
        page.addStyleTag({ content: ":root {scroll-behavior: auto !important;}" });
      })

      if(closeAfter) this._pages.push(page);

      if(device){
        await page.emulate(device);
      }
      if(blockOpts !== false){
        await block(page, {
          types: (Array.isArray(blockOpts)? blockOpts : ["images", "medias", "external"]),
        });
      }
      return page;
    }
    this.checkImages = (page)=>{
      const exist_checks = [];
      page.on("request", (interceptedRequest)=>{
        try{
          let url = new URL(interceptedRequest.url());
          if(url.origin != global.href){
            //console.log('Diff origin :', url.origin, global.href);
          }else if(!/\.(?:png|jpe?g|webp)$/i.test(url.pathname)){
            //console.log("Not an image : ", url.pathname);
          }else{
            const localPath = path.resolve(local_site_files, url.pathname.split("/").slice(1).map(c=>decodeURIComponent(c)).join("/"));
            exist_checks.push((async ()=>{
              try{
                await fs.access(localPath);
              }catch(e){
                return localPath;
              }
              return undefined;
            })());
          }
        }catch(e){
          console.error("Intercept failed : ", e);
        }
        if(!interceptedRequest.isInterceptResolutionHandled()){
          interceptedRequest.continue(
            interceptedRequest.continueRequestOverrides(),
          0);
        }
      });
      return ()=> Promise.all(exist_checks);
    }
  },
  async afterAll(){
    await Promise.all(this._pages.map(async (page)=>{
      try{
        await page.close();
      }catch(e){
        console.warn("Failed to close puppeteer page. Do not close manually");
      }
    }));
    this.browser.disconnect();
  }
}

/**
 * Utility function to speed up tests
 * Block selected resources by category
 * Categories are : images, medias, analytics, captcha
 * can also have an additional filter that return true on requests to be intercepted
 */
 async function block(page, {types}={}){
  await page.setRequestInterception(true);

  page.on('request', interceptedRequest => {
    let url = interceptedRequest.url();
    //auto-block foreign requests
    let isBlocked  = types.some(type=>{
      switch(type){
        case "external":
          if(url.startsWith("http") && !url.startsWith(href) && !url.startsWith("https://img.youtube.com/")){
            //console.log("block external : ", url);
            return true;
          }
          break;
        case "images":
          if(  url.endsWith('.png') 
            || url.endsWith('.jpg')
            || url.endsWith('.webp')
          )  return true;
          break;
        case "medias":
          if(  url.endsWith('.mp4')
            || url.endsWith('.ogv')
            || url.endsWith('.webm')
          )  return true;
          break;
      }
      return false;
    });
    if(isBlocked){
      interceptedRequest.abort("failed", 0);
    }else{
      interceptedRequest.continue();
    }
  });
}