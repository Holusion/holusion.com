'use strict';
const path = require('path');


let requires = [
  "./utils/mocha_globals.js",
  "./utils/browser_hooks.js",
]


if (!process.env["TARGET"] || process.env["TARGET"] == "local"){
  requires.unshift("./utils/serve_hooks.js")
}

module.exports = {
  reporter: "spec",
  slow: 1500,
  // e2e tests drive a single shared browser across several parallel workers,
  // so interactions can be slow under load; keep a generous timeout.
  timeout: 60000,
  require: requires.map(p=> path.resolve(__dirname, "..", p)),
  spec: path.resolve(__dirname, "**/*.test.js"),
}