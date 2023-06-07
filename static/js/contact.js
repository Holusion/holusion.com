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
    function logInfo(level,txtOrChild,{ timeout=-1, canClose=true}={}){
      let logger = document.querySelector("#logger");
    
      let msg = document.createElement("DIV");
      msg.role= "alert";
      msg.className = "alert d-flex justify-content-between";
      msg.classList.add("alert-"+level);

      msg.appendChild((typeof txtOrChild === "string")?document.createTextNode(txtOrChild): txtOrChild);
    
      if(canClose){
        let btn = document.createElement("BUTTON");
        btn.type = "button";
        btn.className = "btn-close";
        btn.dataset.bsDismiss = "alert";
        btn.ariaLabel = "Close";
        msg.appendChild(btn);
        msg.classList.add("alert-dismissible");

      }

      logger.appendChild(msg);
      
      let closed = false;
      function closer (){
        if(!closed) logger.removeChild(msg);
        closed = true;
      }
      if(0 < timeout) setTimeout(closer, timeout);

      return closer;
    }
    
    
    
    function setupForm(){
      let contactform = document.querySelector("#contactform-modal");
      let submission = document.querySelector("#contactform-modal form");
      submission.onsubmit = onSubmitContactForm;
      contactform.classList.add("is-ready");
    }
    
    function onSubmitContactForm(e){
      e.preventDefault();
      let submission = document.querySelector("#contactform-modal form");
      let formData  = new FormData(submission);
      formData.append("source", window.location.pathname);

      let s = document.createElement("span");
      s.className = "d-flex flex-grow-1 align-items-center justify-content-center";
      s.innerHTML = `<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div> <span class="px-4">${localize("sending")}</span>`
      let spinnerClose = logInfo("info", s, {canClose: false});
    
      let body = {};
      for (let pair of formData) {
        body[pair[0]] = pair[1];
      }

      //bypass sendmail when on localhost to allow easier tests
      let request;
      if(window.location.hostname === "localhost"){
        request = new Promise(resolve=>{
          setTimeout(resolve.bind(null, ({
            ok: body["fname"] !== "oscar",
            headers:{get:()=>"text/html; encoding=utf-8"},
            text: ()=>Promise.resolve("Merci de nous avoir contacté, votre demande sera traitée au plus vite"),
          })), 1200);
        });
      }else {
        request = fetch(`/api/v1/sendmail`, {
          headers: {
            "Content-Type": "application/json",
            "Accept": "text/plain",
          },
          method: 'POST',
          body: JSON.stringify(body),
        })
      }
      
      request.then(async (res)=>{
        spinnerClose();
        try{
          let txt = await res.text()
          if(res.ok){
            submission.reset();
            logInfo('success', txt, {timeout: 5000});
            setTimeout(()=>{
              document.querySelector(`#contactform-modal [data-bs-dismiss="modal"]`)?.click();
            }, 5000);
  
          }else{
            if(res.headers.get("Content-Type").indexOf("text/html") !=-1) throw new Error(`server returned an HTML response`);
            logInfo("danger",localize("got_error")+" : "+txt);
          }

        }catch (e){
          console.error("Failed to parse server error : ", e);
          logInfo("danger",`${localize("got_error")} [${res.status}]: ${res.statusText}`);
        };
      })
      .catch((e)=>{
        console.warn("fetch :", e);
        logInfo("warning",localize("network_error"));
      })
    }

    //Initialize
    setupForm();
  })()
