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

compress_folder(){
  local folder="$1"
  echo "compressing PNG files in $folder/**"
  while IFS= read -r -d '' file; do
    #do not filter png images because they are fast to compress
    mogrify \
    -filter Triangle -define filter:support=2 -unsharp 0.25x0.08+8.3+0.045 -dither None -posterize 136 \
    -quality 9 \
    -define png:exclude-chunk=all -interlace none -colorspace sRGB \
    "$file"
  done < <(find "$folder" -type f -iname "*.png" -print0)

  echo "compressing JPG files in $folder/**"
  while IFS= read -r -d '' file; do
    echo "Compressing $file"
    quality="$(identify -format '%Q' "$file")"
    if test "$quality" -gt "85" ;then
      echo "compressing $file of Q : $quality"
      mogrify -strip -interlace Plane -sampling-factor 4:2:0 -quality 85% \
      "$file"
    fi
  done < <(find "$folder" -type f -iname "*.jpg" -print0)
}

#auto-compress images in static folder
build_static(){
  local DIR="$1"
  local TMP_STORE="$(mktemp -d)"
  local CACHE_DIR="$DIR/.jekyll-cache/static-assets"
  [ -d "$CACHE_DIR" ] || mkdir -p "$CACHE_DIR"
  while IFS= read -r -d '' file; do
    #  $file path is relative to $DIR
    ldir="$(dirname "$file")"
    name="$(basename "$file")"
    [ -d "$DIR/_site/$ldir" ] || mkdir -p "$DIR/_site/$ldir"
    [ -d "$CACHE_DIR/$ldir" ] || mkdir -p "$CACHE_DIR/$ldir"
    #re-compress file only if it doesn't exist or has changed
    if ! test -f "$CACHE_DIR/$file" || test "$CACHE_DIR/$file" -ot "$file" ;then
      echo "Compress $file"
      compress_img "$file" "$TMP_STORE/$name"
      mv "$TMP_STORE/$name" "$CACHE_DIR/$file" #mv is atomic. No partial/failed file.
    fi
    cp "$CACHE_DIR/$file" "$DIR/_site/$file"
  done < <(find "static" -type f \( -iname "*.jpg" -o -iname "*.png" \) -print0)
  rm -rf "$TMP_STORE"
}
