#!/bin/bash
set -e
command -v convert >/dev/null 2>&1 || { echo >&2 "convert from imagemagick package is required but it's not installed.  Aborting."; exit 1; }
command -v xcf2png >/dev/null 2>&1 || { echo >&2 "xcf2png from xcftools package is required but it's not installed.  Aborting."; exit 1; }
command -v avconv >/dev/null 2>&1 || { echo >&2 "avconv from libav-tools package is required but it's not installed.  Aborting."; exit 1; }

usageStr(){
  echo -e "invalid Option : $1"
  echo -e "Usage : build.sh [options]"
  echo -e "Valid options :"
  echo -e "\t-t --test : Enable checks with html-proofer"
  echo -e "\t-f --force : Force assets rebuild"
  echo -e "\t-w --watch : Use jekyll serve mode"
  echo -e "\t-d --dev : makes dev.holusion.com instead of holusion.com"
  echo -e "\t-c --compress-static : compress static assets"
  echo "long option only : "
  echo -e "\t--windows : apply Ms Mindows-specific settings"
}

make_force=false
make_check=false
make_dev=false
is_windows=false
make_watch=false
make_compress=false

while [[ $# -gt 0 ]]
do
  key="$1"
  case $key in
      -t|--test)
        make_check=true
      ;;
      -f|--force)
        make_force=true
      ;;
      -w|--watch)
        echo "make watch"
        make_watch=true
      ;;
      -d|--dev)
        make_dev=true
      ;;
      --windows)
        is_windows=true
      ;;
      -c|--compress-static)
        make_compress=true
      ;;
      *)
        echo "unknown opt"
        usageStr $1
        exit
      ;;
  esac
  shift # past argument or value
done



DIR="$( cd "$( dirname "$0" )" && pwd )"
OLD_PWD=$(pwd)
cd $DIR
[ -d build ] || mkdir -p build

pngcrush="$DIR/build/zopflipng"
if [ ! -f ${pngcrush} ] ;then
  #download and build zopflipng
  wget -O - https://github.com/google/zopfli/archive/zopfli-1.0.1.tar.gz |tar -zxf -
  cd zopfli-zopfli-1.0.1 && make zopflipng && mv zopflipng ${pngcrush}
  rm -rf $DIR/zopfli-zopfli*
  cd ${DIR}
fi



[ -d build/videos ] || mkdir -p build/videos

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
while IFS= read -r -d '' file; do
    # single filename is in $file
    convert_video "$file"
done < <(find src/videos/ -type f -print0)

[ -d build/img ] || mkdir -p build/img

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
while IFS= read -r -d '' file; do
    # single filename is in $file
    build_srcset "$file"
    # your code here
done < <(find src/img/ -type f -print0)

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

if ${make_site} ;then
  s_conf="_config.yml"

  # Make dev.holusion.com if specified
  if $make_dev ;then
    s_conf="$s_conf,_config.dev.yml"
  fi
  # deploy if _deploy.yml exists. it should not in dev environments.
  # It's a shorthand to pass in build-time variables like site.url
  if test -f _deploy.yml ;then
    s_conf="$s_conf,_deploy.yml"
  fi

  # Add winwows options if requested
  if $is_windows ;then
    add_opts="--force_polling"
  fi
  if $make_watch ;then
    exec_cmd="serve"
  else
    exec_cmd="build"
  fi

  # final command
  bundle exec jekyll $exec_cmd --config $s_conf $add_opts

  #
  # TEST target
  #
  ${make_check} && bundle exec htmlproofer _site \
  --assume-extension \
  --disable-external \
  --checks-to-ignore ScriptCheck \
  --file-ignore "/vendor/"

  if $make_compress ;then
    echo "Compressing JPEG images"
    while IFS= read -r -d '' file; do
        compress_jpg "$file"
    done < <(find _site/static -type f -name *.jpg -print0)
    echo "Compressing PNG images"
    while IFS= read -r -d '' file; do
        compress_png "$file"
    done < <(find _site/static -type f -name *.png -print0)
  fi
fi
cd "$OLD_PWD" #go back to initial directory
