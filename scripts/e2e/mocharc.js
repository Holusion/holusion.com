'use strict';
const path = require('path');


let requires = [
  "./utils/mocha_globals.js",
  "./utils/browser_hooks.js",
]


if (!process.env["TARGET"]){
  requires.unshift("./utils/serve_hooks.js")
}

module.exports = {
  slow: 1500,
  timeout: 20000,
  require: requires.map(p=> path.resolve(__dirname, "..", p)),
  spec: path.resolve(__dirname, "**/*.test.js"),
}