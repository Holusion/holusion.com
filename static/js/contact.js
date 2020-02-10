// Kept for backward compatibility
//Do : data-toggle="modal" data-target="#contactform-modal" instead
function displayContactForm(arg){
  //var contactform = document.getElementById("section-contactform")
  //contactform.classList.add("active");
  var modalContainer = $("#contactform-modal");
  //modalContainer.dataset['context'] = arg; //only known way to pass data to the modal
  modalContainer.modal('show');
}

function closeForm(){
  $("#contactform-modal").modal('hide');
}

const contact_strings = {
  captcha_error: {
    en: "Recaptcha service error. Please try again later",
    fr: "Erreur du service ReCaptcha. Veuillez rééssayer plus tard"
  }, got_error:{
    en: "An error happened",
    fr: "Une erreur s'est produite"
  }, network_error:{
    en: 'A network error prevented submission. Please try again later',
    fr: "Une erreur réseau a empéché l'envoi. Veuillez rééssayer plus tard"
  }, sending: {
    en: "Sending...",
    fr:"Envoi en cours"
  },
};
const page_lang_m = /^\/(fr|en)\//.exec(window.location.pathname);
const page_lang = (page_lang_m && page_lang_m[1])? page_lang_m[1]: "en";

function localize(key){
  if(!contact_strings[key]) return key;
  return contact_strings[key][page_lang]|| contact_strings[key]["en"]
}

// Utility function to create and display logs for form actions
function logInfo(level,txt){
  console.log(txt);
  var logger = document.querySelector("#logger");

  var msg = document.createElement("DIV");
  msg.role= "alert";
  msg.className = "alert alert-dismissible";
  msg.classList.add(level);

  var btn = document.createElement("BUTTON");
  btn.type = "button";
  btn.className = "close";
  btn.dataset.dismiss = "alert";
  btn.ariaLabel = "Close";
  btn.innerHTML = '<span aria-hidden="true">&times;</span>';
  var closer = function (){
    logger.removeChild(msg);
  }
  btn.onclick = closer;
  msg.appendChild(btn);
  msg.appendChild(document.createTextNode(txt));
  logger.appendChild(msg);
  return closer;
}



function setupForm(){
  var contactform = document.querySelector("#contactform-modal");
  var submission = document.querySelector("#contactform-modal form");
  //var overlay = document.querySelector("#contactform-overlay");
  //var closer = document.querySelector("#contactform-close");
  //overlay.onclick = closeForm;
  //closer.onclick = closeForm;
  submission.onsubmit = onSubmitContactForm;
  contactform.classList.add("is-ready");
}

function onSubmitContactForm(e){
  //Client-side validation is done in compatible browsers by input.pattern attributes before this callback
  e.preventDefault();
  try{
    grecaptcha.execute();
  }catch(e){
    console.error(e);
    logInfo("alert-warning", localize("captcha_error"));
    closeForm();
  }
  return false;
}
// The name `onValidated` is used by the captcha button as a callback
function onValidated(){
  var submission = document.querySelector("#contactform-modal form");
  var XHR = new XMLHttpRequest();
  var FD  = new FormData(submission);
  FD.append("source", window.location.pathname);
  var spinnerClose = logInfo("alert-info",localize("sending"));
  XHR.addEventListener('load', function(res) {
    var txt;
    console.log(res.target.statusText);
    spinnerClose();
    try{
      txt = JSON.parse(res.target.responseText).message;
    }catch(err){
      console.error("Failed to parse server response ", res, err)
    }
      txt = txt || res.target.statusText;
    if(res.target.status == 200){
      logInfo('alert-success',txt);
      closeForm();
    }else {
      logInfo("alert-danger",localize("got_error")+" : "+txt);
    }
  });
  // We define what will happen in case of error
  XHR.addEventListener('error', function(event) {
    logInfo("alert-warning",localize("network_error"));
  });
  XHR.open('POST', '/contact.php');
  XHR.send(FD);
}

/* BOOTSTRAP */
(function(){
    'use strict';
    var script = document.createElement("SCRIPT");
    script.async = "1";
    script.onload = setupForm();
    script.src = "https://www.google.com/recaptcha/api.js";
    document.head.appendChild(script);

  })()
