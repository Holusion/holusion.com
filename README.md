# Introduction

Developper website for holusion. Access at : http://dev.holusion.com

##USAGE

#### Fonctionnement

cette documentation est exportée via [github-pages](https://pages.github.com/) sur [dev.holusion.com](http://dev.holusion.com) en utilisant le moteur de génération de sites [jekyll](http://jekyllrb.com/)
Elle est séparée en deux catégories majeures :

- Anglais (répertoire ```_content_main/en```)
- Français (répertoire ```_content_main/fr```)

Chacune de ces catégories contient les différentes parties du site.

#### Installation :

**clone things & play around**

    git clone git@github.com:holusion/holusion.github.io
    rvm info
    #should output : jekyll@ruby-2.2.1
    gem install bundler
    bundle install

Install [jekyll](http://jekyllrb.com/docs/installation/).

#### Lancement :

**Pour voir en temps réel les changements**

    bundle exec jekyll serve

### Mise à jour

Les dépendances statiques sont gérées par bower. nodejs est requis pour les mettre à jour.

    npm install

On peut les trouver dans le répertoire ```vendor/```:

- components-bootstrap (css/grid system)
- jquery (requis par bootstrap)

Pour en éditer la version : modifier le fichier [bower.json](./bower.json)

## Organisation

### Structure

Le site possède une structure classique imposée par Jekyll.

#### Répertoires

- **_css** :
  -[scss](http://sass-lang.com/guide) files. Named by functions. Most important files :
	- \_colors.scss : define color variables
	- \_titles.scss : titlers styles
	- etc...
- **_data** :
  - strings.yml : Les chaines de caractères du site à traduire. ```Exemple : lang.fr = "Langue", et lang.en = "Language"```
- **_drafts** : pas utilisé pour le moment.
- **_site_dev** : Le site de développement
- **_site_main** : Le site principal
- **stingray** : Le site vitrine de stingray (temporaire)
- **_includes** : Morceaux de pages repris à travers le site. ```Exemples : navbar.html, header.html```
  - components : reproductible parts of a page (feedback button, page thumbnail...)
  - utils : utility function. does not output html, but make some computation (iterate over a section's list of pages)
- **_layouts** : Templates de mise en page.
- **src** : Sources utilisées pour les images / vidéos du site. Non exportées par jekyll.
- **static** : Contenu statique, qui sera exporté tel quel par Jekyll.
  - img : Images du site
  - js : javascript (recherche, etc...)
  - files : Ressources téléchargeables
- **vendor** : ressources exportées par [bower](bower.io). Ne pas modifier. Voir *bower.json*.
-  **src** : fichiers sources, qui seront modifiés par `build.sh` et construits dans `/build`.

#### Fichiers  

- **_config.yml** : Options de configuration.
- **.gitignore** : Fichiers à ignorer par [git](https://git-scm.com/). ```Exemple : Fichiers temporaires```
- **bower.json** : Dépendances à ajouter au projet. Elles seront exportées dans le dossier *vendor/*.

### Comment écrire

#### Entêtes

Chaque article doit commencer par un entête YAML du type :

    ---
    title: <titre du projet>
    image: <chemin vers l'image du projet, relatif à /static/img/posts/>
    abstract: <abstract de ~100 caractères>
    menu: <true si l'on souhaite un lien sur la page d'acceuil>
    ---
L'article sera placé dans \_fr ou \_en selon sa langue. On peut créer autant de sous dossiers que nécessaire dans ces catégories, cela n'a pas d'importance.



##### titre (*title*)

Très important : affiché en tête de page dans le Header.

##### langue (*lang*)

L'attribut "lang" définit la langue du document. Il est automatiquement défini pour tous les fichiers dans les dossiers **_fr** et **_en**.

##### image (*image*)

image Header en 800x450px.

    image: /build/img/posts/banner.jpg

Il est conseillé d'utiliser le dossier `build` ([documenté](#optimisations)), qui fournira `image` et `image2x`, avec une image de base (*.xcf* ou *.psd*) en 800x450.

##### résumé (*abstract*)

Court résumé de la page présent dans les thumbnails et dans la *méta description* de la page.

##### menu (*menu*)

valeurs possibles : content, toolbox, platform.

Indique la section du menu ou intégrer la page. Si cet élément est omis, la page sera inaccessible via le menu mais tout de même publiée sur ```/<lang>/<title>/```.

##### tags

Les tags disponibles sont :

- Secteur d'activité
  - museographie
  - commerce
  - formation
  - evenementiel
- Produits
  - prism
  - focus
  - iris
  - pixel
  - custom
- Usages
  - A définir

#### Liens internes

L'article sera accessible à l'URL:

    http://dev.holusion.com/<langue>/<chemin_interne>
    # En mode développement :
    http://localhost:4000/<langue>/<chemin_interne>

Il sera modifié automatiquement, avec les majuscules transformées en minuscules et les espaces en "-".

Par exemple, `_fr/content/after_effect/index.html` sera accessible via : `/fr/content/after_effect`

Pour réaliser des liens internes, utiliser la notation absolue :

    /<langue>/<chemin_interne>
Ou la notation relative :

    ../<chemin_interne>



#### Sous sections

Les articles peuvent être séparés en sous sections avec des titres 1.

    # je suis un titre 1 markdown
    <h1>je suis un titre 1 html</h1>

Les images sont placées dans ```static/posts/img```. Généralement dans un sous répertoire correspondant au sujet.

Les images qui doivent être traduites peuvent alternativement être placées dans ```_fr/img/```. Elles seront de ce fait accessibles par l'url:

    /{{page.lang}}/img/<image.jpg>

A utiliser uniquement pour des images génériques. Une image de même résolution au même nom doit pouvoir être trovuée dans ```_en/img```

## Optimisations

Le *build* optimise les fichiers vidéo et images trouvés dans `src/`. Le résultat est stocké dans le dossier `build/`.

Une image située dans `src/img/posts/` sera donc exportée dans `build/img/posts`

### Images

Pour le moment seul le format `.xcf` est correctement supporté. Les `.psd` (Photoshop) devraient être exportés mais la pixellisation des textes a des problèmes de qualité. Le script crée 4 images pour chaque source :

- image_2x.png : l'image initiale
- image.png : redimensionnée à 50%
- image_2x.jpg : en jpg compressé
- image.jpg : redimensionnée à 50%

### Vidéos

Les vidéos du dossier `src/videos` sont exportées aux formats web, en `.ovg`, `.webm` et `.mp4`. Il appartiens à l'utilisateur de fournir une résolution adaptée.

Pour utiliser la vidéo `src/videos/Home.mp4`, on peut écrire le code suivant :

```
<div align="center" class="embed-responsive embed-responsive-16by9">
  <video loop="" autoplay="" preload="">
    <source src="/build/videos/Home.mp4" type="video/mp4" />
    <source src="/build/videos/Home.ogv" type="video/ogg" />
    <object width="100%" type="application/x-shockwave-flash" data="http://www.youtube.com/v/YE7VzlLtp-4">
      <param name="movie" value="https://youtu.be/9ZTAnA0Dn7Y">
      <!-- fallback image -->
      <img class="img-responsive" src="/build/img/products/hpop_couloir.jpg" srcset="/build/img/products/hpop_couloir_2x.jpg 2x" alt="Holusion Main Page Video Poster" title="No video playback capabilities.">
    </object>
  </video>
</div>
```
Il est conseillé de toujours fournir un *fallback* youtube ou similaire.
De très bons exemples d'intégration vidéo sont disponibles sur [video for everybody](http://v4e.thewikies.com/).

## Composants

Les composants préfabriqués sont rangés dans `_includes`. On peut les utiliser de la manière suivante :

    {% include components/social_icon.html link="/link/to/icon" name="Service Name" %}

Inclura le contenu de `_includes/components/social_icon.html`. Les includes les plus courants sont documentés ci-après.

### post thumbnail

`{% include components/post_thumbnail.html title="title" abstract="Short description" }`

Réalise un thumbnail avec une image Si aucune image n'est fournie, utilisera `/static/img/posts/default.jpg`.

Les champs requis peuvent être fournis directement ou via la variable content (permet de faire un thumbnail d'une histoire en écrivant `content=post`).

```
image:image standard (800x450 ou 400x225).
image2x:image à utiliser sur les écrans haute résolution (800x450 conseillé).
title: titre de la page
abstract: description courte
```
