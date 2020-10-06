'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require("express-rate-limit");
const { error } = require("firebase-functions/lib/logger");

const router = express();

const isProduction = !process.env["FIRESTORE_EMULATOR_HOST"];
//Firebase is always proxying for us
router.enable('trust proxy')
// redirect using language hints
router.get("/", (req, res)=>{
  let lang = req.acceptsLanguages("fr", "en");
  return res.redirect(302, `/${lang}/`);
});

router.post("/api/v1/sendmail",
  rateLimit({
    windowMs: 10*60*1000,
    max: 2,
  }),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  require("./contact")
);

//Error handling must be last
router.use(function(err, req, res, next) {
  error(err);
  let message;
  if(isProduction){
    message = "Internal error";
  }else{
    message = err.message;
  }
  res.status(500);
  res.format({
    "text/plain":()=> res.send(message),
    "text/html": ()=> res.send(`<!DOCTYPE html><html><body><h1 style="margin:auto">${message}</h1></body></html>`),
    "application/json": ()=> res.send({code: 500, message}),
    default: ()=> res.send({code: 500, message})
  });
});

module.exports = router;