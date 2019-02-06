---
title: Unity 3D
image: img/posts/banner_unity.jpg

abstract: Application de démonstration sur Unity3D
rank: 2
menu: platform
redirect_from:
  - /dev/fr/platform/unity_4/

---

# Guide de développement

Les utilisateurs débutants avec Unity seront généralement plus à l'aise en utilisant d'abord l'application de démonstration avant de s'intéresser à son fonctionnement détaillé ci après.

## Placement des caméras

Il faut tout d'abord placer correctement les caméras.

Unity ne permettant pas la création de caméras aux formes exotiques (triangles, losanges...), il reste à la charge du développeur d'éviter que la scène ne déborde sur les cadres de caméras voisines ; en particulier dans le cadre du **Prisme**. Voir la page concernant les [formats d'image](/dev/fr/content/) des produits.

Les paramètres `position`, `rotation` et `viewport` des caméras sont réglés pour obtenir le résultat voulu.

-   Les caméras peuvent se superposer, l'important est que l'objet ne dépasse pas des faces (exemple du prisme).
- Il faut que le fond soit uniformément noir pour un rendu de qualité.

<div class="container">
<div class="row">
<div class="offset-md-3 col-md-3 col-6">
  <img class="img-fluid magnify" src="/static/img/posts/unity/layout_sample.png" alt="sample layout image" >
  <center>Résultat sans "background"</center>
</div>
<div class="col-md-3 col-6">
  <img class="img-fluid magnify" src="/static/img/posts/unity/layout_sample_2.png" alt="sample layout image" >
  <center>Résultat avec "background"</center>
</div>
</div>
</div>

## Inversion des caméras

Pour pouvoir utiliser Unity3D sur les produits Holusion, la première étape est d'inverser les caméras. Elles doivent projeter l'image comme vue à travers un miroir.

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

### Méthode avec PostProcessing

Si vous voulez utiliser des effets visuel provenants du [package PostProcessing](https://docs.unity3d.com/Manual/PostProcessing-Stack.html) comme le flou de mouvement, la méthode
décrite ci-dessus ne fonctionnera pas. La solution est d'ajouter un effet de PostProcessing :
(Télécharger le script [ici](https://raw.githubusercontent.com/Holusion/HoloZoom/master/Assets/Scripts/CameraFlop.cs) et le shader [ici](https://raw.githubusercontent.com/Holusion/HoloZoom/master/Assets/Shaders/CameraFlop.shader)) Pour que le Shader est un effet, il faut ajouter un composant `Post Process Layer` et un composant `Post Process Volume` et lui ajouter l'effet `Camera Flop`.
De plus ajoutez le Shader dans `Edit > Project settings > Gaphics > Always included Shaders`, augmentez l'option `Size` si nécessaire.

#### Script (C#)

{% highlight csharp %}
  using System;
  using UnityEngine;
  using UnityEngine.Rendering.PostProcessing;

  [Serializable]
  [PostProcess(typeof(CameraFlopRenderer), PostProcessEvent.AfterStack, "CameraFlop")]
  public sealed class CameraFlop : PostProcessEffectSettings
  {
  }

  public sealed class CameraFlopRenderer : PostProcessEffectRenderer<CameraFlop>
  {
      public override void Render(PostProcessRenderContext context)
      {
          var sheet = context.propertySheets.Get(Shader.Find("Hidden/CameraFlop"));
          context.command.BlitFullscreenTriangle(context.source, context.destination, sheet, 0);
      }
  }
{% endhighlight %}

#### Shader (HLSL)

{% highlight glsl %}
  // Upgrade NOTE: replaced 'mul(UNITY_MATRIX_MVP,*)' with 'UnityObjectToClipPos(*)'

  Shader "Hidden/CameraFlop"
  {
    HLSLINCLUDE

        #include "Packages/com.unity.postprocessing/PostProcessing/Shaders/StdLib.hlsl"

        TEXTURE2D_SAMPLER2D(_MainTex, sampler_MainTex);
        int _FlopH, _FlopV;

        float4 Frag(VaryingsDefault i) : SV_Target
        {
            float2 uv = i.texcoord;
            if(_FlopH) {
                uv.x = 1- uv.x;
            }
            if(_FlopV) {
                uv.y = 1 - uv.y;
            }
            float4 color = SAMPLE_TEXTURE2D(_MainTex, sampler_MainTex, uv);
            return color;
        }

    ENDHLSL

    SubShader
    {
        Cull Off ZWrite Off ZTest Always

        Pass
        {
            HLSLPROGRAM

                #pragma vertex VertDefault
                #pragma fragment Frag

            ENDHLSL
        }
    }
  }
{% endhighlight %}

## Détails

Il faut impérativement désactiver la boite de dialogue de choix des résolutions. Aller dans ```Edit -> Project Settings -> Player```,
dans *pc, mac & linux standalone*, categorie *Resolution and Presentation*, ```disable Display Resolution Dialog```. Au même endroit, activer le mode plein écran (*fullscreen*) par défaut.

# Packager l'application

Utiliser l'option ```linux x86_64``` dans le menu **build** de Unity.

Cela crée normalement un fichier *\<votre_projet\>.x86_64* et un dossier *\<votre_projet_data\>*. Sélectionnez-les et archivez-les au format .tar.gz ou .zip.

Sur Windows : ```clic droit -> Envoyer vers -> Dossier compressé ```.

Ce dossier compressé peut être transféré sur le projecteur d'hologrammes.
