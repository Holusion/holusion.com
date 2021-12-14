'use strict';
const {join} = require('path');
const fs = require("fs").promises;
const yaml = require("js-yaml");

async function findFiles(dir, {match}= {}){
  const entries = await fs.readdir(dir, {withFileTypes: true});
  const chunks = await Promise.all(entries.map((f)=>{
    if(f.isDirectory()) return findFiles(join(dir, f.name));
    else if(f.isFile()) return [join(dir, f.name)];
    else return [];
  }));
  const files =  chunks.flat();
  if(!match) return files;
  else if(match instanceof RegExp) return files.filter(f=> match.test(f));
  else return files.filter(f => f.indexOf(match) != -1);
}

function getFrontMatter(contentBuf){
  let yaml_start = contentBuf.indexOf("---");
  if(yaml_start < 0) return Buffer.alloc(0);
  let yaml_end = contentBuf.indexOf('---', yaml_start+3);
  if(yaml_start < 0) return Buffer.alloc(0);
  return contentBuf.slice(yaml_start+3, yaml_end);
}

async function findFrontMatters(dir, opts){
  const allFiles = await findFiles(dir, opts);
  return await Promise.all(allFiles.map(async filepath=> {
    let contentBuf = await fs.readFile(filepath, {});
    let frontMatter = getFrontMatter(contentBuf);
    return {filepath, frontMatter};
  }));
}


module.exports = {findFiles, findFrontMatters};