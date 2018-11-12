---
title: Natron
image: /build/img/posts/banner_natron.jpg
image2x: /build/img/posts/banner_natron_2x.jpg
abstract: Création de vidéos holographiques en utilisant le logiciel de création gratuit "Natron"
menu: content
rank: 5
---

Natron est un logiciel libre de création et composition de vidéo performant et distribué sous licence libre. Il peut être utilisé sur **MacOSX**, **Windows** et **Linux** et est une alternative gratuite au logiciel d'Adobe [After Effect](/dev/fr/content/after_effect/).

On peut l'utiliser pour créer rapidement des vidéos en hologrammes.

## Installation

1. Suivre les instructions d'installation pour [Windows, MacOSX et Linux](http://natron.fr/download/).
2. Télécharger le projet de base adapté :
  - Pour [prism](/static/files/natron_prism.zip)
  - Pour [focus](/static/files/natron_focus.zip)

Extraire l'archive téléchargée et ouvrir le projet obtenu dans [Natron](https://natrongithub.github.io/).

<center>
  <img class="img-fluid" src="/static/img/posts/natron/natron_open.jpg" alt="Ecran d'accueil de Natron">
  <div><b>Un Projet Natron à l'ouverture</b></div>
</center>

## Utilisation

### Aperçu

Le projet fourni contient un certain nombre de transformations (en orange) et de masques (en Bleu) configurés pour produire l'hologramme final. La plupart des paramètres sont pré-configurés et ne devront pas être changés.

Les éléments principaux visibles dans la partie "Node Graph" qui seront utilisés :

- **Input View** : Aperçu intermédiaire permettant de positionner et dimensionner la vidéo source dans son masque
- **Output View** : Aperçu du résultat final
- **Position** : Réglage de taille et position de la vidéo source.

### importer une vidéo
La première étape est d'importer votre vidéo source. Il faut créer un nouveau *Node* dans la partie "Node graph" du logiciel. Soit simplement par un glisser-déposer de la vidéo dans cette zone.

<center>
  <img class="img-fluid" src="/static/img/posts/natron/natron_node_graph.png" alt="Le Node graph">
  <div><b>la zone "Node Graph"</b></div>
</center>

vous pouvez aussi faire un clic droit dans cette zone, choisir **Reader** dans la section **image**, ou encore utiliser le raccourci par défaut "**R**".

Cela devrait créer un `Reader node`. Il faut ensuite le relier au node `Position`, qui permettra de configurer la vidéo.

<center>
  <img class="img-fluid" src="/static/img/posts/natron/node_linking.gif" alt="animation montrant la connexion d'un reader node à un transform node dans Natron">
  <div><b>Créer un lien entre 2 nodes</b></div>
</center>

### Optimiser le rendu

Quelques réglages sont nécessaires pour obtenir un résultat optimal. Ceux-ci seront faits sur les **transform Nodes** de la scène. Soit manuellement dans la prévisualisation, soit pour plus de précision dans l'outil de configuration de ces "Nodes".

Une mire de redimensionnement et déplacement devrait être visible dans la vue **Input View**. Sinon, double cliquer sur le node `position` pour l'activer.

<center>
  <img class="img-fluid" src="/static/img/posts/natron/node_resize.jpg" alt="vue du redimensionnement de l'image source">
  <div><b>Redimensionner l'objet pour qu'il ne dépasse pas du triangle noir.</b></div>
</center>

La vue **Viewer2** met en évidence le cache d'image. Votre vidéo doit entrer entièrement dans la partie noire. N'hésitez pas à avancer dans la vidéo pour vérifier que l'objet ne dépasse pas du cadre tout au long de l'animation.

**Note** : La forme du cache sera différente d'un produit à l'autre: Un triangle pour un [Prism](/fr/products/prism) ou un [Pixel](/fr/products/pixel) ; un rectangle pour un [Iris](/fr/products/iris75) ou encore un losange pour le [Focus](/fr/products/focus).

<div class="row">
  <div class="col-xl-6 col-lg-12"><center>
    <img class="img-fluid" src="/static/img/posts/natron/move_transform.png" alt="natron previsualisation déplacer les transformations">
    <div><b>cliquer au centre de la croix pour déplacer, ou sur le cercle pour redimensionner</b></div>
  </center></div>
  <div class="col-xl-6 col-lg-12"><center>
    <img class="img-fluid" src="/static/img/posts/natron/transform_properties.png" alt="propriétés d'une transformation">
    <div><b>utiliser la fonction translate X, Y pour déplacer l'objet, ou Scale pour le redimensionner</b></div>
  </center></div>
</div>

Une fois que le placement est satisfaisant, on peut voir le résultat final avant export en double-cliquant sur **Output View**.

### Exporter l'hologramme

<div class="row">
  <div class="col-md-6" style="text-align:justify">
  <p>
    Il ne reste plus qu'à exporter une vidéo holographique. Dans la zone <b>Properties</b>, trouver l'élement <b>WritePNG</b>, ou <b>WriteVideo</b> et cliquer sur le bouton <b>Render</b>.
  </p>
  <ul>
    <li>
      <b>WritePNG</b> crée une séquence d'images numérotées frame-<1-xxx>.png qu'il suffira ensuite d'encoder avec n'importe quel logiciel de montage vidéo. C'est la façon la plus flexible d'exporter votre travail.
    </li>
    <li>
        <b>WriteVideo</b> Va directement encoder pour vous la vidéo. Les codecs inclus dans Natron sont parfois instables, il est plus sûr d'utiliser un logiciel tiers pour réaliser l'encodage.
      </li>
  </ul>
  <p>
    En résumé, WritePNG est préférable, sauf si vous n'avez pas accès à un utilitaire permettant d'assembler la séquence d'images.
  </p>
  </div>
  <div class="col-md-6">
      <img class="img-fluid" src="/static/img/posts/natron/render_node.png" alt="Propriétés d'un render node">
      <center><div><b>Les propriétés du "render node"</b></div></center>
  </div>
</div>

<p>
  Le rendu peut prendre plusieurs minutes par minute de vidéo à encoder, selon la puissance de l'ordinateur utilisé.<br>
  Vous pourrez ensuite <a href="/dev/fr/toolbox/packaging">transférer</a> la vidéo sur votre produit.
</p>
<center>
  <a class="button" href="/dev/fr/toolbox/packaging">Guide du transfert de médias</a>
</center>
