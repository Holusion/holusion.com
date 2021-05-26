'use strict';
const {join} = require('path');
const {readdir} = require("fs").promises;


module.exports = async function findFiles(dir, {match}= {}){
  const entries = await readdir(dir, {withFileTypes: true});
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