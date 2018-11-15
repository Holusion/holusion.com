---
title: find a Holusion product on the network
image: img/posts/banner_packaging.jpg

abstract: Locate a Holusion product on your network
---

Once the **Holusion** product is plugged to your local network, you must locate its address.

We recognize the product by its charaterstics :

- Ports 22, 80, 300 opened
- Hostname : *<model>-<number>.holusion.net*

The most simple is to use your router interface (**DHCP** section) :

<center>
  <img class="img-fluid" src="/static/img/posts/packaging/dhcp_ip.png" alt="the poduct's IP address in the router interface">
</center>

An other solution is to scan the network with a command such as **nmap** :
{% highlight text %}
nmap -p 3000 192.168.1.0/24
[...]
Nmap scan report for 192.168.1.41
Host is up (0.00086s latency).
PORT     STATE SERVICE
3000/tcp open  ppp
{% endhighlight %}

Here we are scanning the network members that have an opened 3000 port.

You can now enter the found address on your internet navigator :

<center>
  <img class="img-fluid" src="/static/img/posts/packaging/browser-URL.png" alt="enter the IP in your internet navigator">
</center>

You can now use the administrator [interface](index).
