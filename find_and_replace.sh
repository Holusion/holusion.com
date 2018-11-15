#!/bin/bash

while read file; do
    # single filename is in $file
		dir="$(dirname "$file")"
		filename="$(basename "$file")"
	  base="${filename%.*}"
		src="static/generated/$dir/${base}_2x.jpg"
		dest="_assets/img/$dir/$base.jpg"
    echo "copy $src to $dest"
		mkdir -p "$(dirname "$dest")"
		cp "$src" "$dest"
done <<_EOF
posts/banner_after_effect.jpg
posts/banner_natron.jpg
posts/banner_unity.jpg
posts/dns_redirect/header.jpg
posts/banner_packaging.jpg
posts/banner_packaging.jpg
posts/banner_packaging.jpg
posts/banner_manual_focus.jpg
posts/banner_contactless.jpg
posts/banner_after_effect.jpg
posts/banner_natron.jpg
posts/banner_unity.jpg
posts/banner_blender.jpg
posts/dns_redirect/header.jpg
posts/banner_packaging.jpg
posts/banner_packaging.jpg
posts/banner_packaging.jpg
posts/banner_manual_focus.jpg
posts/banner_contactless.jpg
products/quartz.jpg
products/iris_22.jpg
products/focus_futur_en_seine.jpg
products/iris_nausicaa.jpg
quartz/plomberie.jpg
quartz/elec.jpg
quartz/vent.jpg
products/quartz_nausicaa.jpg
products/Prism_v2_voiture.jpg
products/iris_nausicaa.jpg
products/iris32_ales.jpg
products/opal_mappingdodo.jpg
products/iris_22.jpg
products/chroma_vignette.jpg
products/goodies_banner.jpg
products/iris_75_voiture.jpg
products/azur_voiture.jpg
products/focus_futur_en_seine.jpg
products/kit_pixels_vignette.jpg
products/focus_futur_en_seine.jpg
products/iris_nausicaa.jpg
quartz/plomberie.jpg
quartz/elec.jpg
quartz/vent.jpg
_EOF
