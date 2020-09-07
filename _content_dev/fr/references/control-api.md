---
title: Controle de playlist
image: /static/img/posts/media-player/header2.png
abstract: Utilisez l'API Holusion pour contrôler votre produit
rank: 1
---

<div class="row">
  <div class="col-lg-6 col-md-12"><img class="img-fluid" src="/static/img/posts/media-player/header2.png"></div>
  <div class="col-lg-6 col-md-12">
  <p>Holusion fournit une API publique sur chacun de ses produits. Elle permet de controler l'activation, la désactivation, l'ajout ou la suppression, la lecture des médias.
  </p><p>
  Par défaut, cette API est utilisable via l'interface web permettant de <a href="/dev/fr/tutorials/media-transfer">transférer des médias</a>, mais il est possible de l'utiliser directement à partir d'applications tierces.
  </p>
  <p>
  On peut grâce à elle réaliser des systèmes complexes de gestion de contenu. Parmis les interactions possibles avec nos produits, vous pouvez notamment retrouver :
  </p>
  <ul>
  <li>Ajout / suppression de médias</li>
  <li>Lancement instantané d'un média</li>
  <li>Récupération des informations système (nom, version...)</li>
  <li> etc...</li>
  </ul>
  </div>
</div>


## Documentation interactive

Pour utiliser l'API de contrôle de votre produit, il faut y être connecté, en [filaire direct](/dev/fr/tutorials/connect-direct-windows) ou via un [nano-routeur](/dev/fr/tutorials/connect-router).

Dans l'interface, dans l'onglet `Doc` ; vous trouverez une version interactive de cette documentation API qui vous permettra de tester les réponses en situation réelle.

Si vous n'avez pas accès à un produit en état de marche, vous pouvez utiliser la version statique de la documentation ci-dessous.

## Documentation

<div id="swagger-ui">
  <div class="d-flex justify-content-center">
    <div class="spinner-border" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</div>
<script>
  'use strict';
  let loadScript = new Promise(function (resolve, reject){
    let el = document.createElement("SCRIPT");
    el.onload = resolve;
    el.onerror = reject;
    el.src = "https://unpkg.com/swagger-ui-dist@3/swagger-ui-bundle.js";
    document.head.appendChild(el);
  });
  let loadCSS = new Promise(function (resolve, reject){
    let el = document.createElement("link");
    el.onload = ()=>{
      el.media= "screen";
      resolve();
    };
    el.onerror = reject;
    el.rel = "stylesheet";
    el.href = "https://unpkg.com/swagger-ui-dist@3/swagger-ui.css";
    document.head.appendChild(el);
  });
  Promise.all([loadScript, loadCSS]).then(function(){
    console.log("Swagger loaded")
    const DisableTryItOutPlugin = function() {
      return {
        statePlugins: {
          spec: {
            wrapSelectors: {
              allowTryItOutFor: () => () => false
            }
          }
        }
      }
    }
    const ui = SwaggerUIBundle({
      url: "/static/files/api-docs_3.0.1.json",
      dom_id: '#swagger-ui',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset
      ],
      plugins: [
        DisableTryItOutPlugin
      ],
      layout: "BaseLayout",
      docExpansion: "none",
    })
  }, function(err){
    console.warn("Failed to init swagger : ", err);
    document.querySelector("#swagger-ui").innerHTML = `<div class="jumbotron">
      <h1>Impossible d'initializer swagger</h1>
      <p class="lead">${err.toString()}</p>
    </div>`
  })
</script>