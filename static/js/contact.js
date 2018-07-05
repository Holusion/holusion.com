function displayContactForm(){
  var contactform = document.getElementById("section-contactform")
  contactform.classList.add("active");
}
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

function closeForm(){
  var contactform = document.querySelector("#section-contactform");
  contactform.classList.remove("active");
}
function setupForm(){
  var submission = document.querySelector("#section-contactform>form");
  var overlay = document.querySelector("#contactform-overlay");
  var closer = document.querySelector("#contactform-close");
  overlay.onclick = closeForm;
  closer.onclick = closeForm;
  submission.onsubmit = onSubmitContactForm;
}

function onSubmitContactForm(e){
  e.preventDefault();
  //TODO : perform more client-side validations?
    grecaptcha.execute();

  return false;
}
// The name `onValidated` is used by the captcha button as a callback
function onValidated(){
  var submission = document.querySelector("#section-contactform>form");
  var XHR = new XMLHttpRequest();
  var FD  = new FormData(submission);
  FD.append("source", window.location.pathname);
  var spinnerClose = logInfo("alert-info","Envoi en cours");
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
      logInfo("alert-danger","An error happened : "+txt);
    }
  });
  // We define what will happen in case of error
  XHR.addEventListener('error', function(event) {
    logInfo("alert-warning",'Oups! Something went wrong :(');
  });
  XHR.open('POST', '/contact.php');
  XHR.send(FD);
}

/* BOOTSTRAP */
(function(){
    'use strict';
    var contactform = document.getElementById("section-contactform")
    var script = document.createElement("SCRIPT");
    script.async = "1";
    script.onload = setupForm();
    script.src = "https://www.google.com/recaptcha/api.js";
    document.head.appendChild(script);
    var links = document.querySelectorAll(".contact-link");
    for(var i = 0; i< links.length; i++){
      links[i].onclick = function(){
        displayContactForm()();
      }
    }
  })()
