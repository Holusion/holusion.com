---
title: Natron
image: /build/img/posts/banner_natron.jpg
image2x: /build/img/posts/banner_natron_2x.jpg
abstract: Création de vidéos holographiques en utilisant le logiciel de création gratuit "Natron"
menu: content
rank: 5
---

Natron est un logiciel libre de création et composition de vidéo extrêmement performant et sous licence libre. Il peut être utilisé sur MacOSX, Windows et Linux.

On peut l'utiliser pour créer facilement et rapidement des vidéos en hologrammes.

## Installation

1. Suivre les instructions d'installation pour [Windows, MacOSX et Linux](http://natron.fr/download/).
2. Télécharger le projet de base pour [prism](/static/files/natron_prism.zip) ou [focus](/static/files/natron_focus.zip)

Ouvrir le projet téléchargé.

<center>
  <img class="img-responsive" src="/static/img/posts/natron/natron_open.jpg" alt="natron openning screen">
  <span><b>Projet "Prism" à l'ouverture</b></span>
</center>

## Utilisation

### Aperçu

Le projet fourni contiens un certain nombre de transformations (en orange) et de masques (en Bleu) configurés pour produire l'hologramme final. Il a été configuré avec des paramètres par défaut permettant de réaliser un hologramme sans aucune connaissance des techniques de montage vidéo.

Les éléments principaux visibles dans la partie "Node Graph" qui seront utilisés :

- **Viewer3** : Aperçu intermédiaire permettant de positionner la vidéo source
- **Viewer1** : Aperçu du résultat final
- **Position** : Réglage de taille et position de la vidéo source.

### importer une vidéo
La première étape est d'importer votre vidéo source. Il faut créer un novueau *Node* dans la partie "Node graph" du logiciel. Soit simplement par un glisser-déposer de la vidéo dans cette zone.

<center>
  <img class="img-responsive" src="/static/img/posts/natron/natron_node_graph.png" alt="Le Node graph">
  <span><b>la zone "Node Graph"</b></span>
</center>

vous pouvez aussi faire un clic droit dans cette zone, choisir **Reader** dans la section **image** (Raccourci : *R*), ou encore utiliser le raccourci par défaut **R**.

Cela devrait créer un "Reader node". Il faut ensuite le relier au node "Position", qui permettra de configurer la vidéo.

<center>
  <img class="img-responsive" src="/static/img/posts/natron/node_linking.gif" alt="reader node">
  <span><b>Créer un lien entre 2 nodes</b></span>
</center>

### Optimiser le rendu

Quelques réglages sont nécessaires pour obtenir un résultat optimal. Ceux-ci seront faits sur les **transform Nodes**. de la scène. Soit manuellement dans la prévisualisation, soit pour plus de précision dans l'outil de configuration de ces "Nodes".

Activer le Noeud **Transform** en double cliquant dessus. Une icône de redimensionnement et déplacement devrait apparaitre dans la vue **Viewer2**.

<center>
  <img class="img-responsive" src="/static/img/posts/natron/node_resize.jpg" alt="resize a node">
  <span><b>Redimensionner l'objet pour qu'il ne dépasse pas du triangle noir.</b></span>
</center>

La vue **Viewer2** pour met en évidence le cache d'image. Votre vidéo doit entrer entièrement dans la partie noire. N'hésitez pas à avancer dans la vidéo pour vérifier que l'objet ne dépasse pas du cadre tout au long de l'animation.

<div class="row">
  <div class="col-md-6"><center>
    <img class="img-responsive" src="/static/img/posts/natron/move_transform.png" alt="natron previsualisation déplacer les transformations">
    <span><b>cliquer au centre de la croix pour déplacer, ou sur le cercle pour redimensionner</b></span>
  </center></div>
  <div class="col-md-6"><center>
    <img class="img-responsive" src="/static/img/posts/natron/transform_properties.png" alt="propriétés d'une transformation">
    <span><b>utiliser la fonction translate X, Y pour déplacer l'objet, ou Scale pour le redimensionner</b></span>
  </center></div>
</div>

Une fois que le placement est satisfaisant, on peut voir le résultat final avant export en double-cliquant sur **Viewer1**.

### Exporter l'hologramme

<div class="row">
  <div class="col-md-6" style="text-align:justify">
  <p>
    Il ne reste plus qu'à exporter une vidéo holographique. Dans la zone <b>Properties</b>, trouver l'élement <b>WritePNG</b>, ou <b>WriteVideo</b> et cliquer sur le bouton <b>Render</b>.
  </p>
  <ul>
    <li>
      <b>WritePNG</b> crée une séquence d'images numérotées frame-<1-500>.png qu'il suffira ensuite d'encoder avec n'importe quel logiciel de montage vidéo. C'est la façon la plus flexible d'exporter votre travail
    </li>
    <li>
        <b>WriteVideo</b> Va directement encoder pour vous la vidéo. Les codecs inclus dans Natron sont parfois instables, il est plus sûr d'utiliser un logiciel tiers pour réaliser l'encodage.
      </li>
  </ul>
  <p> En résumé, WritePNG est préférable, sauf si vous n'avez pas accès à un utilitaire permettant d'assembler la séquence d'images.
  <p>
    Le rendu peut prendre jusqu'à 10 minutes par minute de vidéo à encoder, selon la puissance de l'ordinateur utilisé.<br>
    Vous pourrez ensuite <a href="/fr/toolbox/packaging">transférer</a> la vidéo sur votre produit.
  </p>
  <center><a class="button" href="/fr/toolbox/packaging">Guide du transfert de médias</a></center>
  </div>
  <div class="col-md-6">
      <img class="img-responsive" src="/static/img/posts/natron/render_node.png" alt="render node properties"></img>
      <center><span><b>Les propriétés du "render node"</b></span></center>
  </div>
</div>
