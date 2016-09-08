---
title: Transfert de médias
redirect_from:
  - "/fr/media-upload/"
  - "/fr/packaging/"
image: /build/img/posts/banner_packaging.jpg
image2x: /build/img/posts/banner_packaging_2x.jpg
abstract: Préparer vos fichiers pour les transférer sur projecteur
rank: 1
menu: toolbox
---

## Introduction

Cette page décrit les étapes nécessaires à la diffusion de nouveaux contenus sur votre produit: Connexion au produit et transfert de fichiers.
La méthode utilisée pour transférer des fichiers est expliquée dans la section [transfert](#transfert).



## Connexion

Les produits sont par défaut configurés pour émettre un réseau wifi :

    SSID : <produit>-<N° de série>
    Clé  : holusionadmin

Par exemple, si vous possédez le prism N°1, il faudra trouver un réseau appellé `prism-01`. Si votre produit a reçu une configuration spécifique, veuillez vous réferer aux informations qui vous ont alors été communiquées.

Une fois connecté, naviguer à l'adresse `10.0.0.1`. Vous devriez voir apparaitre la zone de chargement de fichiers :
<center>
  <img alt="mime type error" class="img-responsive" src="/static/img/posts/packaging/remote_upload.png"/>
</center>

## Contenu

Les formats nativement supportés sont :

**Les fichiers vidéo** : .mov, .avi, .mp4, .flv, .mkv

**Les fichiers executables** : sans extension, de [type mime](https://fr.wikipedia.org/wiki/Type_MIME) ```application/```

**Les dossiers archivés [sous condition](#archives)** : .tar.gz (conseillé), .tar, .zip

Le système holusion repose sur des règles simples mais extensibles pour classifier les fichiers et applications. Un fichier ne correspondant pas à ces règles sera automatiquement rejeté.

<center>
  <img alt="mime type error" class="img-responsive" src="/static/img/posts/packaging/remote_error.jpg"/>
  <p>Exemple : un fichier <b>pdf</b></p>
</center>


## Transfert

Utiliser la barre **"Upload"** de l'interface d'administration pour choisir et envoyer votre fichier.
<center>
  <img alt="upload bar remote holusion" title="transfert" src="/static/img/posts/packaging/remote_browse.png"/>
  <p>Choisir un fichier</p>
</center>

Cliquer sur le bouton `Upload` pour lancer le transfert.

<center>
  <img alt="upload bar remote holusion" title="transfert" src="/static/img/posts/packaging/upload_bar.jpg"/>
  <p>Un transfert réussi.</p>
</center>

## Archives

Les archives sont acceptées par le système et sont le moyen idéal pour tranférer des applications complètes, souvent difficiles à packager en un seul fichier. Par exemple, les applications Unity.

Les formats de compression supportés sont : **.tar, .tar.gz, .zip**.

Le contenu de l'archive doit être identifié d'une des manières suivantes pour qu'elle soit acceptée :
(si un élément est trouvé, les suivants seront ignorés)

1. avoir un fichier package.json à la racine, qui contient:
    1. un champ ```start``` avec la commande à executer.
    2. un champ ```script:start``` avec la commande à executer.
    3. un champ ```bin``` contenant un fichier binaire uniquement.
    4. un champ ```main``` avec le fichier à executer. Ce fichier doit comporter un [en-tête "shebang"](https://fr.wikipedia.org/wiki/Shebang) si c'est un script.
3. ne contenir à sa racine qu'un seul fichier, executable. Plus eventuellement un ou plusieurs sous dossiers.

Exemple de fichier package.json minimaliste:
{% highlight json %}
{
  "name":"my wonderful app",
  "start":"sh myscript.sh"
}
{% endhighlight %}
La norme holusion est compatible avec [npm](http://npmjs.org).

Les archives ainsi créées peuvent-être transférées directement.
