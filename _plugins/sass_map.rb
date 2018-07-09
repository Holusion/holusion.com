require "sass"
require "jekyll/utils"

module Jekyll
  class SourceMapFile < Jekyll::StaticFile
    def modified?
      return false
    end
    def write(dest)
      return true
    end
  end


  class ScssSourceMapGenerator < Jekyll::Generator
    @@re = %r!^\.scss$!i # copied from Converters::Scss match method
    def sass_configs
      sass_build_configuration_options({
        "syntax"     => syntax,
        "cache"      => allow_caching?,
        "load_paths" => sass_load_paths,
      })
    end

    def generate(site)
      # require site.config.sass.sourcemap to be true or do nothing
      return unless site.config.key? "sass" and site.config["sass"]["sourcemap"] == true
      #find the site's scss converter to steal it's options
      converter = site.converters.find {|c| c.class.name == "Jekyll::Converters::Scss"}
      scss_files = site.pages.find_all {|p| @@re.match(p.ext)}
      sourcemaps = scss_files.map do |file|
        mapname = "#{file.basename}.css.map"
        mapdir = File.join(site.dest,file.dir)
        config = Jekyll::Utils.symbolize_hash_keys(
          Jekyll::Utils.deep_merge_hashes(
            converter.sass_configs,
            {
              "filename" => "#{file.dir}#{file.name}",
            },
          )
        )
        css, map = Sass::Engine.new(
          file.content,
          config,
        ).render_with_sourcemap(mapname)
        #print "Data: #{data}\n"
        #FIXME file need to use this output
        file.content = css
        # Create destination directory if it doesn't exist yet. Otherwise, we cannot write our file there.
        Dir::mkdir(mapdir) if !File.directory? mapdir
        File.open(File.join(mapdir, mapname), "w") {|mapfile|

          mapfile.write(map.to_json(:css_uri => "#{mapname}"))
        }
        site.static_files << Jekyll::SourceMapFile.new(site, site.dest, file.dir, mapname)
      end
    end
  end
end
