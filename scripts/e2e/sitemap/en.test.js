'use strict';

const fs = require('fs');
const path = require('path');
const { getLocationsIn } = require('./getSitemap');
const testLocations = require("./testLocations");

describe(`sitemap/en`,function(){
  const locations = getLocationsIn("en");

  if (!is_extended) return;
  // Perform load tests for EVERY location (can be quite long...)
  testLocations(locations);
});