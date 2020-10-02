'use strict';

module.exports = (req, res)=>{
  const { warn } = require("firebase-functions/lib/logger");
  const admin = require("firebase-admin");
  const app = admin.app();


  //One liner to get client IP.
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  let secretKey = functions.config().recaptcha.key;
  let captcha = req.body['g-recaptcha-response'];

  //FIXME handle bad params


  return fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}&remoteip=${ip}`)
  .then((res)=>res.json())
  .then(result=>{
    if(!result.success){
      throw new Error(`Failed to validate recaptcha : ${error-codes.map(e=>e.message).join(", ")}`);
    }
  }).then(()=> app.firebase().collection("mail").add({
    to: ["dsebastien90@gmail.com"],
    from: req.body['email_from'],
    replyTo: req.body['email_from'],
    message: {
      subject: `contact from ${req.body['fname']} ${req.body['lname']}`,
      text: `From: ${req.body['email_from']}\nComments : ${req.body['comments']}`,
      html:  `<p>From: ${req.body['email_from']}\nComments : ${req.body['comments']}</p>`
    }
  }))
  .then(()=>{
    res.status(200).send("OK");
  })
  .catch((e)=>{
    warn(e);
    res.status(500).send(e.message);
  })
}