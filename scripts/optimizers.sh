#!/bin/bash
pngcrush="$(pwd)/build/zopflipng" #default value

#takes build directory as argument.
install_optimizers(){
  set -e
  local build_dir="$1"
  pngcrush="$1/zopflipng"

  #check presence of system-wide commands
  command -v convert >/dev/null 2>&1 || { echo >&2 "convert from imagemagick package is required but it's not installed.  Aborting."; exit 1; }
  command -v xcf2png >/dev/null 2>&1 || { echo >&2 "xcf2png from xcftools package is required but it's not installed.  Aborting."; exit 1; }
  command -v avconv >/dev/null 2>&1 || { echo >&2 "avconv from libav-tools package is required but it's not installed.  Aborting."; exit 1; }

  if [ ! -f "${pngcrush}" ] ;then
    #download and build zopflipng
    local tmp=$(mktemp -d)
    local zopfli_version="1.0.1"
    curl -XGET -L -q "https://github.com/google/zopfli/archive/zopfli-${zopfli_version}.tar.gz" -o "${tmp}/zopfli-${zopfli_version}.tar.gz"
    cd "$tmp" && tar -zxf "zopfli-${zopfli_version}.tar.gz"
    cd "$tmp/zopfli-zopfli-${zopfli_version}" && make zopflipng && mv zopflipng "${pngcrush}"
    rm -rf "$tmp"
  fi
}

build_webm(){
  if ${make_force} || [ ! -f "$2" ] || [ "$2" -ot "$1" ] ;then
    echo "CONVERT $1 to $2"
    avconv  -i "$1" -y -c:v libvpx -c:a libvorbis -qmin 20 -qmax 30 -threads 0 "$2" </dev/null
  fi
}
build_mpeg4(){
  if ${make_force} || [ ! -f "$2" ] || [ "$2" -ot "$1" ] ;then
    echo "CONVERT $1 to $2"
    avconv -i "$1" -y -c:v h264 -profile:v main -level 31 -c:a copy "$2" </dev/null
  fi
}
build_ogg(){
  if ${make_force} || [ ! -f "$2" ] || [ "$2" -ot "$1" ] ;then
    echo "CONVERT $1 to $2"
    avconv -i "$1" -y -c:v libtheora -qscale:v 7 -c:a libvorbis -qscale:a 5 -threads 0 "$2" </dev/null
  fi
}
convert_video(){
  local f=$(echo "$1"|sed 's/src\/videos\///') #remove prefix
  local d=$(dirname "$f") #get subdir to create it if necessary
  local filename=$(basename "$f")
  local extension="${filename##*.}"
  local name="${filename%.*}"
  local out="build/videos/$d/${name}"
  build_mpeg4 "$1" "${out}.mp4"
  build_ogg   "$1" "${out}.ogv"
  build_webm  "$1" "${out}.webm"
}

#Generic optimized compress image options
# Use unquoted to generate those parameters
compress_img_opts(){
  echo '-filter Triangle -define filter:support=2 -unsharp 0.25x0.25+8+0.065 -dither None -posterize 136 -quality 82 -define jpeg:fancy-upsampling=off -define png:compression-filter=5 -define png:compression-level=9 -define png:compression-strategy=1 -define png:exclude-chunk=all -interlace none -colorspace sRGB -strip'
}
# compress_img "input.png" "output.png"
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

build_static(){
  local DIR="$1"
  local TMP_STORE="$(mktemp -d)"
  [ -d "build/static" ] || mkdir -p "build/static"
  while IFS= read -r -d '' file; do
    #  $file path is relative to $DIR
    ldir="$(dirname "$file")"
    name="$(basename "$file")"
    [ -d "_site/$ldir" ] || mkdir -p "_site/$ldir"
    [ -d "build/$ldir" ] || mkdir -p "build/$ldir"
    #re-compress file only if it'sc older or doesn't exist
    if ! test -f "build/$file" || test "build/$file" -ot "$file" ;then
      echo "Compress $file"
      compress_img "$file" "$TMP_STORE/$name"
      mv "$TMP_STORE/$name" "$DIR/build/$file" #mv is atomic. No partial/failed file.
      cp "$DIR/build/$file" "$DIR/_site/$file"
    fi
    cp "$DIR/build/$file" "$DIR/_site/$file"
  done < <(find "static" -type f \( -iname "*.jpg" -o -iname "*.png" \) -print0)
  rm -rf "$TMP_STORE"
}

build_srcset(){
  local f=$(echo "$1"|sed 's/src\/img\///') #remove prefix
  local d=$(dirname "$f") #get subdir to create it if necessary
  local filename=$(basename "$f")
  local extension="${filename##*.}"
  local name="${filename%.*}"
  local out="build/img/$d/${name}"
  if [ ! -d build/img/$d ] ;then
    mkdir -p "build/img/$d"
  fi
  if ${make_force} || [ ! -f "${out}.jpg" ] || [ "${out}.jpg" -ot "$1" ] ;then
    echo "Processing $file "
    if [ "$extension" == "xcf" ] ;then
      xcf2png "$1" -o "${out}_uc2x.png"
    elif [ "$extension" == "psd" ] ; then
      convert "${1}[0]"  "${out}_uc2x.png"
    elif [ "$extension" == "png" ] ; then
      cp "$1" "${out}_uc2x.png"
    elif [ "$extension" == "ai" ] ;then
      convert "ai:${1}" +antialias "${out}_uc2x.png"
    else
      echo "invalid file : $1"
      return
    fi
    ${pngcrush} -y "${out}_uc2x.png" "${out}_2x.png"
    convert -quality 1 -resize 50% "${out}_uc2x.png" "${out}_uc.png"
    ${pngcrush} -y "${out}_uc.png" "${out}.png"
    convert $(compress_img_opts) "${out}_2x.png" -flatten -background white "${out}_2x.jpg"
    convert -resize 50% $(compress_img_opts) "${out}_2x.png" -flatten -background white "${out}.jpg"
    #remove uncompressed assets
    rm "${out}_uc"*
  fi
}
