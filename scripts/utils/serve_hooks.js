'use strict';
const fs = require("fs").promises;
const os = require('os');
const util = require('util');
const http = require('http');
const path = require('path');

const serveStatic = require("serve-static");
const finalhandler = require('finalhandler');


const FILE = path.join(os.tmpdir(), 'mocha_fileserver_endpoint');

global.local_site_files = path.resolve(__dirname,'../../_site');

global.href = null;

exports.mochaGlobalSetup = async function() {
  let serve = serveStatic(local_site_files, {
    'index': ['index.html', 'index.htm'],
    'extensions': ["html"]
  });
  this.server = http.createServer(function onRequest (req, res) {
    serve(req, res, finalhandler(req, res))
  });
  await util.promisify(this.server.listen.bind(this.server))(0);
  await fs.writeFile(FILE, `http://localhost:${this.server.address().port}`);
}

exports.mochaGlobalTeardown = async function() {
  await util.promisify(this.server.close.bind(this.server))();
  await fs.unlink(FILE);
};

exports.mochaHooks = {
  async beforeAll(){
    global.href = global.href  || await fs.readFile(FILE, {encoding: "utf8"});
  }
}