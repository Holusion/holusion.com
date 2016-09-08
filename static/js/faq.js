function Faq(content){
  var i,j, texts;
  this.content = content||document.getElementById("content")
  this.content.classList.add("faq");
  var contents = this.content.children;
  for(i = 0; i < contents.length-1; i++){
    texts = [];
    if( contents[i].tagName === "H3"){
      j = i+1;
      while(contents[j] && !/^H[123]/.test(contents[j].tagName)){
        texts.push(contents[j]);
        j++;
      }
      if(texts.length > 0){
        this.makePanel(contents[i],texts,i);
      }
    }
  }

}
Faq.prototype.makePanel = function(head,texts,index){
  var i
    , panel = document.createElement("div")
    , panelHeader = document.createElement("div")
    , panelBody = document.createElement("div")
    , glyphExpand = document.createElement("span");

  this.content.insertBefore(panel,head);
  head.classList.add("panel-title");
  glyphExpand.className = "glyphicon glyphicon-plus center-block visible-lg";
  panel.dataset.id = head.id;
  panel.className = "panel panel-default fold";
  panel.appendChild(panelHeader);
  panel.appendChild(panelBody);

  panelHeader.className = "panel-heading";
  panelHeader.appendChild(head);
  panelHeader.onclick = this.unfold.bind(this,panel);
  //panelHeader.appendChild(glyphExpand);

  panelBody.className = "panel-body";
  for(i=0;i<texts.length;i++){
    panelBody.appendChild(texts[i]);
    //this.content.removeChild(texts[i]);
  }
  glyphExpand.className = "glyphicon glyphicon-plus";
  if(window.location.hash == "#"+head.id){
    this.unfold(panel);
  }
}
Faq.prototype.unfold = function(panel,ev){
  if(this.currentActive){
    this.currentActive.classList.add("fold");
  }
  if(this.currentActive != panel){ //Fold
    panel.classList.remove("fold");
    this.currentActive = panel;
    if(panel.dataset.id){
      this.updateHash(panel.dataset.id);
    }
  }else{
    this.currentActive = null;
  }

}

Faq.prototype.updateHash = function(id){
  var target = document.getElementById(id)
  if (target){
    target.id = '';
    window.location.hash = "#"+id;
    target.id = id;
  }
}
