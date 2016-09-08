/**
 * when attached to an onclick event, changeProduct will change the following elements when a button with corresponding innerHTML is clicked.
 * - Hide every element of class "product-show" with name not containing "p" (case insensitive)
 * - Showevery element of class "product-show" with name containing "p" (case insensitive)
 * - Set as button primary every button identical (in content) to the clicked one.
 * - set content of every element of class *product-span* to equal "p".
 * - set localstorage variable "product" to "p"
 * Usage example :
 * 		<button class="btn btn-default product-button" onclick="changeProduct(this.innerHTML)" >Prisme</button>
 *
 * This script should be loaded on a per-use basis on each page that need it.
 * @param {[type]} p the product.
 */
var changeProduct = function(p){
  var i;
  var spans = document.getElementsByClassName("product-span");
  for(i = 0; i<spans.length;i++){
    spans[i].innerHTML = p;
  }
  var imgs = document.getElementsByClassName("product-show");
  for(i = 0; i<imgs.length;i++){
    if(imgs[i].title && imgs[i].title.toLowerCase().indexOf(p.toLowerCase()) != -1){
        imgs[i].style.display = null;
    }else{
      imgs[i].style.display = "none";
    }
  }
  var buttons = document.getElementsByClassName("product-button");
  for(i = 0; i<buttons.length;i++){
    if(buttons[i].innerHTML != p){
      buttons[i].className = "btn btn-default product-button";
    }else{
      buttons[i].className = "btn btn-primary product-button";
    }
  }
  sessionStorage.setItem('product', p);
}
document.addEventListener('DOMContentLoaded',function(){
  var product = sessionStorage.getItem("product");
  if(product){
    changeProduct(product);
  }else{
    document.getElementById("btnProductDefault").click();
  }
});
