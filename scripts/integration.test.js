'use strict';
const expect = require("chai").expect;
const {resolve, relative, sep} = require("path");
const fs = require("fs").promises;
const https = require('https');
const {execFile} = require("child_process");

const yaml = require('js-yaml');

const {findFiles, findFrontMatters} = require("./utils/findFiles");

const prettyPrint = require("./utils/prettyPrint");

const basePath = resolve(__dirname, "..")

// true when the file lives under the _assets source folder (processed at build time)
const isAsset = f => relative(basePath, f).split(sep)[0] === "_assets";

// read an image's pixel dimensions using libvips (already required to build the site)
function imageDimensions(file){
  return new Promise((resolve, reject)=>{
    execFile("vipsheader", [file], (err, stdout)=>{
      if(err) return reject(err);
      const m = /(\d+)x(\d+)/.exec(stdout);
      if(!m) return reject(new Error(`Could not read dimensions of ${file} from: ${stdout}`));
      resolve({width: parseInt(m[1], 10), height: parseInt(m[2], 10)});
    });
  });
}

// map with bounded concurrency to avoid spawning one process per image at once
async function mapLimit(items, limit, fn){
  const results = new Array(items.length);
  let cursor = 0;
  async function worker(){
    while(cursor < items.length){
      const idx = cursor++;
      results[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({length: Math.min(limit, items.length)}, worker));
  return results;
}

describe("integration tests", function(){
  const image_re = /\.(?:png|jpe?g|webp)$/i;
  const folders = ["_assets", "static"];
  let staticFiles, sizes;
  before(async function(){
    staticFiles = (await Promise.all(folders.map(f => findFiles(resolve(basePath, f))))).flat()
    sizes = await Promise.all(staticFiles.map(async file =>{
      const stats = await fs.stat(file);
      return stats.size;
    }));
  })

  describe("static & assets files", ()=>{
    it("expect many files", function(){
      expect(staticFiles.length).to.be.above(100);
    });

    describe("size checks", ()=>{
      it("large files", async ()=>{
        const max_size = 1 *1024 /*1 kb*/ * 1024 /*1 mb*/ *64; //Max allowed size in octets
        const bad_files = staticFiles.filter((f, idx)=>{
          return max_size < sizes[idx];
        });
        expect(bad_files.length).to.be.below(10, `Found ${bad_files.length} files above size limit.`);
        expect(bad_files.length).to.equal(0, `Expected no file to be above ${Math.round(max_size/(1024*1024))} mb. Bad files :`
          + prettyPrint(bad_files));
      });
    
      // Served images (outside _assets) ship as-is, so we cap their file size.
      it("large images", async ()=>{
        const max_size = 1 *1024* 1024; //Max allowed size in octets
        const bad_images = staticFiles.filter((f, idx)=>{
          if(!image_re.test(f)) return false;
          if(isAsset(f)) return false; // _assets images are checked by resolution below
          return max_size < sizes[idx];
        });
        expect(bad_images.length).to.be.below(10, `Found ${bad_images.length} images above size limit.`
        + `\nList bad images with : \n\t\`find static -size +${Math.round(max_size/1024)}k \\( -iname "*.png" -o -iname "*.jpg" -o -iname "*.webp" \\)\``
        + "\n");
        expect(bad_images.length).to.equal(0, `Expected no image outside _assets to be above ${Math.round(max_size/1024)} kb. Bad images :`
          + prettyPrint(bad_images))
      });

      // Source images (in _assets) are resized at build time, so file size is
      // irrelevant; instead we make sure their resolution stays sane.
      it("high resolution source images", async function(){
        this.timeout(120000);
        const max_width = 3840, max_height = 2160; // no source image should exceed 4K UHD
        const asset_images = staticFiles.filter(f=> image_re.test(f) && isAsset(f));
        const dims = await mapLimit(asset_images, 32, imageDimensions);
        const bad_images = asset_images.filter((f, idx)=> max_width < dims[idx].width || max_height < dims[idx].height);
        expect(bad_images).to.have.property("length", 0, `Expected no _assets image above ${max_width}x${max_height}px.`
          + `\nResize them within that box, e.g.: \n\t\`vipsthumbnail "<file>" --size ${max_width}x${max_height} -o "<file>"\``
          + prettyPrint(bad_images.map((f, i)=> `${relative(basePath, f)} (${dims[asset_images.indexOf(f)].width}x${dims[asset_images.indexOf(f)].height})`)))
      });
    });
  
    describe("format check", ()=>{
      it(`mp4 videos have "faststart" moov atom`, async ()=>{
        const re = /\.(?:mp4)$/i
        const videos = staticFiles.filter((f, idx)=>re.test(f));
  
        const headers = await Promise.all(videos.map( async video => {
          const handle = await fs.open(video, "r");
          let str;
          try{
            let buf = Buffer.allocUnsafe(100);
            await handle.read(buf,0, 100);
            str = buf.toString();
          }finally{
            handle.close();
          }
          return str;
        }));
        const bad_moov = videos.filter((video, idx)=> {
          const movIndex = headers[idx].indexOf("moov");
          const mdatIndex = headers[idx].indexOf("mdat");
          return movIndex === -1 || (mdatIndex != -1 && mdatIndex < movIndex);
        });
        expect(bad_moov).to.have.property("length", 0, `moov fragment "faststart" not set on videos :`
          + prettyPrint(bad_moov)
          + `Fix with : \n\t\`(export FILE="<file>" && ffmpeg -y -i "$FILE" -c copy -movflags +faststart "/tmp/$(basename "$FILE")" && mv "/tmp/$(basename "$FILE")" "$FILE")\``
          + "\n");
      })
    });
  })

  describe("contents checks", ()=>{
    let contentFiles;
    const siteDir = resolve(basePath, "_site");
    before(async ()=>{
      const files = await findFiles(siteDir, {match:/\.(?:html|css)$/});
      const contents = (await Promise.all(files.map(f=> fs.readFile(f, {encoding:"utf8"}))));
      contentFiles = files.map((filepath, index)=> ({filepath, index, content: contents[index]}));
    });
    describe("usage check", ()=>{
      it("images",async ()=>{
        const images = staticFiles.filter(i=>image_re.test(i));
        expect(images, "Expected many images").to.have.property("length").above(100);
        const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        let not_found = images.filter((image)=>{
          let rel = relative(basePath, image)
          const isAssetImg = rel.indexOf("_assets") === 0;
          if(isAssetImg){
            rel = `/assets/${rel.slice("_assets/".length, rel.lastIndexOf("."))}`;
          }
          const parts = rel.split("/");
          rel = `${parts.slice(0, -1).join("/")}/${encodeURIComponent(parts[parts.length -1])}`;
          // _assets images are rewritten by jekyll_picture_tag to /assets/<path>[-<variant>].<ext>,
          // so we strip the extension above and match the base. It MUST be followed by a real
          // delimiter ("." for the plain output, "-" for a resized variant) — a bare substring
          // test would let a dead image ride on a longer-named sibling whose URL merely starts
          // with the same string (e.g. "kit_pixel" masked by "kit_pixels", "PeppersGhost" by
          // "PeppersGhost_schema"). static/ images keep their extension, so an exact match is enough.
          const needle = isAssetImg ? new RegExp(escapeRe(rel) + "[-.]") : rel;
          return !contentFiles.some(c=> isAssetImg ? needle.test(c.content) : c.content.indexOf(needle) !== -1);
        });
        expect(not_found).to.have.property("length", 0, `Some images are not used anywhere :`
        + prettyPrint(not_found.slice(0,10))
        + ((10 < not_found.length)? `Showing 10 out of ${not_found.length}` : "")
        + "\n");
      });
    });
  
    describe("embeds check", ()=>{
      it("gdoc", async ()=>{
        const matches = contentFiles.map(c=>{
          return Array.from(c.content.matchAll(/div id="iframe" data-id="([^"]*)"/mg));
        })
        .map((matches, fileIndex)=> matches.map(m=> ({
          id:m[1], 
          file: contentFiles[fileIndex].filepath,
          url: `https://docs.google.com/document/d/${m[1]}/export?format=pdf`
        })))
        .filter(m=> 0 <m.length)
        .flat();
        expect(matches, "gdoc embed should be used at least once or be removed").to.have.property("length").above(0);
        for(let {id, file} of matches){
          expect(file).to.be.ok;
          expect(id, `Invalid gdoc ID in ${file}`).to.be.ok;
        }

        let responses = await Promise.all(matches.map(async ({url})=>{
          return await new Promise((resolve, reject)=>{
            https.get(url, { timeout:1000 }, (res)=>{
              resolve(res);
            });
          });
        }));

        for(let i = 0; i <matches.length; i++){
          let res = responses[i];
          let {file, url} = matches[i];
          try{
            //expect a 307 redirection
            expect(res.statusCode, `Cannot GET ${url}: ${res.statusCode}`).to.be.below(400);
            if(/accounts\.google/.test(res.headers.location)){
              expect.fail([
                url.replace("/export?format=pdf", ""),
                `in ${relative(basePath,file)}`,
                `is requiring user authentication`,
                `please verify its sharing permissions`
              ].join("\n\t"));
            }
            //Double-check statusCode in case it's changed
            expect(res.statusCode, `Expected a 307 redirection for ${url}`).to.equal(307);
          }finally{
            res.destroy();
          }
        }
      });
    });
  })

  describe("front matter checks", function(){

    ["store"].forEach((folder=>{
      describe(`/en/${folder}/`, function(){
        let en_files, fr_files;
        before(async function(){
          en_files = await findFrontMatters(resolve(basePath, `en/${folder}`), {match:/\/(?!index|\d+_\w+)[^\/]*\.(?:html|md)$/});
          fr_files = await findFrontMatters(resolve(basePath, `fr/${folder}`), {match:/\/(?!index|\d+_\w+)[^\/]*\.(?:html|md)$/});
        });
        it("filter matches files", function(){
          expect(en_files).to.have.property("length").above(2);
        });
        it("every file has a yaml front matter", function(){
          for(let file of en_files){
            expect(file.frontMatter, `${file.filepath} has no yaml front matter`).to.have.property("length").above(0);
          }
        });
        describe("localization compare", function(){
          let comparedFiles;
          before(function(){
            comparedFiles = en_files.map(file=>{
              let fr_filePath = file.filepath.replace("/en/", "/fr/");
              let {frontMatter:fr_frontMatter} = fr_files.find(fr_file=> {
                return fr_file.filepath === fr_filePath
              });
              return {...file, fr_filePath, fr_frontMatter};
            });
          });
          it("every file has a french counterpart", function(){
            for(let file of comparedFiles){
              expect(file.fr_frontMatter).to.be.ok;
              expect(file.fr_frontMatter).to.have.property("length").above(0);
            }
          });
          
          it("checks for duplicate keys", async function(){
            //Deeply compare hashes for any incorrect specification
            function deep_compare(en, fr, propchain){
              let errors = []
              for(let key in en){
                let keychain = propchain?`${propchain}.${key}`: key;
                if(!fr.hasOwnProperty(key) ){ 
                  //Keys that are allowed a less strict check
                  if( ["layout", "lang", "rank", "published" ].indexOf(key) == -1) continue;
                  errors.push(`property ${
                    keychain
                  } should also be provided in french (or deleted)`);
                }else if(typeof en[key] != typeof fr[key]){
                  errors.push(`property ${
                    keychain
                  } has different type (${
                    typeof en[key]
                  }) in english than in french (${
                    typeof fr[key]
                  })`);
                }else if(typeof en[key] === "object"){
                  errors.push(...deep_compare(en[key], fr[key], keychain));
                }else if(en[key] === fr[key] && ["layout", "title", "rank", "published"].indexOf(key) == -1) {
                  errors.push(`property [${keychain}] should be translated\n    or deleted from the english page (content duplication)`);
                }
              }
              return errors;
            }

            let errors = [], totalErrorCount = 0;
            for(let file of comparedFiles){
              let header, fr_header;
              try{
                header=yaml.load(file.frontMatter)
              }catch(e){
                expect.fail(`Bad yaml header in ${file.filepath} : ${e.message}`);
              }

              try{
                fr_header=yaml.load(file.fr_frontMatter)
              }catch(e){
                expect.fail(`Bad yaml header in ${file.fr_filepath} : ${e.message}`);
              }

              expect(header, `Bad header for ${file.filepath}. From ${file.frontMatter}`).to.be.a("object");
              expect(fr_header, `Bad header for ${file.fr_filePath}. From : ${file.fr_frontMatter}`).to.be.a("object");
              let fileErrors = deep_compare(header, fr_header);
              if(0 < fileErrors.length){
                errors.push(`IN ${relative(basePath,file.filepath)} :\n  ${fileErrors.join("\n  ")}`)
                totalErrorCount += fileErrors.length;
              }
            }
            if(0 < errors.length){
              expect.fail(`${totalErrorCount} Errors : \n${errors.join("\n")}`);
            }
          })
        });
      });
    }));
  })
})
