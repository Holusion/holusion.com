#!/bin/bash
set -e
  command -v bundle >/dev/null 2>&1 || { echo >&2 "bundle command from bundler gem can not be found. run \"gem install bundler\"."; exit 1; }
usageStr(){
  if ! test -z "$1" ;then
    echo -e "invalid Option : $1"
  fi
  echo -e "Usage : build.sh [options]"
  echo -e "Valid options :"
  echo -e "\t-t --test : Enable checks with html-proofer"
  echo -e "\t-i --integration \"target\" : run integration tests on target"
  echo -e "\t\tuse target \"local\" to test on ./_site/ files"
  echo -e "\t\t(imply --no-build if target != local)"
  echo -e "\t-e --extended : extended integration tests"
  echo -e "\t-f --force : Force assets rebuild"
  echo -e "\t-w --watch : Use jekyll serve mode"
  echo -e "\t-d --dev : makes dev.holusion.com instead of holusion.com"
  echo -e "\t-c --compress-static : compress static assets"
  echo "long option only : "
  echo -e "\t--windows : apply Ms Mindows-specific settings"
  echo -e "\t--jenkins : apply JenkinsCI specific settings"
  echo -e "\t--no-build : disable site build"
  echo -e "\t--profile : echo profiling info (cf. jekyll --profile)"
}
make_build=true
make_force=false
make_check=false
make_dev=false
is_windows=false
is_jenkins=false
make_watch=false
make_compress=false
make_profile=false
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
        if test -z "$integration_target" || test "$integration_target" == -* ;then
          echo "integration testing required with no target argument"
          usageStr
          exit
        fi
        #Integration runs on target and does not trigger a build
        if test "x$integration_target" != "xlocal" ;then
          make_build=false
        fi
      ;;
      -e|--extended)
        export RUN_EXTENDED_TESTS=1
      ;;
      -f|--force)
        make_force=true
      ;;
      -w|--watch)
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
      --jenkins)
        is_jenkins=true
      ;;
      --no-build)
        make_build=false
      ;;
      --profile)
        make_profile=true
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
cd "$DIR"
#Get convert helpers
source ./scripts/optimizers.sh


[ -d "$DIR/build" ] || mkdir -p "$DIR/build"
install_optimizers "$DIR/build"

#check gem dependencies and install if necessary
bundle check >/dev/null || bundle install

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
    add_opts="$add_opts --force_polling"
  fi
  if $make_profile ;then
    add_opts="$add_opts --profile"
  fi
  if $make_watch ;then
    exec_cmd="serve"
  else
    exec_cmd="build"
  fi

  # final command
  bundle exec jekyll $exec_cmd --config $s_conf $add_opts

  if $make_compress ;then
    echo "Compress static assets"
    #Use a tmp dir to atomically mv images afgter compression.
    # Prevent partial results on interrupted builds
    time build_static "$DIR"
  fi
fi

#
# TEST target
# + static analysis of site's files.
#
${make_check} && bundle exec htmlproofer _site \
--assume-extension \
--alt-ignore "/.*/" \
--check-favicon \
--check-opengraph \
--checks-to-ignore ScriptCheck \
--only-4xx \
--disable-external \
--internal-domains "holusion.com,test.holusion.com" \
--file-ignore "/node_modules/,/static\/fonts\/.*.html/,/google[0-9a-f]*\.html/,/^_site\/index.html$/" \
--url-ignore "/^\/?$/"

${make_check} && test "x${RUN_EXTENDED_TESTS}" == "x1" && exec htmlproofer _site --external_only \
--file-ignore "/node_modules/,/static\/fonts\/.*.html/,/google[0-9a-f]*\.html/,/^_site\/index.html$/"



# Integration End-To-End tests
# if $integration_target=local, will start a local web server to test from `_site`
if ! test -z "$integration_target" ;then
  echo "RUN integration tests on $integration_target"
  if $is_jenkins ;then
    TARGET="$integration_target" npm run jenkins_test
  else
    TARGET="$integration_target" npm test
  fi
fi

cd "$OLD_PWD" #go back to initial directory
