#!/bin/bash

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
    convert -quality 80 "${out}_2x.png" -flatten -background white "${out}_2x.jpg"
    convert -resize 50% -quality 80 "${out}_2x.png" -flatten -background white "${out}.jpg"
    #remove uncompressed assets
    rm "${out}_uc"*
  fi
}
