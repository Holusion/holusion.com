'use strict';
const express = require('express');
const bodyParser = require('body-parser')

const router = express();


// redirect using language hints
router.get("/", (req, res)=>{
  let lang = req.acceptsLanguages("fr", "en");
  return res.redirect(302, `/${lang}/`);
});

router.post("/api/v1/sendmail", 
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  require("./contact")
);

module.exports = router;