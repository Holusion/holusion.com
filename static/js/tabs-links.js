'use strict';
// Javascript to enable link to tab
var hash = document.location.hash;
if (hash) {
  console.info("page hash : ", hash);
  $('A.nav-link[href="' + hash + '"]').tab('show');
}
$('A.nav-link[data-toggle="tab"][href^="#"]').on("click",function(e){
  if(typeof history.pushState === "function"){
    history.pushState(null, null, e.target.hash);
  }else{
    document.location.hash = e.target.hash;
  }
});