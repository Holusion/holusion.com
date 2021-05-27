'use strict';

const { resolve } = require("path");
const path = require("path");

module.exports = function prettyPrint(data){
  if(Array.isArray(data)) return `\n${JSON.stringify(data.map(p=> relativize(p)), null, 2)}\n`;
  return `${relativize(data)}`;
}

const basePath = path.resolve(__dirname, "../..");
function relativize(maybePath){
  if(! path.isAbsolute(maybePath)) return maybePath;
  return path.relative(basePath, maybePath);
}