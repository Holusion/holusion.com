---
title: Blender
image: /build/img/posts/banner_blender.jpg
image2x: /build/img/posts/banner_blender_2x.jpg
abstract: Modélisation d'hologrammes sur le logiciel libre de rendu 3D Blender
menu: content
rank: 3
---


L'infographie vous offre l'opportunité de créer l'hologrammes. Elle ne fait face qu'à une seule limite : votre imagination.

Blender est un logiciel libre de dessin 3D que vous pouvez utiliser pour créer des films d'animations, des effets visuels de post-production ou encore des simulations 3D.
Il inclut des modules de modélisation 3D, de textures, de moteurs physiques, de sculptures, d'animations de rendu et de post-production.

Toutes les sources sont librement téléchargable sur le site de la **Fondation Blender** : [www.blender.org](https://www.blender.org/download/)

<a class="button" href="/static/files/BLENDER_PRISME.zip">Téléchargez pour Prism</a>


> Ce tutoriel s'adresse à un public possédant une expérience basique de la modélisation et du rendu 3D.

##Nouvel arrivant sur Blender ?

La communauté est très active autour de Blender. Elle vous propose des tutoriels pour prendre en main et approfondir vos connaissances sur ce logiciel :

* [Introduction à Blender](http://cgcookie.com/flow/introduction-to-blender/)
* [Tutoriels officiels Blender](https://www.blender.org/support/tutorials/)
* [Blenderguru : communauté d'experts Blender](http://www.blenderguru.com/)


<div class="row">
  <div class="col-sm-6 offset-sm-3">
<img src="/static/img/posts/blender/blender_screen.png" srcset="/static/img/posts/blender/blender_screen2x.png 1200w, /static/img/posts/blender/blender_screen2x.png 600w" alt="Blender screen" class="img-fluid">
</div>
</div>

##Holusion Blender Framework

Vous pouvez utiliser notre framework pour le **Prism** ou le **Focus**. Cela vous permet :

* De modifier la résolution native et la post-production ;
* De gérer automatiquement l'adaption de l'image aux écrans des projecteurs d'hologrammes ;
* De disposer d'une scène "clé-en-main" pour vos rendus.

<img src="/static/img/posts/blender/blender.jpg" srcset="/static/img/posts/blender/blender4x.jpg 1900w, /static/img/posts/blender/blender2x.jpg 1000w, /static/img/posts/blender/blender.jpg 500w" alt="Blender framework" class="img-fluid">

##How To

###Réaliser une modélisation
Blender vous permet de modéliser vos propres sujets pour en faire des hologrammes. Vous pouvez en effet importer un modèle d'une autre source :

* Collada (.dae)
* Motion capture (.bvh)
* Scalable Vector Graphics (.svg)
* Standford (.ply)
* Stl (.stl)
* 3DS studio (.3ds)
* FBX (.fbx)
* Wavefront (.obj)
* X3D Extensible 3D (.wrl)

###Importer la scène
Téléchargez et ouvrez votre scène .blend en fonction de votre modèle  :

* [Prism](/static/files/BLENDER_PRISME.zip)
* Focus (WIP)

Utilisez la fonction d'importation pour ajouter votre modèle. Si il vient d'un autre fichier Blender, les textures et l'éclairage devraient s'importer correctement.
Mettez à l'échelle, animez, éclairez et faîtes des tests de rendu pour vérifier la qualité de votre scène à travers les yeux de la caméra. Le sujet ne devrait jamais dépasser du cadre de la caméra.

> **Utilisateur avancé** : vous pouvez éditer les options de la caméra si son réglage standard ne vous correspond pas. La caméra traque l'empty au centre de la scène. Vous pouvez l'utiliser pour des mouvements de caméra. Prenez en compte une contrainte le long d'un cercle pour faire tourner votre caméra autour du sujet.

Lorsque tout est pret, lancez l'"Animation" dans le panneau de rendus. N'oubliez pas de :

* Valider le compositing ;
* Faire des **rendus test** le long de votre animation pour vérifier que le sujet ne sorte pas du cadre ;
* Fixer les "sampling" (Pour les rendu Cycle) ;
* Vérifier le dossier de sortie.

> **Utilisateur expert** :
vous pouvez éditer de nouvelles fonctionnalités en modifiant le panneau de Node :

* Utilisez des images pré-rendues
* Créez un hologramme avec 4 faces différentes.


##Scène ready-to-go

Voici un modèle libre de Char d'assault Panzer III pour pouvoir faire vos tests sur le Prism :

<div class="row">
  <div class="col-sm-6 offset-sm-3">
    <a href="/static/files/BLENDER_pzkfwg3.zip"><img class="img-fluid" alt="pzkfwg3" src="/static/img/posts/blender/PanzerIII.png"/></a>
  </div>
</div>
