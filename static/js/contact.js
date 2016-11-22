
  (function(){
    'use strict';
    function setupForm(){
      var contactform = document.getElementById("section-contactform")
      var submission = document.querySelector("#section-contactform>form");
      var logger = document.getElementById("contactform-logger");
      function logInfo(level,txt){
        logger.classList.add(level);
        logger.style.display="initial";
        logger.innerHTML = txt;
        console.log(txt);
        setTimeout(function(){
          logger.classList.remove(level);
          logger.style.display="none";
          logger.innerHTML = "...";
        },2500);
      }
      document.getElementById("contactform-overlay").onclick = function(){
        contactform.classList.remove("active");
      }
      document.getElementById("contactform-close").onclick = function(){
        contactform.classList.remove("active");
      }
      contactform.display = function(){
        contactform.classList.add("active");
      }
      submission.onsubmit = function(e){
        e.preventDefault();
        console.log(e);
        var XHR = new XMLHttpRequest();
        var FD  = new FormData(submission);
        XHR.addEventListener('load', function(event) {
          console.log(event.target.statusText);
          if(event.target.status == 200){
            logInfo('alert-success','Message Sent to Holusion.');
          }else {
            logInfo("alert-danger","An error happened : "+event.target.statusText);
          }

        });
        // We define what will happen in case of error
        XHR.addEventListener('error', function(event) {
          logInfo("alert-warning",'Oups! Something went wrong :(');
        });
        XHR.open('POST', '/contact.php');
        XHR.send(FD);
        return false;
      }
    }


    /* BOOTSTRAP */
    var script = document.createElement("SCRIPT");
    script.async = "1";
    script.onload = setupForm();
    script.src = "https://www.google.com/recaptcha/api.js";
    document.head.appendChild(script);
  })()
