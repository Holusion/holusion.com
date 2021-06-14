'use strict';

const { expect } = require('chai');

const {getSitemap, getLocations, getLocationsIn} = require('./getSitemap');

describe(`sitemap (format)`,function(){
  const sitemap = getSitemap();
  const locations = getLocations();

  it("have a urlset and many children",function(){
    //Perform basic validation on sitemap
    expect(sitemap.root).to.have.property("name", "urlset");
    expect(locations).to.have.property("length").above(50);
  });
  
  it("Have no PDF or XML files",function(){
    const filtered_locs = locations.filter((loc)=>{ //remove pdf files
      return /\.(pdf|xml)$/.test(loc);
    });
    expect(filtered_locs).to.deep.equal([]);
  });

  it("Every location is matched by one of our tests",async ()=>{
    const partCount = ["fr", "en", "dev"].map(part => getLocationsIn(part)).reduce((size, locs)=> size + locs.length, 0);
    expect(partCount, "The sum of all parts should contain every page in the sitemap").to.equal(locations.length);
  });
  it("locations are absolute paths", ()=>{
    for(let loc of getLocations()){
      expect(loc).not.to.match(/^https?/);
      expect(loc).to.match(/^\/(\w+\/)*\w+/);
    }
  })
});