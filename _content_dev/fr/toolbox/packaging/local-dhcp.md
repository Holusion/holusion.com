---
title: établir une connection filaire directe
image: /build/img/posts/banner_packaging.jpg
image2x: /build/img/posts/banner_packaging_2x.jpg
abstract: Connectez votre produit holusion à votre poste de travail
---

Il est possible de connecter directement votre produit holusion à votre poste de travail. Il faut pour cela l'équiper d'un serveur **DHCP** local.

## Méthode pour Windows

*Testé pour Windows 7 à Windows 10*

### Configurer OpenDHCPServer



Télécharger et installer [OpenDHCPServer](https://sourceforge.net/projects/dhcpserver/). Utiliser [l'installeur](https://sourceforge.net/projects/dhcpserver/files/Open%20DHCP%20Server%20%28Regular%29/OpenDHCPServerInstallerV1.65.exe/download) pour windows.
<div class="row">
  <div class="col-md-8 col-sm-6">
    <p><b>Note</b> : OpenDHCPServeur est un logiciel libre sous license <a href="https://www.gnu.org/licenses/old-licenses/gpl-2.0.fr.html">GNU-GPLv2</a>. Son utilisation est autorisée dans le cadre présenté par cet article.
    </p>
    <p>
    Notez le répertoire utilisé par l'installeur. Décocher l'option <code class="highlighter-rouge">lancer le programme : Install as a service</code> : Nous lancerons le serveur manuellement quand nécessaire</p>
  </div>
  <div class="col-md-4 col-sm-6">
    <img class="img-responsive" src="/static/img/posts/packaging/OpenDHCPServer_install.png" alt="capture d'écran de l'installation du serveur OpenDHCP">
  </div>
</div>


Une fois l'installation terminée, Ce dossier devrait contenir les fichiers suivants :
<center>
<img class="img-responsive" src="/static/img/posts/packaging/OpenDHCPServer_files.png" alt="capture d'écran des fichiers composant le serveur OpenDHCP">
</center>

Remplacer le fichier de configuration par défaut par [celui-ci](/static/files/OpenDHCPServer.ini). Les 2 paramètres importants sont :
{%highlight ini %}
[LISTEN_ON]
192.168.0.1

[RANGE_SET]
DHCPRange=192.168.0.2-192.168.0.20
{%endhighlight %}


**Utilisateur avancé** : Vous pouvez modifier la configuration pour mieux l'adapter à vos besoins. Par exemple, préciser l'interface à utiliser en cas de choix multiples.

### Configurer l'interface réseau

Brancher le câble Ethernet à votre ordinateur d'une part, à votre produit d'autre part.

Si votre ordinateur ne dispose pas de port éthernet, cette étape fonctionne sans problème avec un [adaptateur USB](https://www.amazon.fr/AmazonBasics-Adaptateur-vers-Gigabit-Ethernet/dp/B00M77HMU0).

Ouvrir les paramètres "connexion réseau" de votre ordinateur
<center>
<img class="img-responsive" src="/static/img/posts/packaging/ethernet_config.png" alt="la fenêtre de configuration des connexions réseaux">
</center>
**Note** : Selon les versions de Windows, le nom des menus pour y accéder change: "centre réseau et partage", "paramètres réseau", etc...

Faire un clic droit et éditer les propriétés de votre port Ethernet (sur l'image, **Ethernet2**).
<center>
<img class="img-responsive" src="/static/img/posts/packaging/ip_params.png" alt="la fenêtre de configuration des connexions réseaux">
<p>à gauche, les propriétés de l'interface. A droite, les propriétés "TCP/IPv4"</p>
</center>

Il faut modifier les propriétés de l'élément `Protocole Internet Version 4 (TCP/IPv4)`. Si votre interface est déjà configurée de façon particulière, notez les paramètres avant de les modifier pour pouvoir les retrouver ultérieurement.

Nous allons assigner une **IP Statique** avec les paramètres suivants :
{% highlight text %}
Adresse IP: 192.168.0.1
Masque de sous-réseau: 255.255.255.0
Passerelle par défaut : 192.168.0.1
{% endhighlight %}

Valider les modifications et quitter.

**Attention** : Si vous utilisez plusieurs adaptateurs USB-Ethernet différents, ils prendront parfois des numéros différents, obligeant à répéter la manipulation.

### Branchement

Une fois les étapes précédentes correctement réalisées, il suffit de double-cliquer sur le fichier de commande `RunStandAlone`. Il ouvrira une fenêtre de commande qui vous informera sur l'état du système :

<center>

<img class="img-responsive" src="/static/img/posts/packaging/OpenDHCPServer_run_success.png" alt="la fenêtre commande du serveur DHCP">
<p>"Listening On: 192.168.0.1" montre que l'interface réseau a bien été configurée.</p>
</center>

Il est important de bien noter l'ensemble des informations données dans cette fenêtre si la manipulation ne fonctionne pas : Elles permettront de comprendre la source du problème.

A cette étape, il faut généralement redémarrer le produit Holusion tout en laissant le câble Ethernet branché pour qu'il détecte le changement de réseau.

<center>
<img class="img-responsive" src="/static/img/posts/packaging/OpenDHCPServer_alloc.png" alt="Allocation d'une IP par le serveur DHCP">
<p>Une allocation d'IP réussie</p>
</center>

La liste des IP allouées est aussi disponible à l'adresse : [http://localhost:6789](http://localhost:6789)

Vous pouvez maintenant accéder [normalement](index) à votre produit à l'adresse [http://192.168.0.2](http://192.168.0.2)

### Désactivation

Vous remarquerez qu'une fois les manipulations effectuées, votre interface ne se connectera plus aux autres réseaux filaires. Pour désactiver le serveur DHCP et revenir à la normale, il suffit de retourner dans les paramètres de l'interface réseau et, dans les propriétés TCP/IPv4, cocher `Obtenir une adresse IP automatiquement`.
