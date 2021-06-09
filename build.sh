#!/bin/bash
set -e

command -v bundle >/dev/null 2>&1 || {
  echo >&2 "Impossible de trouver la commande \"bundle\"."
  echo >&2 "Installer bundler avec \"gem install bundler\"."
  exit 1
}

command -v npm >/dev/null 2>&1 || {
  echo >&2 "Impossible de trouver la commande \"npm\"."
  echo >&2 "Installer nodejs pour continuer "
  echo >&2 "\thttps://docs.microsoft.com/fr-fr/windows/dev-environment/javascript/nodejs-on-wsl"
  exit 1
}

command -v vips >/dev/null 2>&1 || {
  echo >&2 "Impossible de trouver la commande \"vips\""
  echo >&2 "Installer libvips avec \"sudo apt install libvips-tools\""
  exit 1
}

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
  echo -e "\t-c --compress-static : compress static assets"
  echo "long option only : "
  echo -e "\t--no-build : disable site build"
}

make_build=true
make_force=false
make_check=false
make_watch=false
make_compress=false
integration_target=""
while [[ $# -gt 0 ]]
do
  key="$1"
  case $key in
      --)
        shift
        break
      ;;
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
      -c|--compress-static)
        make_compress=true
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
cd "$DIR"
#Get convert helpers
source ./scripts/optimizers.sh

#Set up RVM
if test -s "$HOME/.rvm/scripts/rvm" ; then
  # First try to load from a user install
  source "$HOME/.rvm/scripts/rvm"
  rvm use "$(cat $DIR/.ruby-version)@$(cat $DIR/.ruby-gemset)"
elif test -s "/usr/local/rvm/scripts/rvm" ; then
  # Then try to load from a root install
  source "/usr/local/rvm/scripts/rvm"
  rvm use "$(cat $DIR/.ruby-version)@$(cat $DIR/.ruby-gemset)"
else
  echo "WARNING: An RVM installation was not found."
  echo "Using system Ruby : $(ruby -e 'print ENV["RUBY_VERSION"]')"
fi


#[ -d "$DIR/build" ] || mkdir -p "$DIR/build"
install_optimizers "$DIR/build"

#check gem dependencies and install if necessary
bundle check >/dev/null || bundle install


if $make_compress ;then
  #echo "Compress static assets"
  time compress_folder "$DIR/static"
fi

if ${make_build} ;then
  s_conf="_config.yml"

  # deploy if _deploy.yml exists. it should not in dev environments.
  # It's a shorthand to pass in build-time variables like site.url
  if test -f _deploy.yml ;then
    s_conf="$s_conf,_deploy.yml"
  fi

  if $make_watch ;then
    exec_cmd="serve"
  else
    exec_cmd="build"
  fi

  # final command
  bundle exec jekyll $exec_cmd --config $s_conf $@

fi

#
# TEST target
# + static analysis of site's files.
#
if ${make_check} ;then
  bundle exec htmlproofer _site \
    --assume-extension \
    --alt-ignore "/.*/" \
    --check-favicon \
    --check-opengraph \
    --checks-to-ignore ScriptCheck \
    --only-4xx \
    --disable-external \
    --internal-domains "holusion.com,test.holusion.com" \
    --file-ignore "/node_modules/,/static\/fonts\/.*.html/,/google[0-9a-f]*\.html/,/^_site\/index.html$/" \
    --url-ignore "/^\/?$/" \
    --log-level :debug \
    $@
fi


# Integration End-To-End tests
# if $integration_target=local, will start a local web server to test from `_site`
if ! test -z "$integration_target" ;then
  echo "RUN integration tests on $integration_target"
  TARGET="$integration_target" npm test -- $@
fi

cd "$OLD_PWD" #go back to initial directory
