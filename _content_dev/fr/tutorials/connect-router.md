---
title: Connexion avec un nano-routeur
image: img/documentation/nano_router.jpg

abstract: Connectez-vous à votre produit en utilisant un nano-routeur TP Link
rank: 2
---


Ce guide vous permettra de connecter un nano-routeur **TP-LINK TL-WR802N** à votre produit. Ces routeurs compacts sont proposés en option et peuvent être achetés séparément. Si vous ne disposez pas d'un routeur portable, vous pouvez utiliser la méthode de [connexion directe](connect-direct-windows).

## Matériel nécessaire :

- Routeur
- mini câble ethernet
- câble micro-USB
- Chargeur USB 5V

L'ensemble du matériel devrait être présent dans la boite du [nano-router](/fr/store/router).

## Installation

Brancher le routeur. Connecter les câble ethernet et USB à votre produit.

## Configuration - Première utilisation

<div class="row">
  <div class="col-12 col-md-6">
    <code>Pour le modèle TL-WR802N</code>
    <p>Se connecter au wifi en utilisant le SSID/Password noté au dos du routeur.</p>
    <p>La connexion sera généralement marquée comme limitée.</p>
  </div>
  <div class="col-12 col-md-6">
    <img class="img-fluid" src="/static/img/documentation/how-to/router_back.jpg" alt="dos d'un routeur TP-Link">
  </div>
</div>

<div class="row">
  <div class="col-12 col-md-6">
    <p>Puis ouvrir un navigateur et se rendre sur <a href="http://tplinkwifi.net">http://tplinkwifi.net</a> ou si ça ne fonctionne pas, <a href="http://192.168.0.1">http://192.168.0.1</a>.</p>
    <p>
      Entrer les identifiants : 
      <pre><code>
      Username : admin
      Password : admin
      </code></pre>
    </p>
  </div>
  <div class="col-12 col-md-6">
    <img class="img-fluid" src="/static/img/documentation/how-to/tp-link_1.jpg" alt="intereface d'administration du routeur">
  </div>
</div>

Dans l'onglet **Operation Mode**, sélectionner **Access Point**, puis **Save**. Confirmer le redémarrage du routeur.


## Utilisation

Une fois branché, le produit est directement accessible.

Sur osX, il est disponible via son "hostname" sur safari à l'adresse : `http://holobox-xx.local`. Remplacer **holobox-xx par le nom du produit.

Si on a besoin de son IP, 2 solutions :

Dans l'interface du routeur (http://tplinkwifi.net ou http://192.168.0.1), s'authentifier avec `admin/admin`, sur **DHCP > DHCP Clients List**, récupérer l'IP du produit.

<center>
    <img class="img-fluid" src="/static/img/documentation/how-to/tp-link_2.jpg" alt="intereface d'administration du routeur"/>
</center>

Ou utiliser un scanner réseau comme `nmap`, ou un scanner mdns comme avahi.


## Aller plus loin

- Assigner une IP statique à votre produit
- Transférer [une vidéo](/dev/fr/tutorials/media-transfer)