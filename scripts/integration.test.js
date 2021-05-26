'use strict';
const expect = require("chai").expect;
const {resolve} = require("path");
const fs = require("fs").promises;
const findFiles = require("./utils/findFiles");


const basePath = resolve(__dirname, "..")

describe("size tests", ()=>{
  let files, sizes;
 
  before(async ()=>{
    files = await findFiles(resolve(basePath, "_site"));
    expect(files.length).to.be.above(100);
    sizes = await Promise.all(files.map(async file =>{
      const stats = await fs.stat(file);
      return stats.size;
    }));
  });

  it("large files", async ()=>{
    const max_size = 1 *1024 /*1 kb*/ * 1024 /*1 mb*/ *64; //Max allowed size in octets
    const bad_files = files.filter((f, idx)=>{
      return max_size < sizes[idx];
    });
    expect(bad_files.length).to.be.below(10, `Found ${bad_files.length} files above size limit.`);
    const pp = JSON.stringify(bad_files.map(p=> resolve(basePath, p)), null, 2);
    expect(bad_files.length).to.equal(0, `Expected no file to be above ${Math.round(max_size/(1024*1024))} mb. Bad files :\n${pp}\n`)
  });

  it("large images", async ()=>{
    const max_size = 1 *1024* 1024; //Max allowed size in octets
    const re = /\.(png|jpe?g|webp)$/i

    const bad_images = files.filter((f, idx)=>{
      if(!re.test(f)) return false;
      return max_size < sizes[idx];
    });
    expect(bad_images.length).to.be.below(10, `Found ${bad_images.length} images above size limit.`);
    const pp = JSON.stringify(bad_images.map(p=> resolve(basePath, p)), null, 2);
    expect(bad_images.length).to.equal(0, `Expected no image to be above ${Math.round(max_size/1024)} kb. Bad images :\n${pp}\n`)
  });
  
})