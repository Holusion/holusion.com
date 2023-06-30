---
title: Invert a camera in Unity 3D
image: img/posts/banner_unity.jpg

abstract: Apply a mirror effect on camera in Unity 3D
rank: 4
---

# Horizontally flipping a camera in Unity 3D

To be able to display an image on Holusion’s products using Unity, the first step is to flip camera images.

It can be done with a `Post Process Volume` (Unity *>5.6* required) or with the slightly less efficient `OnPreCull` camera hook.

### PostProcessing

Since **V5.6**, Unity offers a new [post-processing](https://docs.unity3d.com/Manual/PostProcessing-Stack.html) stack. It is possible to use it to mirror a camera's output using a matrix transform.

The `Post Processing v2` package from Unity's `Package Manager` is required. You then need the holusion-provided [CameraFlop](https://assetstore.unity.com/packages/vfx/shaders/cameraflop-139055) package.

For the shader to be applied you need to add a `Post Process Layer` to your main camera and tick the `Camera Flop` effect.

You need to also add the shader in `Edit > Project settings > Gaphics > Always included Shaders`.

### PreCull Hook

To use the `OnPreCull` hook, attach [this script](https://raw.githubusercontent.com/Holusion/3d-viewer/master/Assets/Scripts/HSymmetry.cs) to your scene's main camera :

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

It will apply a matrix transform to the camera.

