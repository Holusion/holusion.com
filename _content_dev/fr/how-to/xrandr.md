---
title: Configuration de l'affichage
image: img/documentation/x11.png
abstract: Configurez l'affichage de votre produit avec l'extension RandR
rank: 2
---

# Configuration du serveur X

 > X.org est le serveur graphique utilisé par les systèmes linux pour fournir un gestionnaire de fenêtres

<div class="text-right"><a href="https://doc.ubuntu-fr.org/xorg">X.org</a></div>

L'utilitaire [xrandr](https://doc.ubuntu-fr.org/xrandr) utilise l'extension **RandR** de X.org afin de générer dynamiquement des paramètres d'écran comme la taille, la résolution ou l'orientation.

L'[API de contrôle](/dev/fr/references/control-api) fournit un accès simplifié à cette configuration. Son interface graphique dispose d'un éditeur permettant de sélectionner les paramètres de résolution et d'orientation souhaités.

Pour des cas plus spécifiques, on peut entrer une commande complète en "mode texte".

<img class="img-fluid" src="/static/img/how-to/XRandR_config.png" alt="entrée texte de configuration XRandR">

## Obtenir la configuration de l'affichage

On peut obtenir la configuration "brute" de l'affichage en se rendant à l'adresse: `http://<ip_du_produit>/system/screens`