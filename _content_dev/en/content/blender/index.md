---
title: Blender
image: /static/img/posts/blender/banner.jpg
abstract: Holograms modeling with blender.
rank: 4
menu: content
---
#Tutorial Blender

Computer generated images offer limitless creation opportunities for holograms.
Blender is a free and open-source 3D computer graphics software used for creating animated films, visual effects and interactive 3D interaction.
It includes 3D modeling, texturing, physics simulator, sculpting, animating, rendering and compositing.
All sources are free to download at the main page of the **Blender Foundation** : [www.blender.org](https://www.blender.org/download/)
The following tutorial is addressed to users with basic experience of 3D computer graphics.


<a class="button" href="/static/files/static/files/BLENDER_PRISME.zip">Download for Prisme</a>

##Welcome to Blender
New to Blender? Train yourself on tutorials at

* [Introduction to Blender](http://cgcookie.com/flow/introduction-to-blender/)
* [Official Blender tutorials](http://www.blender.org/support/tutorials/)
* [**Blenderguru** : community of Blender experts](http://www.blenderguru.com/)

<div class="row">
  <div class="col-sm-6 col-sm-offset-3">
<img src="/static/img/posts/blender/blender_screen.png" alt="Blender screen" class="img-responsive">
</div>
</div>


##Holusion Blender Framework
[image screenshot]
You can use our framework for **Prisme** or **Focus** which allow you to deal with:

* Default resolution and compositing option
* No need for post-production
* Ready for use scene for rendering

<img src="/static/img/posts/blender/blender.jpg" alt="Blender framework" class="img-responsive">

##How To
Modeling: Blender can be used to create your own design of holograms. Or you could just use a ready-to-use scene with your model inside.
Blender support imports from :

* Collada (.dae)
* Motion capture (.bvh)
* Scalable Vector Graphics (.svg)
* Standford (.ply)
* Stl (.stl)
* 3DS studio (.3ds)
* FBX (.fbx)
* Wavefront (.obj)
* X3D Extensible 3D (.wrl)

Importing scene :
Open the test .blend scene for your setup :

* [Prisme](/static/files/BLENDER_PRISME.zip)
* Focus (WIP)

Use Import scene to add your model. If it is coming from another Blender scene, textures and lighting should be imported smoothly.

Scale, animate, light, and test some render for the quality of your scene trough the eyes of the camera. Subject should never leave or overflow the camera frame.

> **Advanced user** : you can change the camera options if standard setup is not good for your work. Camera is tracking the empty object in the center. You can use it for camera motion. Consider a circle and a track constraint for turning camera around your subject.

When your scene is ready, go for "Animation" in render panel. Don't forget to check :


* Compositing is checked
* Make **random render** trough your animation to check you don't overflow your camera frame
* Sampling is correctly set (for Cycle render)
* Output files are set

##Advanced user

You can edit several parameters for more liberty through editing the node compositing menu :

* Use pre-rendered images
* Have a 4 camera setup for each side of the hologram


##Ready to use scene

Do you like tanks ? Enjoy this ready to use scene of a free German Panzer III model for testing.

<div class="row">
  <div class="col-sm-6 col-sm-offset-3">
    <a href="/static/files/BLENDER_pzkfwg3.zip"><img class="img-responsive" alt="pzkfwg3" src="/static/img/posts/blender/PanzerIII.png"/></a>
  </div>
</div>
