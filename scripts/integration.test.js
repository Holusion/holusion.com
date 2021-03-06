'use strict';
const expect = require("chai").expect;
const {resolve, relative} = require("path");
const fs = require("fs").promises;
const findFiles = require("./utils/findFiles");

const prettyPrint = require("./utils/prettyPrint");

const basePath = resolve(__dirname, "..")

describe("static & assets files", ()=>{
  let files, sizes;
  const folders = ["_assets", "static"];
  const image_re = /\.(?:png|jpe?g|webp)$/i;
  before(async ()=>{
    files = (await Promise.all(folders.map(f => findFiles(resolve(basePath, f))))).flat();
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
      const bad_images = files.filter((f, idx)=>{
        if(!image_re.test(f)) return false;
        return max_size < sizes[idx];
      });
      expect(bad_images.length).to.be.below(10, `Found ${bad_images.length} images above size limit.`
      + `\nList bad images with : \n\t\`find ${folders.join(" ")} -size +${Math.round(max_size/1024)}k \\( -iname "*.png" -o -iname "*.jpg" \\)\``
      + "\n");
      expect(bad_images.length).to.equal(0, `Expected no image to be above ${Math.round(max_size/1024)} kb. Bad images :`
        + prettyPrint(bad_images))
    });
  });

  describe("format check", ()=>{
    it(`mp4 videos have "faststart" moov atom`, async ()=>{
      const re = /\.(?:mp4)$/i
      const videos = files.filter((f, idx)=>re.test(f));

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

  describe("usage check", ()=>{
    const pageFolders = ["_site"];
    let contents;
    before(async ()=>{
      const contentFiles = await findFiles(resolve(basePath, "_site"), {match:/\.(?:html|css)$/});
      contents = (await Promise.all(contentFiles.map(f=> fs.readFile(f, {encoding:"utf8"}))));
    });
    it("images",async ()=>{
      const images = files.filter(i=>image_re.test(i));
      expect(images).to.have.property("length").above(100);
      let not_found = images.filter((image)=>{
        let rel = relative(basePath, image)
        if(rel.indexOf("_assets") === 0){
          rel = `/assets/${rel.slice("_assets/".length, rel.lastIndexOf("."))}`;
        }
        const parts = rel.split("/");
        rel = `${parts.slice(0, -1).join("/")}/${encodeURIComponent(parts[parts.length -1])}`;
        return !contents.some(c=> c.indexOf(rel) !== -1);
      });
      expect(not_found).to.have.property("length", 0, `Some images are not used anywhere :`
      + prettyPrint(not_found.slice(0,10))
      + ((10 < not_found.length)? `Showing 10 out of ${not_found.length}` : "")
      + "\n");
    });
  })
  
})