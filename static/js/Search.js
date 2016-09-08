function Search(searchBox){
  var query;
  this.load = null;

  this.input = searchBox.children[0].children[0].children[0]; //FIXME Ugly
  this.button = searchBox.children[0].children[0].children[1];
  this.input.oninput = this.oninput.bind(this,this.input);
  this.button.onclick = this.onsubmit.bind(this,this.input);
  searchBox.onsubmit = this.onsubmit.bind(this,this.input);
  if((query = this.decodeQuery())){
    this.input.value = query;
    this.render(query); //Will take care if no resBox.
  }
}

Search.prototype.decodeQuery = function(){
  var query = /\?query=([^&]*)/.exec(window.location.search)
  if(query && query[1]){
    return decodeURIComponent(query[1]).replace(/\+/g," ");
  }else{
    return "";
  }
}

Search.prototype.loadIndex = function(shallow){
  var self = this;
  if(this._load) return this._load; //load only once.

  if(shallow && localStorage.getItem("lunrIndex")){
    this._load = this.loadLibrary("lunrjs","/vendor/lunr.js/lunr.min.js").then(function(){
      return lunr.Index.load(JSON.parse(localStorage.getItem("lunrIndex")));
    });
  }else{
    this._load = this.loadLibrary("lunrjs","/vendor/lunr.js/lunr.min.js").then(function(){
      return self.loadLibrary("searchIndex","/static/js/searchIndex.js")
    }).then(function(){
      return createIndex();
    }).then(function(data){
      localStorage.setItem("lunrIndex",JSON.stringify(data.index.toJSON()));
      return data;
    });
  }
  return this._load;
}

Search.prototype.oninput = function(elem,ev){
  var res;
  var val = elem.value;
  //don't do real time search on short strings
  if(val.length<3)return;
  this.render(val);
}

Search.prototype.onsubmit= function(elem){
  var query = this.decodeQuery();
  if(query != this.input.value){
    return true;
  }
  return false; //prevent form's action
}


Search.prototype.loadLibrary = function(name,path){
  return new Promise(function(resolve, reject) {
    var js = document.getElementById(name);
    if(js && js.tagName == "SCRIPT") return resolve();
    //else we create the script.
    js = document.createElement("SCRIPT");
    js.type = 'text/javascript';
    js.id = name;
    js.async = true;
    js.onload = resolve;
    js.onerror = reject;
    js.src = path;
    document.head.appendChild(js);
  });
}

Search.prototype.render = function (query) {
  var self = this;
  var resBox = document.getElementById("search-results"); //if there's a result box
  var querystr = document.getElementById("search-string")
  if(!resBox) return;
  //optionnal search-string
  if(querystr) querystr.innerHTML = "\""+query+"\"";
  resBox.innerHTML = "";
  this.loadIndex().then(function(data){
    var results = data.index.search(query);
    if(!results || results.length ==0 ){
      resBox.innerHTML = "<div><center><h3>Aucun Résultat</h3></center></div>"
      console.log("Results : ",results);
    }else{
      var ul = document.createElement("DIV");
      ul.className = "row";
      ul.id = "content-admin"
      results.forEach(function(rs){
        ul.appendChild(self.getComponent(rs.ref,data.store[rs.ref]));
      });
      resBox.appendChild(ul);
    }
  },function(e){console.error("From Search.render() : ",e.stack)})
};


Search.prototype.getComponent = function (ref,data) {
  var li = document.createElement("DIV");
  li.className = "col-md-3 col-xs-6 thumbnail";
  li.innerHTML = "<a href=\""+ref+"\">"
    +"<img src=\""+"/static/img/posts/"+((data.image)?data.image:"default.jpg")+"\">"
    +"<div class=\"caption\"><h3>"+data.title+"</h4>"+data.abstract+"</div>"
    +"</a>";
  return li;
};
var searchBox = document.getElementsByClassName("search-form")[0];
if(searchBox){
  var search = new Search(searchBox);
}
