---
title: After Effect
image: /build/img/posts/banner_after_effect.jpg
image2x: /build/img/posts/banner_after_effect_2x.jpg
abstract: Projet After Effect visant à simplifier la réalisation de contenu vidéo
menu: content
rank: 3
---

<style>
.product-span{
  font-weight:bold;
}
</style>
<script src="/static/js/product_switcher.js"></script>



<div class="row">
  <div class="col-md-6">
    <div align="center" class="embed-responsive embed-responsive-16by9">
      <video controls="" class="embed-responsive-item" height="270px" muted="" preload="auto" poster="/static/img/posts/after-effect/logo_large.jpg">
        <source src="/static/video/after-effect.mp4" />
        <img alt="" src="/static/img/posts/after-effect/logo_large.jpg" />
      </video>
    </div>
  </div>
  <div class="col-md-6">
    <p>
      <b>Holusion</b> propose un projet After Effect complet pré-configuré. Il vise à simplifier la réalisation de contenus sur ce logiciel.
    </p>
    <p>
      Le tutoriel ci-contre vous permet de créer votre premier hologramme en quelques étapes.
    </p>
    <p>  
      Retrouvez le manuel d'utilisation de cet outil dans l'archive téléchargeable ci-dessous sous la forme d'un fichier <b>Lisez-moi.pdf</b>.
    </p>
    <p><center><a class="button" href="/static/files/Templates_after_effect.zip">Télécharger</a></center></p>
    <p>
      Pour des montages sur-mesure, <a href="#Expert">une section dédiée</a> vous permettra d'optimiser vos propres projets.
    </p>
  </div>
</div>


#Prise en main

Les compositions After Effect fournies sont compatibles avec **Adobe After Effect CS6**. Elles ont
un seul objectif : simplifier le montage de vidéos pour les projecteurs d'hologrammes Holusion.

Pour commencer, ouvrez le projet correspondant au produit ciblé : **Prism** ou **Focus**.
Chaque projet contient deux scènes : **Input** et **Render**, qui seront utilisées par la suite.


## Choix du produit


<div class="row">
  <div class="col-lg-4 col-xs-5" style="text-align:right;padding-right:0px;">
	<p>
     <button class="btn btn-default product-button" onclick="changeProduct(this.innerHTML)" style="margin-bottom:5px;">Prism</button>
	</p>
	<p>
     <button id="btnProductDefault" class="btn btn-primary product-button" onclick="changeProduct(this.innerHTML)" >Focus</button>
	</p>
  </div>
  <div class="col-xs-5 col-lg-4">
    <img class="product-show img-responsive" height="100px" title="Prisme" src="/static/img/products/prisme.jpg"/>
    <img class="product-show img-responsive" height="100px" title="Focus" src="/static/img/products/focus.jpg"/>
  </div>
</div>

## Insérer le contenu

**Ouvrir le fichier :** Template_<span class="product-span">Focus</span>.

Ouvrir la composition  **"Input"**.

Un cadre de couleur indique le cadrage requis pour que l'image ne soit pas tronquée au montage. Ce
cadre sera caché au moment du rendu.

<center><img class="img-responsive" src="/static/img/posts/after-effect/layouts_input_compared.jpg"/></center>


