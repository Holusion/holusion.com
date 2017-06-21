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

Un lecteur de pages HTML est intégré à tous les produits holusion à partir de la version 1.0.0. La page peut intégrer toutes sortes de ressources javascript ou CSS, intégrées directement au fichier HTML, ou fournies sous forme [d'archive](/fr/toolbox/packaging/).

Pour faciliter le développement, Holusion fournit des "layouts" pour chaque produit. Ils donnent une indication de positionnement et de taille pour créer dynamiquement du contenu adapté.

Ce tutoriel permettra donc de réaliser un exemple portable sur tous les produits de la gamme holusion.


# Hello world

Nous allons d'abord créer l'exemple le plus simple :

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



Transférez le fichier ```hello.html``` sur un produit holusion. Vous devriez voir un texte statique "hello world" s'afficher sur chaque face.

# live Tweet

En utilisant l'API twitter, on peut par exemple créer un live-tweet :

Créer un fichier ```twitter.html``` :

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

En utilisant les widgets twitter, cette page très simple affiche les dernières actualités twitter pour le compte **Holusion**.

Avec cette base, il est possible de construire toutes sortes d'applications.


# Aller plus loin.

### Mise en forme manuelle

Le module `layout` fourni permet une mise en forme rapide et efficace pour débuter. Si il ne remplit pas sa fonction, il est possible de mettre en forme manuellement le contenu. Pour cela, créer des `<div>` positionnées de façon absolue dans le document, suivant le format de votre [produit](http://dev.holusion.com/fr/content/layout/index).

### Applications complexes

Nous conseillons d'utiliser un bundler comme [webpack](https://webpack.github.io/) pour présenter votre application finale sous la forme d'un seul fichier `.html` contenant toutes vos ressources.

Si votre application ne peut pas se packager sous cette forme, par exemple si elle inclus des médias lourds (vidéos, etc...) reportez-vous au [guide](/fr/toolbox/packaging) de packaging d'applications pour en faire une archive Zip compatible.

### Support ESNext, CSS3, HTML5

Le navigateur utilisé repose sur [electron](http://electron.atom.io/). Votre application a donc accès à tous les modules standard de [nodejs](https://nodejs.org/api/), ainsi qu'aux modules spécifiques d'electron [V0.34.0](http://electron.atom.io/docs/v0.34.0/).

Le support ES2015,CSS3 et HTML5 est tiré de la version de Chrome incluse. Actuellement Chrome 51. On peut trouver leur statut dans la  [documentation](https://www.chromestatus.com/features) du projet, ou un résumé [ici](http://kangax.github.io/compat-table/es6/#chrome49).

Pour vérifier la version de chrome utilisée, on peut utiliser la propriété `navigator.userAgent`. Vous obtiendrez un texte de type :

    Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Electron/1.2.2 Safari/537.36

Duquel on déduit que nous utilisons la version `51.0.2704.84` de chrome, pour Electron `1.2.2`. Si votre système est plus ancien, il se peut qu'il utilise encore la version 49 de Chrome.
