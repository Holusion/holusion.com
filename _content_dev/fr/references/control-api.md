---
title: controle de playlist
image: /static/img/posts/media-player/header2.png
abstract: Utilisez l'API Holusion pour contrôler votre produit
rank: 1
---

<div class="row">
  <div class="col-lg-6 col-md-12"><img class="img-fluid" src="/static/img/posts/media-player/header2.png"></div>
  <div class="col-lg-6 col-md-12">
  <p>Holusion fournit une API publique sur chacun de ses produits. Elle permet de controler l'activation, la désactivation, l'ajout ou la suppression, la lecture des médias.
  </p><p>
  Par défaut, cette API est utilisable via l'interface web permettant de <a href="/dev/fr/toolbox/packaging/">transférer des médias</a>, mais il est possible de l'utiliser directement à partir d'applications tierces.
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


## Mise en place

Pour utiliser l'API de contrôle de votre produit, il faut y être connecté, en [filaire direct](/dev/fr/tutorials/connect-direct-windows) ou via un [nano-routeur](/dev/fr/tutorials/connect-router). Dans ce guide nous utiliserons `192.168.1.100` comme IP de votre produit. Il faudra la remplacer par son IP réelle le cas échéant.

## Découverte

L'API dispose d'une documentation interactive complète à l'adresse : `http://192.168.1.100/doc`. Les requêtes peuvent y être testées en situation réelle directement sur le produit.

Les *routes* sont groupées en 5 catégories :
<center>
<img class="img-fluid" src="/static/img/posts/media-player/list.png" alt="routes groups">
</center>

Pour montrer le fonctionnement de cette interface, nous utiliserons dans un premier temps les routes du groupe `playlist`. Cliquer sur la ligne correspondante pour lister les opérations possibles.

<center>
  <img class="img-fluid" src="/static/img/posts/media-player/playlist_routes.png" alt="routes groups">
</center>

Nous utiliserons d'abord la première route disponible, qui permet de lister les éléments de la liste de lecture.

<div class="row">
  <div class="col-md-6 col-sm-12">
    <p>
    Le détail de `[GET] /playlist`.
    </p>
    <img class="img-fluid" src="/static/img/posts/media-player/route_details.png" alt="route details">
  </div>
  <div class="col-md-6 col-sm-12">
    <p>
    Exemple de réponse en cliquant sur **Try it out!**
    </p>
    <img class="img-fluid" src="/static/img/posts/media-player/route_response.png" alt="route details">
  </div>
</div>

Cette requête produit donc un tableau **JSON** comportant les identifiants des différents médias disponibles.

On peut la réutiliser dans une application très simple. Par exemple, en python (exemple pour python v2.x):

    import requests
    requests.get("http://10.0.0.1/playlist").text

Renvoie la même séquence de texte que l'exemple de la documentation.

**Attention** : Les requêtes présentées agissent réellement sur le produit. Si vous testez par exemple la route `[DELETE] /medias/{name}`, le média ciblé sera définitivement supprimé de votre produit.


## Première application

Afin de prendre en main l'API, nous allons réaliser une première application en python.

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
