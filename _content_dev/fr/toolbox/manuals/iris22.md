---
title: Manuel Iris 22
abstract: Guide d'utilisation du produits "Iris 22" d'Holusion
image: /static/img/posts/iris/iris22.jpg
rank: 5
menu: toolbox

---

<section class="section section-main-header header-fill" style="max-width: 1920px">

  {%include components/header_image.html image="img/products/Iris22_exemple.jpg" %}
  <div class="main-header-body body-right">
    <div class="content shadow rounded bg-white rounded p-4 text-justify">
      <h2> Contenu de la livraison </h2>
      <p> </p>
      <p> - Iris 22” assemblé avec sa vitre et prêt à fonctionner </p>
      <p> - 1 alimentation à brancher sur une prise secteur  </p>

    </div>
  </div>
</section>


<section id="section-gamme" class="section-tile">
  <div class="tile-image-wrapper">
    {% include components/header_image.html image="img/products/Precautions.jpg" style="padding-top: 40px"%}
  </div>
  <div class="tile-body tile-body--main">
    <h2>Précautions d'usage</h2>
    <p>
    Pour tout déplacement de l’Iris, veuillez le ranger dans le carton fourni, emballé comme à la réception.

    Ne soulevez en aucun cas l’Iris par la dalle du dessus en attrapant l’écran, au risque de casser celui-ci. En revanche, le porter par les parties métalliques ne pose pas de problème.
    </p>
   <p>
    Avant de nettoyer l’Iris, le mettre hors tension pour éviter un choc électrique. Pour la vitre, utilisez un produit lave-vitre classique, ainsi qu’une serviette microfibre afin d’éviter les griffes. Avec ce matériel, vous pouvez de même nettoyer l’ensemble de la structure.
Ne pas placer l’Iris dans un environnement humide, à des températures inférieures à 0°C et supérieures à 45°C. Ne pas mettre en contact de l’eau.
   </p>
  </div>
</section>


<section class="section section-main-header  header-fill py-4">
  {%include components/header_image.html image="img/products/iris32_archeo.jpg" alt="L'Iris22 présentant un objet archéologique 3D" %}
  <div class="main-header-body container">
    <div class="content shadow rounded bg-white p-4">
      <h2 class="text-center">Mise en route de l’Iris 22</h2>
      <div class="row">
        <div class="col-12 col-md-6" valign=middle>
          <p>
          Sortir l’Iris de sa caisse (sur la vidéo, il s'agit de l’Iris 32, mais l’installation est la même) en le soulevant par les parties métalliques.
          Installez-le sur un plan horizontal à environ 1.30 mètres du sol pour que centre de la vitre soit à hauteur des yeux.
         </p>
        </div>
        <div class="col">
          {% include components/medias/youtube.html  embed="9fYR-hXUyHc" %}
        </div>
      </div>
    </div>
  </div>
</section>




Installez l'**Iris** sur un plan horizontal à environ 1.70 mètres du sol. L'écran doit être à hauteur des yeux.

Branchez l’alimentation fournie d’un côté dans le port prévu à cet effet à l’arrière de l'**Iris**, et de l’autre sur une prise secteur.

Démarrez l'**Iris** grâce au bouton d’allumage à l’arrière ou en le branchant electriquement le cas échant, et attendez la fin du chargement.
Pour arrêter l'**Iris**, appuyez sur le même bouton ou en le débranchant le cas échant.


<center>

{%asset img/products/mesures/Iris22.png
  srcset:width="1920"
  srcset:width="960"
  class="img-fluid"
  sizes="(min-width: 1200px) 1200px, 100vw"
  style="padding-top: 40px; padding-bottom: 10px;"
  alt="Schema des dimensions de l'iris 22 pouces"
%}

</center>

## Gestion de l'hologramme depuis un ordinateur

### Connexion sur le réseau local

Connectez vous sur votre réseau local à l'aide d’un câble Ethernet, ou directement à votre ordinateur grace à un adaptateur Ethernet/usb.

Rendez-vous sur :	 <a href="https://github.com/Holusion/stargazer">ce lien</a> et téléchargez le logiciel « *Stargazer* » en vous confortant à la notice d’utilisation.
*Stargazer* est un logiciel libre d’accès développé par Holusion pour permettre le partage de contenu vers nos produits.

### Mise en réseau

Une fois *Stargazer* installé, lancez l’application. Il vous est proposé soit de lancer une vidéo déjà présente, soit d’apporter du contenu vidéographique de votre conception. Le manuel d’utilisation de *Stargazer* se trouve sur le même lien que l’installation.

Une fois la vidéo lancée sur *Stargazer*, votre hologramme fonctionne sur l'**Iris**.

## Création d'un hologramme

### Format vidéo holographiques

L’hologramme de l'**Iris** se présente comme une vidéo HD en mp4. Sa résolution graphique doit être de 1920x1080.
Pour plus d’informations, rendez vous sur <a href="/dev/fr/content/">cette page</a>.

### Création de contenu

Pour obtenir un hologramme le plus optimal possible, nous avons compilé nos conseils dans <a href="https://www.youtube.com/watch?v=l-0kverv6OA">cette vidéo</a>.

Il vous est possible de créer du contenu de différentes manières. Les deux principales sont :

- **Le tournage fond noir** :
Afin de modéliser rapidement un objet ou une personne, l’une des techniques est le tournage fond noir.
Pour en savoir plus, rendez vous sur <a href="/dev/fr/content/recording/index">ce lien</a>.

- **L'infographie 3D** :
Pour réaliser des dessins 3D, nous utilisons le logiciel libre Blender. Il vous permettra de créer des objets, animations, effets visuels, etc.
Pour plus de détails, visitez <a href="/dev/fr/content/blender/index">cette page</a>.

<center>
<img class="img-fluid" src="/static/img/posts/iris/Infographie.jpg" alt="Passer d'un objet à un hologramme">
</center>


### Adaptation et montage d'une vidéo

Afin d’adapter votre vidéo en contenu pour le **Iris**, partez de votre objet 3D. Il n'y a même pas besoin de Template afin de transformer votre vidéo en hologramme.

Pour transformer votre vidéo en contenu adapté, un petit processus de conception est nécessaire. Il faut que celui-ci soit sur fond noir et soit en miroir.



- Pour <a href="/dev/fr/content/after_effect/index">After Effect</a> : Logiciel de montage de la suite Adobe.
- Pour <a href="/dev/fr/content/natron/index">Natron</a> : Logiciel de montage open source.
- Pour <a href="/dev/fr/content/blender/index">Blender</a> : Logiciel d’infographie 3D open source.



## Déplacement, manipulation, nettoyage

Pour tout déplacement de l'**Iris**, veuillez le ranger dans la caisse en bois fournie, emballé comme à la réception.

Ne soulevez en aucun cas l'**Iris** par la dalle du dessus en attrapant l’écran, au risque de casser celui-ci. En revanche, le transporter par la dalle du dessous ne comporte pas de risque.

Avant de nettoyer l'**Iris**, le mettre hors tension pour éviter un choc électrique. Pour la pyramide en verre, utilisez un produit lave-vitre classique, ainsi qu’une serviette microfibre afin d’éviter les griffes. Avec ce matériel, vous pouvez de même nettoyer l’ensemble de la structure.

Ne pas placer l'**Iris** dans un environnement humide, à des températures inférieures à 0°C et supérieures à 45°C. Ne pas mettre en contact de l’eau.
