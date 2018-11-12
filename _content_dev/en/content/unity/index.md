---
title: Unity 3D
image: /build/img/posts/banner_unity.jpg
image2x: /build/img/posts/banner_unity_2x.jpg
abstract: Demonstration app for Unity 3D version 4
rank: 0
menu: platform
---

# Getting Started

## Inverting cameras

To be able to display an image on Holusion's products using Unity, the first step is to flip camera images.

We provide a script to do this. It should be attached on every camera on he scene.
(Download it [here](https://raw.githubusercontent.com/Holusion/3d-viewer/master/Assets/Scripts/HSymmetry.cs))
{% highlight csharp %}
    using UnityEngine;
    using System.Collections;

    [RequireComponent (typeof (Camera))]
    public class HSymmetry : MonoBehaviour {

      void OnPreCull () {
        Matrix4x4 scale;
        if(camera.aspect >2){
          scale = Matrix4x4.Scale (new Vector3 (-1, 1, 1));
        }else{
           scale = Matrix4x4.Scale (new Vector3 (1, -1, 1));
        }
        camera.ResetWorldToCameraMatrix ();
        camera.ResetProjectionMatrix ();
        camera.projectionMatrix = camera.projectionMatrix * scale;
      }
      void OnPreRender () {
        GL.SetRevertBackfacing (true);
      }
      void OnPostRender () {
        GL.SetRevertBackfacing (false);
      }
    }
{% endhighlight %}
It's simply making an horizontal flip on cameras.
**Warning** : this script is based on camera ratio to detect flip direction. It might require some adjustments to work properly on other projects.

## Camera position

Once image is properly setup, next step should be to place cameras on screen. As unity wouldn't allow non-rectangular cameras, your cameras are probably going to overlap. It's up to the developper to ensure nothing si going to be displayed on those surfaces.


## Enabling launch on Linux

one must disable resolution dialog to prevent it from blocking app from launching.
Go to ```Edit -> Project Settings -> Player``` and in *Resolution and Presentation*, check ```disable Display Resolution Dialog```.
At the same place, activate *default to fullscreen* mode.

# Package the App

Use the ```linux x86_64``` build option.

It will provide you with a file *<project_name>.x86_64* and a folder *<project_name>_data*. Select them both and put them into a *.tar.gz* or *.zip* archive (*.tar.gz* is faster).

On Windows : ```right click -> Send to -> Compressed folder```.

Then transfer this archive to your product.
