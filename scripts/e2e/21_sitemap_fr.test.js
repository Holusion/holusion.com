'use strict';

const fs = require('fs');
const path = require('path');
const { getLocationsIn } = require('../utils/sitemap/getSitemap');
const testLocations = require("../utils/sitemap/testLocations");

describe(`sitemap/fr`,function(){
  const locations = getLocationsIn("fr");
  this.beforeAll(function(){
    if(!global.is_extended) this.skip();
  })
  // Perform load tests for EVERY location (can be quite long...)
  testLocations(locations);
});