---
title: search
layout:
---
{% include utils/lang.html %}
{% include utils/make_pages.html %}


var createIndex = function (){
  var index = lunr(function () {
    this.field('title', {boost: 10})
    this.field("abstract", {boost:2})
    this.field('body')
    this.ref('url')
  })
  var store = {};
  {% for page in pages %}
  {% if page.abstract %}
    {% capture abstract %}{{page.abstract|strip_html|strip_newlines|escape|remove :'\t'}}{% endcapture %}
    index.add({
      title: "{{page.title}}",
      url:"{{page.url}}",
      abstract:'{{abstract}}'||null,
      body: '{{page.content|strip_html|strip_newlines|escape|remove :'\t'}}'
    });

    store["{{page.url}}"] = {
      title:"{{page.title}}",
      abstract:"{{abstract}}",
      image:"{{page.image}}"
      };
    {% endif %}
  {% endfor %}
  return {index:index,store:store};
};
/*
var lunrScript = document.createElement("SCRIPT");
lunrScript.type = 'text/javascript';
lunrScript.async = true;
lunrScript.onload = createIndex;
lunrScript.onerror = console.error;
lunrScript.src = "/vendor/lunr.js/lunr.min.js"
document.head.appendChild(lunrScript);
//*/
