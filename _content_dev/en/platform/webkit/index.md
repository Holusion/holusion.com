---
title: Webkit
image: /build/img/posts/banner_webkit.jpg
image2x: /build/img/posts/banner_webkit_2x.jpg
abstract: Demonstration application using the Chrome engine and nodejs
rank: 5
menu: platform
---

<div class="row">
<div class="col-md-6">
<img class="img-responsive" src="/static/img/posts/webkit/logos.jpg"/>
</div>
<div class="col-md-6">
<p>
Webkit is the most performing and currently the most used web engine. It is in the foudations of the <b>Google Chrome</b> navigator.
The use of webkit to create holograms is a way of using the very last web technologies in order to make fluid animations.
</p>
<p>
A particular version of the Chrome navigator : "<a href="http://electron.atom.io/">Electron</a>" (the ancien Atom core) is installed on our products. It permits an immediate access to the resources that will facilitate your development.
</p>
<p>
These applications are taking advantages of all the power of modern navigators. You are not familiar with its process ? Your technology isn't compatible ? Don't panic, Electron provides an environment that you can use in total autonomy.
</p>
</div>
</div>

# Introduction

A HTML page since the 1.0.0 version. The page can integrate all types of resources, Javascript or CSS, directly integrated into the HTML file, or given under the [archive](/fr/toolbox/packaging/) format.

In order to facilitate the development, Holusion gives "layouts" for each product. They gives position and scale indications to create a dynamic adapted content.

This tutorial will teach you how to make an example that will be adapted for all Holusion's products.

# Hello world

We will create the simplest example :

    <html>
    <head>
      <script>
        document.addEventListener("DOMContentLoaded", function(event) {
          var Layout = require("layout");
          var layout = new Layout(document.getElementById("viewport"));
          layout.render('Hello World');
        });
      </script>
    </head>
    <body>
      <div id="viewport"></div>
    </body>
    </html>



Transfere the ```hello.html``` file on the Holusion product. You should see a static text "hello world" being displayed on each face of your product.

# live Tweet

By using the twitter API, we can for example create a tweet-live :

Create a file named ```twitter.html``` :

    <html>
    <head>
      <script>
        document.addEventListener("DOMContentLoaded", function(event) {
          var Layout = require("layout");
          var layout = new Layout(document.getElementById("viewport"),"file:///etc/layouts/layouts-enabled/style.css");
          layout.render('<a class="twitter-timeline" href="https://twitter.com/holusion" data-widget-id="657189153893916672"  data-chrome="transparent nofooter noborders noscrollbar">Tweets by @holusion</a>').then(function(){
            var apiCall = document.createElement("script");
            document.body.appendChild(apiCall);
            apiCall.text = '!function(d,s,id){\
              var js,fjs=d.getElementsByTagName(s)[0]  , p=/^http:/.test(d.location)?\'http\':\'https\';if(!d.getElementById(id)){\
                  js=d.createElement(s);\
                  js.id=id;js.src=p+"://platform.twitter.com/widgets.js";\
                  fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");'
          })
        });
      </script>
    </head>
    <body>
      <div id="viewport"></div>
    </body>
    </html>

By using the twitter widgets, this page uses the last twitter news for the  **Holusion** account.

With this base, it is possible to create all types of applications.


# Going further.

### Manual shaping

The given `layout` module allows a fast and efficient shaping to begin. If it doesn't fulfil its fonction, it is possible to manually shape the content. To do this, create some `<div>` placed in an absolute way, following your [product](http://dev.holusion.com/fr/content/layout/index) format.

### Complex applications

We advise you to use a bundler as [webpack](https://webpack.github.io/) to present your finale application under a one `.html` file format, containing all your resources.

If your application cannot be packaged with this format, for example if it contains heavy files (videos, etc...) you can consult this application packaging [guide](/en/toolbox/packaging) to make it a compatible Zip archive.

### ESNext, CSS3, HTML5 support

The navigator is using [electron](http://electron.atom.io/). Your application has access to all the standard [nodejs](https://nodejs.org/api/) modules, as well as the specific electron's [V0.34.0](http://electron.atom.io/docs/v0.34.0/) modules.

The ES2015,CSS3 and HTML5 support is taken from the Chrome included version. Currently Chrome 51. We can find their status in the project's  [documentation](https://www.chromestatus.com/features), or a summary [here](http://kangax.github.io/compat-table/es6/#chrome49).

To verify the used Chrome version, we can use the `navigator.userAgent` command. You will see this kind of answer :

    Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Electron/1.2.2 Safari/537.36

With this we can understand that we are using the `51.0.2704.84` version of Chrome, for Electron `1.2.2`. If you have a older system, it probably uses the version 49 of Chrome.
