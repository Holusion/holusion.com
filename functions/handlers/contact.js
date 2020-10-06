'use strict';


const errorStrings = {en:{
  "success": "Thank you for contacting us. We will be in touch with you very soon",
  "err": "Error",
  "empty": "is empty",
  "einvemail": 'The Email Address you entered is invalid',
  "einvfname": 'First Name not povided',
  "einvlname": 'Last Name not provided',
  "einvcomments": 'Comments must be at least 20 characters long',
}, fr: {
  "success": "Merci de nous avoir contacté, votre demande sera traitée au plus vite",
  "err": "Erreur",
  "empty": "est vide",
  "einvemail": "L'Adresse mail est invalide",
  "einvfname": 'Le prénom n\'a pas été fourni',
  "einvlname": 'Le nom n\'a pas été fourni',
  "einvcomments": 'Les commentaires doivent faire au moins 20 caractères et moins de 3000',
}}


module.exports = (req, res)=>{
  const { warn } = require("firebase-functions/lib/logger");
  const admin = require("firebase-admin");
  const app = admin.app();

  res.type("text/plain; charset=utf-8");
  let lang = req.acceptsLanguages( "en", "fr" ) || "en";
  //handle bad params
  let errors = [
    ['fname', /^.+$/],
    ['lname', /^.+$/],
    ['email', /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/],
    ['comments', /./],
  ].map(([name, re])=>{
    if(typeof req.body[name] !== "string" || !re.test(req.body[name])){
      return new Error(errorStrings[lang][`einv${name}`]);
    }else {
      return null;
    }
  }).filter(e=>e);

  if(0 < errors.length){
    return res.status(400).send(`${errors.map(e=>e.message).join(", ")}`)
  }

  //FIXME more anti-abuse rules needed
  if(5000 < req.body.comments.length || req.body.comments.length < 20){
    return res.status(400).send(errorStrings[lang][einvcomments]);
  }

  app.firestore().collection("mail").add({
    to: ["contact@holusion.com"],
    from: "contact@holusion.com",
    replyTo: req.body['email'],
    template: {
      name: "contact",
      data: req.body,
    },
  })
  .then(()=>{
    res.status(200).send(errorStrings[lang]["success"]);
  })
  .catch((e)=>{
    warn(e);
    res.status(500).send(e.message);
  });
  return undefined;
}