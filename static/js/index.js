/**
 * Main control for pages content
 */
function Controller(){
  this.content=null;
  this.sections=null;
}
/**
 * Initialization function. get called on 'DOMContentLoaded' event
 */
Controller.prototype.init = function(){
  var i;
  this.sections = document.getElementsByClassName("page-sections");
  this.content = document.getElementById("content");
  if(this.content){
    //for(i=0;i<this.sections.length;i++){
    //  this.sections[i].innerHTML = this.listFactory(this.content.getElementsByTagName("h1"));
    //}
    this.setLinks(this.content);
    this.registerMagnify(this.content);
  }

}
/**
 * create a text of <li> elements given an array of elements. Typical element :
 * 		"<li><a>element_innerHTML</a></i>"
 * @param  {HTMLCollection} elements
 * @return {string}  chained li elements html strings
 */
Controller.prototype.listFactory = function(elements){
  var text = "";
  for(var i = 0; i<elements.length; i++){
    text = text + "<li><a href='#"+elements[i].id+"'>"+elements[i].innerHTML+"</a></li>";
  }
  return text;
}

/**
 * set h1/h2 links of "content" to have a  glyphicon link appear on hover.
 * @param  {HTMLElement} content top container
 * @return undefined
 */
Controller.prototype.setLinks = function(content){
  var i
    , heads = content.querySelectorAll("h1, h2");
  for(i=0;i<heads.length;i++){
    heads[i].innerHTML = '<a href="'+document.location.toString().split("#")[0]+'#'+heads[i].id+'"><span class="glyphicon glyphicon-link"></span></a>'+heads[i].innerHTML;
  }
}
/**
 * Register magnifier @ref makeMagnifier on click on elements having the "magnify" className.
 * Performs a check that only <img> are passed.
 * @param  {HTMLElement} content top container
 * @return undefined
 */
Controller.prototype.registerMagnify = function(content){
  content = content||document;
  var self=this
    , i
    , images = content.getElementsByClassName("magnify");
  for(i = 0; i < images.length; i++){
    if(images[i].tagName != "IMG"){
      continue;
    }
    images [i].onclick = function(){
      self.makeMagnifier(this);
    };
  }
}
/**
 * Create a magnifying function on given img element
 * @param  {HTMLElement} img valid <img> DOM element.
 * @return undefined
 */
Controller.prototype.makeMagnifier = function(img){
  //Here this is refering to the calling image
    var self = this
      , image = img.cloneNode(true)
      , magnifier = document.createElement("div")
      , overlay = document.createElement("div")
      , close = document.createElement("span");

  image.style.width ="auto";
  image.style.height ="auto";
  image.style.maxWidth = screen.width*0.6+"px";
  image.style.maxHeight = screen.height*0.6+"px";
  image.classList.remove("magnify")
  image.classList.add("img-responsive");

  close.innerHTML = "x";
  close.className = "close-icon";
  //No onclick listener because overlay is going to catch it for us.

  overlay.className = "overlay";
  overlay.onclick = function(e){
    if(e.target.className =="overlay" || e.target.className == "close-icon"){
      self.destroyMagnifier(overlay);
    }
  };

  magnifier.id="magnifier";
  magnifier.appendChild(image);
  magnifier.appendChild(close);
  overlay.appendChild(magnifier);
  document.body.appendChild(overlay);
}
/**
 * Destroy active magnifier
 * @param  {[type]} overlay the semi transparent fullscreen overlay
 */
Controller.prototype.destroyMagnifier = function(overlay){
  console.log(overlay);
  document.body.removeChild(overlay);
}



/*
 * BOOTSTRAP
 */
var controller = new Controller();
if(document.readyState === "complete" || document.readyState === "interactive") {
  controller.init();
}else{
  console.log("ready state : ",document.readyState)
  document.addEventListener('DOMContentLoaded',function(){
    controller.init();
  });
}
