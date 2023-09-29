# Introduction

Site web pour **SAS Holusion** : https://holusion.com

Aussi utilisé pour publier un thème bootstrap personnalisé : [@holusion/theme](https://www.npmjs.com/package/@holusion/theme).

## DEVELOPPEMENT

voir le wiki [Wiki](https://github.com/Holusion/holusion.com/wiki).

Developpé avec [Jekyll](https://jekyllrb.com/). Les [issues](https://github.com/Holusion/holusion.com/issues) pour rapporter toute erreur.

## Deploiement

 > voir le workflow: [build.yml](blob/master/.github/workflows/build.yml)

Le site web est déployé à chaque `push` sur la branche master via [FirebaseExtended/action-hosting-deploy@v0](https://github.com/FirebaseExtended/action-hosting-deploy).

Le theme (`@holusion/theme`, réutilisé sur [content.holusion.com](https://content.holusion.com) par exemple) est déployé à chaque tag de type `v*.*.*` créé. Typiquement, comme la branche master est protégée, le workflow sera :

 - créer une feature branch
 - lancer `npm version x.x.x --no-git-tag-version`
 - push et merge la branche
 - Dans l'interface GitHub sur la branche master, créer un tag correspondant à la nouvelle version


## Utilisation du thème

 > les classes et fonctionnalités du thème holusion ne sont pour le moment pas documentées. Voir le code source pour plus d'informations.

Via webpack (utilisant [style-loader](https://webpack.js.org/loaders/style-loader/)):
```
  import "@holusion/theme"; //importe le thème CSS complet
```

Ou directement en HTML (via [unpkg](https://unpkg.com/)):
```
  <link rel="stylesheet" href="https://unpkg.com/@holusion/theme" />
```

Dans un souci de simplicité, bootstrap est rééxporté via le package `@holusion/theme`:

```
import '@holusion/theme/dist/bootstrap.min.js'
```
