---
title: Establish a wire connection
image: img/posts/banner_packaging.jpg

abstract: Connect your Holusion product to your work station
---

You can also directly connect your Holusion product to your work station. You just need to equip it with a local **DHCP** server.

## Windows method

*Tested on Windows 7 to 10*

### Set OpenDHCPServer up



Download and install [OpenDHCPServer](https://sourceforge.net/projects/dhcpserver/). Use the [installer](https://sourceforge.net/projects/dhcpserver/files/Open%20DHCP%20Server%20%28Regular%29/OpenDHCPServerInstallerV1.65.exe/download) for windows.
<div class="row">
  <div class="col-md-8 col-sm-6">
    <p><b>Note</b> : OpenDHCPServeur is a free software under <a href="https://www.gnu.org/licenses/old-licenses/gpl-2.0.fr.html">GNU-GPLv2</a> license. Its use is authorized in the frame presented in this example.
    </p>
    <p>
    Enter the used repertory. Unbox the option <code class="highlighter-rouge">Run the programm : Install as a service</code> : We will run the server when needed</p>
  </div>
  <div class="col-md-4 col-sm-6">
    <img class="img-fluid" src="/static/img/posts/packaging/OpenDHCPServer_install.png" alt="screenshot of the installation of the OpenDHCP server">
  </div>
</div>


Once the installation is finished, this folder should contain the following files :
<center>
<img class="img-fluid" src="/static/img/posts/packaging/OpenDHCPServer_files.png" alt="screenshot of the OpenDHCP server's files">
</center>

Replace the default configuration file by [this one](/static/files/OpenDHCPServer.ini). The 2 important parameters are :
{%highlight ini %}
[LISTEN_ON]
192.168.0.1

[RANGE_SET]
DHCPRange=192.168.0.2-192.168.0.20
{%endhighlight %}


**Advanced user** : You can change the setup to adapt it to your needs. For example, you can precise the interface to use in case of multiple choices.

### Setup the network interface

Plug the ethernet cable one end to the computer, the other end to the product.

If your computer has no ethernet port, this method works also with an [USB adapter](https://www.amazon.fr/AmazonBasics-Adaptateur-vers-Gigabit-Ethernet/dp/B00M77HMU0).

Open the "network connection" settings of your computer
<center>
<img class="img-fluid" src="/static/img/posts/packaging/ethernet_config.png" alt="the network connection configuration window">
</center>
**Note** : Depending on the Windows versions, the menus' name to access this setting change : "network and share center", "network settings", etc...

Right click and edit the ethernet properties (on the picture, **Ethernet2**).
<center>
<img class="img-fluid" src="/static/img/posts/packaging/ip_params.png" alt="the network connections configuration window">
<p>On the left, the interface properties. On the right, the "TCP/IPv4" properties</p>
</center>

You must change the `Internet Protocole Version 4 (TCP/IPv4)` element properties. If your interface is already setup in a particular way, write down the parameters before changing them in order to find them back later.

We are going to assign a **static IP** with the following settings :
{% highlight text %}
IP adress: 192.168.0.1
Subnet number : 255.255.255.0
Default host : 192.168.0.1
{% endhighlight %}

Confirm the modifications and exit.

**Caution** : If you use many different USB-Ethernet adapters, they will take different names sometimes, requiring for you to repeat the operation.

### Plug in

Once the precedent steps are correctly done, all you have to do is double-click on the `RunStandAlone` command file. It will open a control window that will inform you on the system's status :

<center>

<img class="img-fluid" src="/static/img/posts/packaging/OpenDHCPServer_run_success.png" alt="the DHCP server's control window">
<p>"Listening On: 192.168.0.1" show that the interface was correctly configured.</p>
</center>

It is important to write down all the informations that appear in this window if the operation doesn't work : They will help understanding the origin of the problem.

At this stage, you can in general restart the Holusion product with the ethernet cable plugged in to make it detect the network change.

<center>
<img class="img-fluid" src="/static/img/posts/packaging/OpenDHCPServer_alloc.png" alt="Assigning an IP by the DHCP server">
<p>A successful IP assigning</p>
</center>

The assigned IP adresses list can be reached at this adress : [http://localhost:6789](http://localhost:6789)

You can now [access](index) your product at the adress [http://192.168.0.2](http://192.168.0.2)

### Desactivation

You can notice that once you made the operations, your interface will not connect to the other wire networks. To turn off the DHCP server and come back to normal, you just have to go back in the network interface settings, and in the TCP/IPv4 properties, check `Automatically obtain a IP address`.
