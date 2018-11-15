#!/bin/bash


#takes build directory as argument.
install_optimizers(){
  set -e
  #check presence of system-wide commands
  command -v convert >/dev/null 2>&1 || { echo >&2 "convert from imagemagick package is required but it's not installed.  Aborting."; exit 1; }
}

#Generic optimized compress image options
# Use unquoted to generate those parameters, like $(compress_img_opts)
# Can provide an optional "interlace" parameter
compress_img_opts(){
  echo '-filter Triangle -define filter:support=2 -unsharp 0.25x0.25+8+0.065 -dither None -posterize 136 -quality 82 -define jpeg:fancy-upsampling=off -define png:compression-filter=5 -define png:compression-level=9 -define png:compression-strategy=1 -define png:exclude-chunk=all -interlace None -colorspace sRGB -strip'
}
# compress_img "in.png" "out.(png|jpg)"
compress_img(){
  convert $(compress_img_opts) "$1" "$2"
}

# compress_jpg "in.jpg"
compress_jpg(){
  local dest_quality=80
  QUALITY=$(identify -format "%Q" "$1")
  if test $dest_quality -lt $QUALITY ;then
    #fallback to copy if convert failed
    mogrify  -quality $dest_quality -strip "$1"
  fi
}

# compress_png "in.png"
compress_png(){
  mogrify -format png -quality 9 -strip "$1"
}

#auto-compress images in static folder
build_static(){
  local DIR="$1"
  local TMP_STORE="$(mktemp -d)"
  [ -d ".static-cache" ] || mkdir -p ".static-cache"
  while IFS= read -r -d '' file; do
    #  $file path is relative to $DIR
    ldir="$(dirname "$file")"
    name="$(basename "$file")"
    [ -d "_site/$ldir" ] || mkdir -p "_site/$ldir"
    [ -d ".static-cache/$ldir" ] || mkdir -p ".static-cache/$ldir"
    #re-compress file only if it'sc older or doesn't exist
    if ! test -f ".static-cache/$file" || test ".static-cache/$file" -ot "$file" ;then
      echo "Compress $file"
      compress_img "$file" "$TMP_STORE/$name"
      mv "$TMP_STORE/$name" ".static-cache/$file" #mv is atomic. No partial/failed file.
    fi
    cp ".static-cache/$file" "$DIR/_site/$file"
  done < <(find "static" -type f \( -iname "*.jpg" -o -iname "*.png" \) -print0)
  rm -rf "$TMP_STORE"
}
