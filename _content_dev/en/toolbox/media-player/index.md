---
title: playlist control
image: /static/img/posts/media-player/header2.png
abstract: Use the Holusion API to control your hologram
rank: 1
menu: toolbox
---
<div class="row">
  <div class="col-lg-6 col-md-12"><img class="img-responsive" src="/static/img/posts/media-player/header2.png"></div>
  <div class="col-lg-6 col-md-12">
  <p>Holusion is giving a free public API on each of its products. It permits to control the activation, desactivation, to add or delete medias, and to play the medias.
  </p><p>
  By default, this API can be used via the web interface that allows <a href="/en/packaging">transfere medias</a>, but it can also be used through external applications.
  </p>
  <p>
  Thanks to the API, we can create and use complex content managing methods. The following functions are available :
  </p>
  <ul>
  <li>Add / Delete a media</li>
  <li>Instantly play a media</li>
  <li>Recovery of the system's infos (name, version...)</li>
  <li> etc...</li>
  </ul>
  </div>
</div>


## Setup

Before starting anything, you must be connected to the product. They are configurated to emit a Wi-Fi network by default :

    SSID : <product>-<serial number>
    Clé  : holusionadmin

If you have a custom installation, the access method to the product have been given at the purchase. In this document, we will use for example the default IP `10.0.0.1` to access the product.

If the Wi-Fi doesn't work, is too slow, or if the product isn't equiped, you can connect it with an ethernet cable :

- On your [local network](/en/toolbox/packaging/net-discovery)
- Directly on your [work station](/en/toolbox/packaging/local-dhcp)

In the case of the demountable products (focus, iris...), make sure to connect at least one screen to the computer. The administration service doesn't start if there is no display.

## Discover

The API has a complete interactive guide at this adress : `http://10.0.0.1/doc`. The requests can be tested directly on the product.

The *routes* are grouped in 5 categories :
<center>
<img class="img-responsive" src="/static/img/posts/media-player/list.png" alt="routes groups">
</center>

Pour montrer le fonctionnement de cette interface, nous utiliserons dans un premier temps les routes du groupe `playlist`. Cliquer sur la ligne correspondante pour lister les opérations possibles.

<center>
  <img class="img-responsive" src="/static/img/posts/media-player/playlist_routes.png" alt="routes groups">
</center>

Nous utiliserons d'abord la première route disponible, qui permet de lister les éléments de la liste de lecture.

<div class="row">
  <div class="col-md-6 col-sm-12">
    <p>
    Le détail de `[GET] /playlist`.
    </p>
    <img class="img-responsive" src="/static/img/posts/media-player/route_details.png" alt="route details">
  </div>
  <div class="col-md-6 col-sm-12">
    <p>
    Exemple de réponse en cliquant sur **Try it out!**
    </p>
    <img class="img-responsive" src="/static/img/posts/media-player/route_response.png" alt="route details">
  </div>
</div>

Cette requête produit donc un tableau **JSON** comportant les identifiants des différents médias disponibles.

On peut la réutiliser dans une application très simple. Par exemple, en python (exemple pour python v2.x):

    import requests
    requests.get("http://10.0.0.1/playlist").text

Renvoie la même séquence de texte que l'exemple de la documentation.

**Attention** : Les requêtes présentées agissent réellement sur le produit. Si vous testez par exemple la route `[DELETE] /medias/{name}`, le média ciblé sera définitivement supprimé de votre produit.


## Première application

Afin de prendre en main l'API, nous allons réaliser en python une première application.

**Note** : Tous les environnements modernes proposent des librairies similaires à la syntaxe proche.

Nous utiliserons la librairie `requests`, qui permettra d'accéder à l'API.

    #!/usr/bin/env python
    import requests
    #On récupère les médias disponibles :
    medias = requests.get("http://10.0.0.1/playlist").json()
    print(medias[0].get("name"))


L'idée générale est qu'en utilisant les requêtes standard et en se basant sur les réponses données par la documentation, on peut facilement et rapidement créer une interface complète permettant d'interagir avec les hologrammes.

## Aller plus loin

{% include_relative exemples.html %}
