---
title: Redirection Pixel
image: /build/img/posts/dns_redirect/header.jpg
image2x: /build/img/posts/dns_redirect/header_2x.jpg
abstract: Utilisez votre nom de domaine pour démarrer la playlist d'hologrammes Pixel
rank: 2
menu: toolbox
---

## Introduction

Il est possible de faire pointer un domaine personnalisé vers une playlist holographique. Dans cet exemple, nous allons faire en sorte que les visiteurs se rendant sur `pixel.example.com` voient apparaître la playlist *holusion*, qu'on peut normalement découvrir sur `pixel.holusion.com/holusion/view`.

<div class="row">
  <div class="col-md-3 offset-md-3 col-sm-6">
    <img class="img-fluid" src="/static/img/posts/dns_redirect/redirect_holusion.png" alt="URL originale avant redirection">
    <p align="center">Avant redirection</p>
  </div>
  <div class="col-md-3 col-sm-6">
    <img class="img-fluid" src="/static/img/posts/dns_redirect/redirect_example.png" alt="URL de lap age après redirection">
    <p align="center">Après redirection</p>
  </div>
</div>

## Redirection invisible

La mise en place d'une redirection invisible **CNAME** nécessite une opération simple sur la "*zone DNS*" du propriétaire du domaine.


Tous les comptes clients ont accès à une redirection gratuite : `votre-compte.pixel.holusion.com` redirige automatiquement vers votre liste de lecture.

Par exemple, `holusion.pixel.holusion.com` donne accès à la playlist du compte `holusion`. C'est vers ce domaine que nous allons rediriger les utilisateurs.

### Configuration de la zone DNS

*Si vous n'avez pas accès à votre zone DNS, contactez votre administrateur réseau.*

**Attention :** manipuler vos noms de domaines peut rendre votre site web inaccessible. N'hésitez pas à demander conseil en cas de doute.


<div class="row">  
  <div class="col-md-6">
    <img class="img-fluid" alt="dns zone add entry" src="/static/img/posts/dns_redirect/dns_zone.png">
  </div>
  <div class="col-md-6">
    <p>Il faut mettre en place une redirection <b>CNAME</b> depuis votre domaine vers <code>holusion.pixel.holusion.com</code>.
    </p>
    <p>Rendez-vous sur la page de configuration du DNS de votre hébergeur (exemple: OVH). Cliquez sur "Add an entry".</p>
  </div>
</div>

<div class="row">  
  <div class="col-md-6">
    <p>L'entrée de type <b>CNAME</b> doit pointer depuis votre sous domaine choisi vers <code>holusion.pixel.holusion.com.</code></p>
    <p><b>Attention : </b>Le CNAME doit se terminer par un "<code>.</code>", sinon il pointera vers <code>pixel.holusion.com.example.com</code></p>
    <p> Pour les autres hébergeurs, vous devriez obtenir ce résultat :</p>
    <code>pixel IN CNAME holusion.pixel.holusion.com.</code>

    <p> Validez la nouvelle entrée qui devrait apparaître dans votre liste de redirections</p>
    <p>La propagation peut prendre jusqu'à 24h pour être effective. Vous pouvez vérifier son état à l'aide d'un outil de débogage de DNS tel que <a href="https://fr.wikipedia.org/wiki/Dig_(programme_informatique)">dig</a>.</p>
  </div>
  <div class="col-md-6">
    <img class="img-fluid" alt="dns zone edit CNAME" src="/static/img/posts/dns_redirect/dns_create.png">
  </div>
</div>

<p>Exemple :</p>
{% highlight shell%}
$ dig pixel.example.com
{% endhighlight %}
{% highlight shell%}
;; ANSWER SECTION:
pixel.example.com. 3600 IN	CNAME	holusion.pixel.holusion.com.
pixel.holusion.com.	86400	IN	A	40.68.84.46
{% endhighlight %}
