---
title: Premiers pas
image: img/products/iris22_blanc.jpg
abstract: Création de votre premier hologramme
rank: 1
---

# Création de votre premier hologramme

En réalisant ce tutoriel, vous apprendrez à réaliser une vidéo prête à être diffusée en hologramme en utilisant le logiciel libre [Blender](https://www.blender.org).

Ce tutoriel suppose que vous connaissiez les bases du logiciel : Fondamentaux, navigation, interface. Les 3 premières vidéos des [tutoriels officiels](https://www.youtube.com/playlist?list=PLa1F2ddGya_-UvuAqHAksYnB0qL9yWDO6) abordent ces points (en anglais).



## Préparation

Assurez-vous d'avoir installé au minimum la version [2.83](https://www.blender.org/download/releases/2-83/) de **Blender**.

Télécharger notre fichier 3D d'exemple []()

## Intro

Bienvenue dans ce tutoriel qui vous guidera dans la réalisation d'une vidéo holographique avec blender. 

J'ai pour le moment simplement ouvert la scène de départ de Blender. On voit une caméra, une lumière et un cube blanc.

Pour commencer, je sélectionne le cube et j'appuie sur `suppr` pour le retirer.


## Modèle

On va insérer dans la scène un modèle préfabriqué.

Je vais sur `add` en haut, puis `mesh` et `Monkey`.

Blender crée un modèle d'exemple, qui est pour le moment très simple. On va le lisser un peut.

Normalement le modèle est déjà séléctionné. On voit son contour orange.

Je fais un clic droit sur le modèle et je sélectionne **shade smooth**. Les angles entre les faces sont plus lisses, mais le modèle reste très primitif.

Dans l'onglet **Modifier properties** je clique sur **add modifier**, puis je sélectionne **subdivision**. Je peux régler la quantité de divisions que je souhaite.

## Apparence

On a donc un modèle dans notre scène 3D, mais qui est pour l'instant tout blanc.

Je vais lui assigner une apparence. Pour cela, on va dans l'onglet `Material Properties`, on clique sur `New`. Puis je change sa couleur de base. 

Pour le moment son apparence ne change pas dans l'éditeur. Pour voir sa couleur il faut modifier l'affichage en `Rendered`, avec cette icone en haut à droite.

L'apparence du modèle reflète maintenant en temps réel les paramètres du shader.

On peut utiliser la touche `0` du pavé numérique pour visualiser le cadrage de la caméra

## Animation

Pour le moment le modèle est immobile. Si j'appuie sur `Espace` pour lancer l'animation.

Je vais me replacer à la première image de la séquence. avec `Shift+Left`, ou en cliquant sur ce bouton

Puis j'ouvre l'onglet de `transform` en cliquant sur cette icone ou avec le racourci `n`, en ayant toujours la tête de singe selectionnée : on voit qu'elle est entourée en orange.

Je clique droit sur la **Rotation:Z** et `insert keyframes`

Puis je vais déplacer la ligne de temps à la fin de l'animation sur l'image 250, changer la valeur de **Rotation:Z**, mettre 720° et à nouveau, clic droit et `insert keyframes`.

Maintenant, si je retourne au début et que je joue l'animation, on voit que la tête fait deux tours sur elle-même.

## Rendu

Pour rendre cette scène dans une vidéo adaptée à un projecteur d'hologrammes, je vais aller dans **render properties**.

Pour ce rendu on utilisera le nouveau moteur **Eevee**.

Dans l'onglet film, je coche **transparent**.

Puis dans **Output properties**, je vais régler mon format d'export. Je choisis mon dossier cible, puis en **File format**, je sélectionne **FFmpeg Video**. 

Puis Render -> Render animation ou `ctrl+F12`

Le rendu de l'animation peut prendre 1 à 10 minutes selon la puissance de votre ordinateur.

## Conclusion

Une fois le rendu terminé,je peux ouvrir la vidéo. 

On a simplement fait une vue orbitale du modèle d'exemple de blender. Pour aller plus loin, on pourra par exemple importer des modèles depuis d'autres logiciels ou travailler l'éclairage et les textures pour obtenir une vidéo photo-réaliste.

## Aller plus loin

- [connectez-vous à votre produit](connect-router)
- [transférez une vidéo](media-transfer)