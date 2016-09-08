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
  echo -e "\t-e --exclude : Exclude some assets from rebuild. ex : --exclude site"
  echo -e "\t\tRecognized options : site"
}

make_force=false
make_check=false
make_site=true

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
    -e|--exclude)
      eval "make_$2=false"
      shift
    ;;
    *)
      echo "unknown opt"
      usageStr $1
      exit 1
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
  rm -rf zopfli-zopfli-1.0.1
  cd ${DIR}
fi



[ -d build/videos ] || mkdir -p build/videos

build_webm(){
  if ${make_force} || [ ! -f "$2" ] || [ "$2" -ot "$1" ] ;then
    echo "CONVERT $1 to $2"
    avconv -y -i $1 -c:v libvpx -c:a libvorbis -qmin 20 -qmax 30 -threads 2 $2
  fi
}
build_mpeg4(){
  if ${make_force} || [ ! -f "$2" ] || [ "$2" -ot "$1" ] ;then
    echo "CONVERT $1 to $2"
    avconv -y -i $1 -c:v h264 -c:a copy $2
  fi
}
build_ogg(){
  if ${make_force} || [ ! -f "$2" ] || [ "$2" -ot "$1" ] ;then
    echo "CONVERT $1 to $2"
    avconv -y -i $1  -c:v libtheora -qscale:v 7 -c:a libvorbis -qscale:a 5 $2
  fi
}
convert_video(){
  local f=$(echo "$1"|sed 's/src\/videos\///') #remove prefix
  local d=$(dirname "$f") #get subdir to create it if necessary
  local filename=$(basename "$f")
  local extension="${filename##*.}"
  local name="${filename%.*}"
  local out="build/videos/$d/${name}"
  build_ogg   "$1" "${out}.ogv"
  build_mpeg4 "$1" "${out}.mp4"
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
    if [ $extension == "xcf" ] ;then
      xcf2png $1 -o ${out}_uc2x.png
    elif [ $extension == "psd" ] ; then
      convert "${1}[0]"  "${out}_uc2x.png"
    else
      echo "invalid file : $1"
      return
    fi
    ${pngcrush} -y "${out}_uc2x.png" "${out}_2x.png"
    convert -quality 1 -resize 50% "${out}_uc2x.png" "${out}_uc.png"
    ${pngcrush} -y "${out}_uc.png" "${out}.png"
    convert -quality 80 "${out}_2x.png" "${out}_2x.jpg"
    convert -resize 50% -quality 80 "${out}_2x.png" "${out}.jpg"
    #remove uncompressed assets
    rm "${out}_uc"*
  fi
}
while IFS= read -r -d '' file; do
    # single filename is in $file
    build_srcset "$file"
    # your code here
done < <(find src/img/ -type f -print0)

${make_site} && bundle exec jekyll build
${make_check} && bundle exec htmlproofer _site \
  --assume-extension \
  --disable-external \
  --checks-to-ignore ScriptCheck \
  --file-ignore "/vendor/"

cd $OLD_PWD #go back to initial directory
