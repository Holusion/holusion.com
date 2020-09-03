---
title: Inverser une caméra sur Unity 3D
image: img/posts/banner_unity.jpg

abstract: Appliquer un effet miroir sur Unity 3D
rank: 4
---

# Miroir horizontal de caméra sur Unity 3D

Pour pouvoir utiliser Unity3D sur les produits Holusion, la première étape est généralement d'inverser la caméra. Elle doit afficher l'image comme vue à travers un miroir. 

Deux méthodes sont possibles: En utilisant le *hook* `OnPreCull` de la caméra, ou via un `Post Process Volume` (*>5.6* uniquement).

**Note** : Sur certains produits, cette inversion peut aussi être réalisée directement via configuration du serveur X dans le contrôleur.

### Méthode PostProcessing

Depuis la version **5.6**, Unity propose un module de [post-processing](https://docs.unity3d.com/Manual/PostProcessing-Stack.html). Il permet la mise en place d'effets visuels divers : flou de mouvement, color grading, etc... Il est possible de réaliser un shader d'inversion de l'image :

Dans un premier temps, installer le package `Post Processing v2` via le `Package Manager` d'Unity, puis téléchargez le package [CameraFlop](https://assetstore.unity.com/packages/vfx/shaders/cameraflop-139055) via Unity. Pour que le Shader aie un effet, il faut ajouter un composant `Post Process Layer` et un composant `Post Process Volume` et lui ajouter l'effet `Camera Flop`.
De plus ajoutez le Shader dans `Edit > Project settings > Gaphics > Always included Shaders`, augmentez l'option `Size` si nécessaire.

### Méthode sans PostProcessing

Pour ce faire, attacher le script suivant à chaque caméra de la scène :
(Télécharger le script [ici](https://raw.githubusercontent.com/Holusion/3d-viewer/master/Assets/Scripts/HSymmetry.cs))
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
Ce script inverse horizontalement les cameras.
**Attention**, il n'est pas protégé contre les cameras aux aspects-ratio spéciaux et peut nécessiter quelques modifications.
