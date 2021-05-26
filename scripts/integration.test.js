'use strict';
const expect = require("chai").expect;
const {resolve} = require("path");
const fs = require("fs").promises;
const findFiles = require("./utils/findFiles");

const prettyPrint = require("./utils/prettyPrint");

const basePath = resolve(__dirname, "..")

describe("_site files", ()=>{
  let files, sizes;
 
  before(async ()=>{
    files = await findFiles(resolve(basePath, "_site"));
    expect(files.length).to.be.above(100);
    sizes = await Promise.all(files.map(async file =>{
      const stats = await fs.stat(file);
      return stats.size;
    }));
  });
  describe("size checks", ()=>{
    it("large files", async ()=>{
      const max_size = 1 *1024 /*1 kb*/ * 1024 /*1 mb*/ *64; //Max allowed size in octets
      const bad_files = files.filter((f, idx)=>{
        return max_size < sizes[idx];
      });
      expect(bad_files.length).to.be.below(10, `Found ${bad_files.length} files above size limit.`);
      expect(bad_files.length).to.equal(0, `Expected no file to be above ${Math.round(max_size/(1024*1024))} mb. Bad files :`
        + prettyPrint(bad_files));
    });
  
    it("large images", async ()=>{
      const max_size = 1 *1024* 1024; //Max allowed size in octets
      const re = /\.(?:png|jpe?g|webp)$/i
  
      const bad_images = files.filter((f, idx)=>{
        if(!re.test(f)) return false;
        return max_size < sizes[idx];
      });
      expect(bad_images.length).to.be.below(10, `Found ${bad_images.length} images above size limit.`);
      expect(bad_images.length).to.equal(0, `Expected no image to be above ${Math.round(max_size/1024)} kb. Bad images :`
        + prettyPrint(bad_images))
    });
  });

  describe("format check", ()=>{
    it(`videos have "faststart" moov atom`, async ()=>{
      const re = /\.(?:mp4)$/i
      const videos = files.filter((f, idx)=>re.test(f));

      const headers = await Promise.all(videos.map( async video => {
        const handle = await fs.open(video, "r");
        let buf = Buffer.allocUnsafe(100);
        await handle.read(buf,0, 100);
        const str = buf.toString();
        return str;
      }));
      const bad_moov = videos.filter((video, idx)=> {
        const movIndex = headers[idx].indexOf("moov");
        const mdatIndex = headers[idx].indexOf("mdat");
        return movIndex === -1 || (mdatIndex != -1 && mdatIndex < movIndex);
      });
      expect(bad_moov).to.have.property("length", 0, `moov fragment +faststart not set on videos :`
        + prettyPrint(bad_moov));
    })
  })
  
})