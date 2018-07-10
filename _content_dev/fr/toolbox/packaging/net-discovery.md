---
title: trouver un produit holusion sur le réseau
image: /build/img/posts/banner_packaging.jpg
image2x: /build/img/posts/banner_packaging_2x.jpg
abstract: Localisez un produit holusion sur votre réseau
---

Une fois un produit **Holusion** branché à votre réseau local, il vous faut localiser son adresse.

On reconnait le produit par ses caractéristiques :

- Ports 22, 80, 300 ouverts
- Hostname : *<modèle>-<numéro>.holusion.net*

Le plus simple est d'utiliser l'interface de votre routeur (section **DHCP**) :

<center>
  <img class="img-fluid" src="/static/img/posts/packaging/dhcp_ip.png" alt="l'adresse IP du produit dans l'interface du routeur">
</center>

Une autre solution est de scanner le réseau avec une commande telle que **nmap** :
{% highlight text %}
nmap -p 3000 192.168.1.0/24
[...]
Nmap scan report for 192.168.1.41
Host is up (0.00086s latency).
PORT     STATE SERVICE
3000/tcp open  ppp
{% endhighlight %}

ici on scanne les membres du réseau ayant un port 3000 ouvert.

Reste ensuite à taper l'adresse du produit trouvé dans votre navigateur web :

<center>
  <img class="img-fluid" src="/static/img/posts/packaging/browser-URL.png" alt="taper l'IP dans la barre d'adresse du navigateur">
</center>

Vous pouvez maintenant utiliser l'interface d'administration de votre produit [normalement](index).
