//Toggle modal with : data-bs-toggle="modal" data-bs-target="#contactform-modal" instead

/* BOOTSTRAP */
(function(){
    'use strict';
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
      submission.onsubmit = onSubmitContactForm;
      contactform.classList.add("is-ready");
    }
    
    function onSubmitContactForm(e){
      e.preventDefault();
      var submission = document.querySelector("#contactform-modal form");
      var FD  = new FormData(submission);
      FD.append("source", window.location.pathname);
      var spinnerClose = logInfo("alert-info",localize("sending"));
    
      var body = {};
      for (let pair of FD) {
        body[pair[0]] = pair[1];
      }
    
      fetch(`/api/v1/sendmail`, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "text/plain",
        },
        method: 'POST',
        body: JSON.stringify(body),
      }).then((res)=>{
        spinnerClose();
        res.text().then(txt=>{
          if(res.ok){
            logInfo('alert-success', txt);
            closeForm();
          }else{
            logInfo("alert-danger",localize("got_error")+" : "+txt);

          }
        })
        .catch((e)=>{
          console.error("Failed to parse server error : ", e);
          logInfo("alert-danger",localize("got_error")+" : "+res.statusText);
        });
      })
      .catch((e)=>{
        console.warn("fetch :", e);
        logInfo("alert-warning",localize("network_error"));
      })
    }

    //Initialize
    setupForm();
  })()
