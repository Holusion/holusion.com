---
title: Modify the playlist
abstract: Use  the Holusion API to control your product
---

In this example we will see the route `PUT /playlist`, wich permits to modify **all** the properties of the elements of a playlist. It is a very important route and we are going to use it in most of the applications.

The commands in this tutorial are made with [curl](https://curl.haxx.se/).

# Example

    PUT /playlist {"query":{"name":"<ELEMENT_TO_MODIFY>"},"modify":{"$set":{"active": false }}}

Will modify the concerned element to desactivate it. We can use the negation to do the exact inverse :

    PUT /playlist {"query":{"$not":{"name":"<ELEMENT_TO_MODIFY>"}},"modify":{"$set":{"active": false }}}

Will desactivate all the element that don't have the given name.