Dans les exemples donnés par la suite, nous utiliserons le modèle <span class="product-span">Focus</span> ([changer de modèle](#choix-du-produit)). La procédure est
identique pour chaque produit.


## Etape par Etape

### 1. Insérer le métrage

Dans la colonne de gauche, faites un clic droit et sélectionnez ```Importation > Fichier``` (Raccourci Ctrl+I). Importez votre contenu puis
insérez le dans la composition **"Input"**.

*Note : Le contenu peut être une ou plusieurs images, vidéos, ou séquence d'images par exemple.*

### 2. Adapter la composition

<div class="row">
<div class="col-sm-6">
Il faut changer la durée de la composition en fonction de celle du contenu désiré.
Par exemple, pour réaliser une vidéo d'une minute : cliquez droit sur la composition <b>"Input"</b> dans le
volet "projet" ; puis sur <b>paramètres de composition</b>. Dans la fenêtre qui apparait, modifiez le champ <i>durée</i>.
</div>
<div class="col-md-3 col-sm-offset-1 col-sm-4 col-xs-6 col-xs-offset-3">
<img src="/static/img/posts/after-effect/settings.jpg" class="img-responsive magnify"/>
</div>
</div>

Faites de même pour la composition **"Render"**.

### 3. Mettre en forme le métrage

En utilisant le menu contextuel (clic droit sur le contenu), il est possible de le retravailler. Voici quelques
outils utiles :

<b> Géometrie </b>

* Echelle
* Rotation

<b> Masque </b>

* Créer nouveau masque

Il est conseillé d'utiliser tout l'espace disponible pour que le rendu ait le meilleur effet.

Attention :

* Tout ce qui sort du cadre rouge sera coupé au montage.
* Si la forme de votre contenu change au cours du temps, vérifiez que celui-ci n'est pas coupé.

## Rendu
Dans l'onglet *File d'attente de rendu*, cliquez droit sur l'élément déjà présent et sur ```Dupliquer le
rendu```.
Changez le fichier de sortie à  votre convenance. Les paramètres d'encodage par défaut conviennent
généralement.

<div class="row">
<div class="col-md-6 col-md-offset-3">
<img class="img-responsive magnify" src="/static/img/posts/after-effect/duplicate_render.jpg"/>
</div>
</div>


Editez enfin le nom du fichier de sortie. <b> La vidéo est prête à  être transférée sur votre produit! </b>

# Améliorer l'hologramme
Il existe de nombreuses techniques pour améliorer l'effet holographique de vos productions. Laissez-vous guider pour les découvrir et créer des contenus toujours plus impressionnants.

## Image colorée sur fond noir

Les objets / sujets animés sur fond noir donneront toujours le meilleur effet.

Par exemple, l'image de gauche rendra bien mieux que celle de droite :

<div class="row">
<div class="col-sm-6 col-sm-offset-3">
<img class="img-responsive center-block" src="/static/img/posts/after-effect/background_example.jpg"/>
</div>
</div>

De plus, les couleurs vives seront visuellement plus impactantes, alors que les couleurs sombres donneront un effet de transparence.


## Mise en forme manuelle

> Expert :
cette partie est conseillée aux utilisateurs expérimentés disposant d'une bonne maitrise du logiciel **Adobe After Effect**. Pour prendre en main les produits, nous conseillons de commencer en utilisant les [templates pré-construits](#prise-en-main).

Chaque produit requiert une mise en forme spécifique. Sélectionnez votre produit pour voir le masque de positionnement associé.

<button class="btn btn-default product-button" onclick="changeProduct(this.innerHTML)" >Prism</button>
<button class="btn btn-primary product-button" onclick="changeProduct(this.innerHTML)" >Focus</button>

Il faut réaliser deux opérations pour pouvoir projeter un film dans un produit Holusion :

<p>Retourner les images, comme si elles étaient vues en reflet dans un miroir.
Exemple de <b>rendu "miroir"</b> :

<div><img height="150px" src="/static/img/posts/after-effect/mirror.jpg" /></div>
</p>


<p>Positionner les images pour qu'elles apparaissent correctement à l'écran.
</p>

<img class="magnify product-show" height="150px" title="Prisme" src="/static/img/posts/layout/sample_prism.jpg"/>
<img class="magnify product-show" height="150px" title="Focus" src="/static/img/posts/layout/sample_focus.jpg"/>

<p>Exemple de mise en place : <span class="product-span">Focus</span>.</p>
<p>Résolution :
<strong>
<span class="product-show" title="Prisme">1280x1024</span>
<span class="product-show" title="Focus">1920x2160</span>
</strong>
</p>



**Attention** : Bien respecter la résolution optimale des produits.

- **Prism** : 1280 x 1024
- **Focus** : 1920 x 2160
