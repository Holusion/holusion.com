---
title: controle de playlist
image: /static/img/posts/media-player/header2.png
abstract: Utilisez l'API Holusion pour contrôler votre produit
rank: 1
menu: toolbox
---
<div class="row">
  <div class="col-lg-6 col-md-12"><img class="img-responsive" src="/static/img/posts/media-player/header2.png"></div>
  <div class="col-lg-6 col-md-12">
  <p>Holusion fournit une API publique sur chacun de ses produits. Elle permet de controler l'activation, la désactivation, l'ajout ou la suppression, la lecture des médias.
  </p><p>
  Par défaut, cette API est utilisable via l'interface web permettant de <a href="/fr/packaging">transférer des médias</a>, mais il est possible de l'utiliser directement à partir d'applications tierces.
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

Avant tout, il est nécessaire d'être connecté au produit. Ils sont par défaut configurés pour émettre un réseau wifi :

    SSID : <produit>-<N° de série>
    Clé  : holusionadmin

Si vous bénéficiez d'une installation sur mesure, la méthode d'accès au produit devra vous avoir été transmise à l'installation. Dans la suite de ce document, nous utiliserons en exemple l'IP par défaut `10.0.0.1` pour accéder au produit.

Si le wifi ne fonctionne pas, est trop lent, ou si votre produit n'en est pas équipé, vous pouvez le connecter via un cable Ethernet :

- Sur votre [réseau local](/fr/toolbox/packaging/net-discovery)
- Directement sur votre [poste de travail](/fr/toolbox/packaging/local-dhcp)

Dans le cas des produits démontables (focus, iris...), assurez-vous de connecter au moins un écran à l'ordinateur. Le service d'administration ne démarre pas quand aucun affichage n'est détecté.

## Découverte

L'API dispose d'une documentation interactive complète à l'adresse : `http://10.0.0.1/doc`. Les requêtes peuvent y être testées en situation réelle directement sur le produit.

Les *routes* sont groupées en 5 catégories :
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
