---
title: Direct wired connection
image: img/posts/banner_packaging.jpg

abstract: How to connect your Holusion products via an internet cable
rank: 3
---

It is possible to connect directly to the product via an Ethernet cable. This requires equipping the latter with a local **DHCP** server.

# Direct connection with Windows

*Tested for Windows 7 and Windows 10*

## Configure the OpenDHCPServer

Download and install [OpenDHCPServer](https://sourceforge.net/projects/dhcpserver/). Use [this installer](https://sourceforge.net/projects/dhcpserver/files/Open%20DHCP%20Server%20%28Regular%29/OpenDHCPServerInstallerV1.65.exe/download) for Windows.
<div class="row">
  <div class="col-md-8 col-sm-6">
    <p><b>Note</b> : OpenDHCPServer is a software free of use under the license <a href="https://www.gnu.org/licenses/old-licenses/gpl-2.0.fr.html">GNU-GPLv2</a>. Its authorized for this usage.
    </p>
    <p>
    Note the directory used by the installer. Uncheck the option <code class="highlighter-rouge">launch the program: Install as a service</code> : We will launch the server manually when necessary.</p>
  </div>
  <div class="col-md-4 col-sm-6">
    <img class="img-fluid" src="/static/img/posts/packaging/OpenDHCPServer_install.png" alt="capture d'écran de l'installation du serveur OpenDHCP">
  </div>
</div>


Once the installation is complete, this file should contain the following documents :
<center>
<img class="img-fluid" src="/static/img/posts/packaging/OpenDHCPServer_files.png" alt="capture d'écran des fichiers composant le serveur OpenDHCP">
</center>

Replace the default configuration file (OpenDHCPServer.ini) with [this one](/static/files/OpenDHCPServer.ini).  The 2 important parameters are:
{%highlight ini %}
[LISTEN_ON]
192.168.0.1

[RANGE_SET]
DHCPRange=192.168.0.2-192.168.0.20
{%endhighlight %}


**Advanced User** : You can modify the configuration to better suit your needs. For example, specify the interface to use in case of multiple choices.

## Configure the interface of the network

Connect the Ethernet cable to the product on one side and to your computer on the other.

If your computer doesn’t have an Ethernet port, you can use a [USB adaptor](https://www.amazon.fr/AmazonBasics-Adaptateur-vers-Gigabit-Ethernet/dp/B00M77HMU0).

Open the settings of “connect network” on your computer.
<center>
<img class="img-fluid" src="/static/img/posts/packaging/ethernet_config.png" alt="la fenêtre de configuration des connexions réseaux">
</center>
**Note** : Depending on the version of Windows, the name of the menus to access it changes: “network and sharing center”, “network settings”, etc…

Right-click and edit the properties of your Ethernet port (on the image, **Ethernet2**).
<center>
<img class="img-fluid" src="/static/img/posts/packaging/ip_params.png" alt="la fenêtre de configuration des connexions réseaux">
<p>To the left we have the properties of the interface, to the right the properties “TCP/IPv4”.</p>
</center>

The properties of the `Internet Protocol Version 4 (TCP/IPv4)` element must be modified. If your interface is already configured in a particular way, note the parameters before modifying them so that you can find them later.

We will assign a **static IP** with the following parameters:

{% highlight text %}
Adresse IP: 192.168.0.1
Masque de sous-réseau: 255.255.255.0
Passerelle par défaut : 192.168.0.1
{% endhighlight %}

Validate the modifications and close the window.

**Warning** :  If you use several different USB-Ethernet adapters, they will sometimes take on different numbers, making it necessary to repeat the operation.

## Plugging

Once the previous steps are correctly done, just double-click on the RunStandAlone command file. It will open a command window that will inform you about the status of the system:

<center>

<img class="img-fluid" src="/static/img/posts/packaging/OpenDHCPServer_run_success.png" alt="la fenêtre commande du serveur DHCP">
<p>"Listening On: 192.168.0.1" shows that the network interface has been successfully configured.</p>
</center>

It is important to take note of all the information given in this window if the manipulation does not work, they will allow you to understand the source of the problem.

At this stage, it is generally necessary to restart the Holusion product while leaving the Ethernet cable connected so that it detects the network change.

<center>
<img class="img-fluid" src="/static/img/posts/packaging/OpenDHCPServer_alloc.png" alt="Allocation d'une IP par le serveur DHCP">
<p>A successful IP allocation :</p>
</center>

The list of allocated IPs is also available at: [http://localhost:6789](http://localhost:6789)

You can now access your product normally at [http://192.168.0.2](http://192.168.0.2)

## Deactivation

You will notice that once the manipulations have been carried out, your interface will no longer connect to other wired networks. To deactivate the DHCP server and return to normal, simply return to the network interface settings and, in the TCP/IPv4 properties, check `Obtain an IP address automatically`.