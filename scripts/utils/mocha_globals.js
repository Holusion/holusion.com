'use strict';
global.expect = require("chai").expect;

const puppeteer = require('puppeteer');
const devices = puppeteer.devices;

global.is_extended = (process.env["RUN_EXTENDED_TESTS"]?true:false);

global.target_devices = [
  {
    'name': 'small Desktop Chrome 84',
    'userAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36',
    'viewport': {
      'width': 800,
      'height': 600,
      'deviceScaleFactor': 1,
      'isMobile': false,
      'hasTouch': false,
      'isLandscape': true
    }
  }
];

if (is_extended){
  target_devices.push({
    'name': 'large Desktop Chrome 84',
    'userAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36',
    'viewport': {
      'width': 1920,
      'height': 1080,
      'deviceScaleFactor': 1,
      'isMobile': false,
      'hasTouch': false,
      'isLandscape': true
    }
  });
  const mobile_devices = ([ //Device list : https://github.com/GoogleChrome/puppeteer/blob/master/DeviceDescriptors.js
    'iPad',
    'iPhone 5',
    'iPhone X landscape'
  ]).map( d =>{
    let dev =  devices[d];
    if (!dev) throw new Error("no device named : "+d);
    return dev;
  });
  for (let d of mobile_devices){
    target_devices.push(d);
  }
}