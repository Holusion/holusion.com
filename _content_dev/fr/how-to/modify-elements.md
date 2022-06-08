---
title: Modifier la playlist
abstract: Utilisez l'API Holusion pour contrôler votre produit
---

Nous allons voir dans cet exemple la route `PUT /playlist`, qui permet de modifier **toutes** les propriétés des éléments de playlist. Elle est donc très importante et sera utilisée dans la plupart des applications.

Les commandes de ce tutoriel seront réalisées avec [curl](https://curl.haxx.se/).

# Exemple

    PUT /playlist {"query":{"name":"<ELEMENT_A_MODIFIER>"},"modifier":{"$set":{"active": false }}}

Va modifier l'élément concerné pour le désactiver. On peut utiliser la négation pour inverser la commande :

    PUT /playlist {"query":{"$not":{"name":"<ELEMENT_A_MODIFIER>"}},"modifier":{"$set":{"active": false }}}

Va désactiver tous les éléments ne s'appelant pas comme le nom donné.
