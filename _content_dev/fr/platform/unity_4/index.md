---
title: Unity 3D
image: /build/img/posts/banner_unity.jpg
image2x: /build/img/posts/banner_unity_2x.jpg
abstract: Application de démonstration sur Unity3D
rank: 2
menu: platform
---

# Guide de développement

Les utilisateurs débutants avec Unity seront généralement plus à l'aise en utilisant d'abord l'application de [démonstration](#application-viewer) avant de s'intéresser à son fonctionnement détaillé ci après.

## Placement des caméras

Il faut tout d'abord placer correctement les caméras.

Unity ne permettant pas la création de caméras aux formes exotiques (triangles, losanges...), il reste à la charge du développeur d'éviter que la scène ne déborde sur les cadres de caméras voisines ; en particulier dans le cadre du **Prisme**. Voir la page concernant les [formats d'image](/fr/content/layout) des produits.

Les paramètres `position`, `rotation` et `viewport` des caméras sont réglés pour obtenir le résultat voulu.

-   Les caméras peuvent se superposer, l'important est que l'objet ne dépasse pas des faces (exemple du prisme).
- Il faut que le fond soit uniformément noir pour un rendu de qualité.

<div class="container">
<div class="row">
<div class="col-md-offset-3 col-md-3 col-xs-6">
  <img class="img-responsive magnify" src="/static/img/posts/unity/layout_sample.png" alt="sample layout image" >
  <center>Résultat sans "background"</center>
</div>
<div class="col-md-3 col-xs-6">
  <img class="img-responsive magnify" src="/static/img/posts/unity/layout_sample_2.png" alt="sample layout image" >
  <center>Résultat avec "background"</center>
</div>
</div>
</div>

## Inversion des caméras

Pour pouvoir utiliser Unity3D sur les produits Holusion, la première étape est d'inverser les caméras. Elles doivent projeter l'image comme vue à travers un miroir.

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


## Détails

Il faut impérativement désactiver la boite de dialogue de choix des résolutions. Aller dans ```Edit -> Project Settings -> Player```,
dans *pc, mac & linux standalone*, categorie *Resolution and Presentation*, ```disable Display Resolution Dialog```. Au même endroit, activer le mode plein écran (*fullscreen*) par défaut.

# Packager l'application

Utiliser l'option ```linux x86_64``` dans le menu **build** de Unity.

Cela crée normalement un fichier *<votre_projet>.x86_64* et un dossier *<votre_projet_data>*. Sélectionnez-les et archivez-les au format .tar.gz ou .zip.

Sur Windows : ```clic droit -> Envoyer vers -> Dossier compressé ```.

Ce dossier compressé peut être transféré sur le projecteur d'hologrammes.
