'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require("express-rate-limit");
const { error } = require("firebase-functions/logger");

const router = express();

const isProduction = !process.env["FIRESTORE_EMULATOR_HOST"];

// Firebase Hosting proxies requests to the function through a single hop, so
// trust exactly one proxy. express-rate-limit v7+ rejects the permissive
// `trust proxy: true` (a spoofable X-Forwarded-For would bypass the limiter);
// a finite hop count keeps per-IP keying correct and the validation happy.
router.set('trust proxy', 1);

// redirect using language hints
router.get("/", (req, res)=>{
  let lang = req.acceptsLanguages("fr", "en") || "en";
  res.set('Cache-Control', 'public, max-age=3600, s-maxage=7200');
  res.set("Vary", "Accept-language");
  return res.redirect(302, `/${lang}/`);
});

router.post("/api/v1/sendmail",
  rateLimit({
    windowMs: 10*60*1000,
    limit: 2,
  }),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  require("./contact")
);

//Error handling must be last
router.use((err, req, res)=> {
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