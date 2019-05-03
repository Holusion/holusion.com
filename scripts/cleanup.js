'use strict';
const http = require('http');
const path = require("path");
const fs = require("fs");
const util = require('util');
const {parse} = require('url');

const readdir = util.promisify(fs.readdir);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const puppeteer = require('puppeteer');
const parseString = require('xml-parser');
const serveStatic = require("serve-static");
const finalhandler = require('finalhandler');
const expect = require("chai").expect;

const local_site_files = path.resolve(__dirname,'../_site');

const sitemap = parseString(fs.readFileSync(path.join(local_site_files,"sitemap.xml"), 'utf8'));

const locations = sitemap.root.children
.map((node)=>{
  return node.children.find((child)=>{
    return child.name == "loc";
  }).content
})
.filter(n => n) //remove any undefined content

const options = {
  //headless:false,
  args:["--no-sandbox"]
};



let serve = serveStatic(local_site_files, {
'index': ['index.html', 'index.htm'],
'extensions': ["html"]
});

function flatDeep(arr1) {
  return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(flatDeep(val)) : acc.concat(val), []);
};
function walk(dir){
  return _walk(dir).then(files=>{
    return flatDeep(files);
  });
}

async function _walk(dir) {
  const files = await readdir(dir, {withFileTypes:true});
  return Promise.all(files.map(file=>{
    const filepath = path.join(dir,file.name);
    if(file.isDirectory()){
      return _walk(filepath);
    }else{
      return Promise.resolve(filepath);
    }
  }))
};

async function crawl_scan(files){
  const server = http.createServer(function onRequest (req, res) {
    const url = parse(req.url);
    if(/static\//.test(url.pathname)){
      files.delete(url.pathname);
    }else{
      //console.log("Not static : ",url.pathname);
    }
    serve(req, res, finalhandler(req, res))
  });
  
  await util.promisify(server.listen.bind(server))(0);
  const href = "http://localhost:"+ server.address().port;

  const browser = await puppeteer.launch(options);
  for (let loc of locations.map((loc)=> loc.replace(/^https?:\/\/[^\/]+/, ""))){
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    const ln = path.join(href,loc);
    page.on('request', interceptedRequest => {
      let url = interceptedRequest.url();
      if(
        url.indexOf("google-analytics.com") != -1 ||
        url.indexOf("gstatic.com") != -1
      ){
        interceptedRequest.respond("");
      }else{
        interceptedRequest.continue();
      }
    });
    await page.goto(`${ln}`,{timeout:10000, waitUntil: 'networkidle0'});
    await page.close();
  }
  console.log("Scanner DONE");
  console.log("%d files look like they are not loaded in any page", files.size);
  await browser.close();
  return files;
}


async function static_scan(static_files_paths){
  const site_files = [].concat(
    await walk(path.join(local_site_files, "fr")),
    await walk(path.join(local_site_files, "en"))
  )
  console.log("Scanning %d static resources", site_files.length);
  for (const [index, site_file] of site_files.entries()){
    console.log("Scanning %d of %d", index, site_files.length)
    const site_text = await readFile(site_file);
    for (const static_file_path of static_files_paths.values()){
      const short_path = static_file_path.slice(1); //remvoe leading slash
      if (site_text.indexOf(short_path) != -1){
        static_files_paths.delete(static_file_path);
      }
    }
  }
  return static_files_paths;
}


walk(path.join(local_site_files, "static/img"))
.then(files_list=> files_list.map(file=>file.slice(local_site_files.length)))
.then(files_list=>{
  const files = new Set(files_list);
  console.log("found %d static files", files.size);
  return files;
})
.then(crawl_scan)
.then(static_scan)
.then(async list=>{
  await writeFile("list.txt", Array.from(list).join("\n"));
  console.log("DONE. %d unused files found", list.size);
})
.then(()=>{process.exit(0)})


  

