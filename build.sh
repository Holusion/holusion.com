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
  echo -e "\t-i --integration : run integration tests on target (imply --no-build)"
  echo -e "\t-f --force : Force assets rebuild"
  echo -e "\t-w --watch : Use jekyll serve mode"
  echo -e "\t-d --dev : makes dev.holusion.com instead of holusion.com"
  echo -e "\t-c --compress-static : compress static assets"
  echo "long option only : "
  echo -e "\t--windows : apply Ms Mindows-specific settings"
  echo -e "\t--no-build : disable site build"
}
make_build=true
make_force=false
make_check=false
make_dev=false
is_windows=false
make_watch=false
make_compress=false
integration_target=""
while [[ $# -gt 0 ]]
do
  key="$1"
  case $key in
      -t|--test)
        make_check=true
      ;;
      -i|--integration)
        shift
        integration_target="$1"
        #Integration runs on target and does not trigger a build
        make_build=false
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
      -c|--compress-static)
        make_compress=true
      ;;
      --windows)
        is_windows=true
      ;;
      --no-build)
        make_build=false
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
#Get convert helpers
source ./scripts/optimizers.sh


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

while IFS= read -r -d '' file; do
    # single filename is in $file
    convert_video "$file"
done < <(find src/videos/ -type f -print0)

[ -d build/img ] || mkdir -p build/img


while IFS= read -r -d '' file; do
    # single filename is in $file
    build_srcset "$file"
    # your code here
done < <(find src/img/ -type f -print0)



if ${make_build} ;then
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
  # + static analysis of site's files.
  #
  ${make_check} && bundle exec htmlproofer _site \
  --assume-extension \
  --alt-ignore "/static\/img\/products\/.*/" \
  --check-favicon \
  --checks-to-ignore ScriptCheck \
  --file-ignore "/vendor/,/static\/fonts\/.*.html/"

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

if ! test -z "$integration_target" ;then
  echo "RUN integration tests on $integration_target"

fi

cd "$OLD_PWD" #go back to initial directory
