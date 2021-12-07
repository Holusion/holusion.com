
const fs = require('fs');
const path = require('path');

const parseString = require('xml-parser');

const sitemap = parseString(fs.readFileSync(path.join(local_site_files, "sitemap.xml"), 'utf8'))
function getLocations(){
  return sitemap.root.children
  .map((node)=>{
    return node.children.find((child)=>{
      return child.name == "loc";
    }).content
  })
  .filter(n => n) //remove any undefined content
  .map((loc)=> loc.replace(/^https?:\/\/[^\/]+\//, "/"));
}

function getLocationsIn(part){
  const re = new RegExp(`^(?:https?:\/\/[^\/]+)?/${part}/`);
  return getLocations().filter(loc=> re.test(loc));
}

module.exports = {
  getSitemap(){
    return sitemap;
  },
  getLocations,
  getLocationsIn,
}
