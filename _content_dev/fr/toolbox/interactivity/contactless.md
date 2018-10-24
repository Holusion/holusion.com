---
title: "Contrôle Sans Contact"
redirect_from: "/fr/contactless-control/"
image: /build/img/posts/banner_contactless.jpg
image2x: /build/img/posts/banner_contactless_2x.jpg
abstract: Ajoutez la puissance des technologies sans contact à votre produit
rank: 2
menu: toolbox
---

## Introduction

Les technologies sans contact **NFC/RFID** sont intégrées dans nos produits sous deux formes :

- Accès libre, via les drivers [pcsclite](https://pcsclite.alioth.debian.org/ccid.html).
- Managée, via l'administration des produits.

Ce service permet de contrôler la playlist de votre produit à l'aide de tags NFC très simplement.

Holusion conseille l'utilisation de capteurs certifiés [compatibles CCID](https://pcsclite.alioth.debian.org/ccid.html#readers).

## Contrôle via NFC

Contrôler votre produit via un capteur sans contact prend quelques secondes.

**Préparation :**

- Connectez-vous à l'interface d'administration de ce dernier.
- Branchez un lecteur NFC supporté à votre produit via l'USB de facade.

**Utilisation :**

En positionnant une carte à portée du capteur, l'interface d'administration affichera le numéro d'identifiant de celle-ci (Onglet *options*).

<center><img class="img-fluid" alt="holusion contactless tag recognition" src="/static/img/posts/contactless/card_id.gif"/></center>

Copier cet identifiant. Il faut ensuite l'ajouter à la configuration de votre média cible. Pour ce faire, cliquer sur l'icone <span class="glyphicon glyphicon-plus"></span> associée.

<center><img class="img-fluid" alt="holusion contactless tag recognition" src="/static/img/posts/contactless/remote_config.jpg"/></center>

*Note : "nfc" doit impérativement être noté en lettres minuscules. N'oubliez pas de cliquer sur l'icone <span class="glyphicon glyphicon-floppy-saved"></span> pour enregistrer les modifications.*

**Fonctionnement**

Quand une carte est positionnée sur le capteur :

* les vidéos qui correspondent au tag détecté sont activées
* Toutes les autres vidéos sont désactivées

Quand aucune carte n'est positionnée :

* Les vidéos ne disposant d'aucun tag sont activées
* Les vidéos associées à un tag NFC sont désactivées

Pour faire cesser le suivi, supprimer la ligne de configuration avec l'icone <span class="glyphicon glyphicon-minus"></span>, puis sauvegarder les changements.
