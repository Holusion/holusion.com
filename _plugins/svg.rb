require 'svg_optimizer'

class RemoveSize < SvgOptimizer::Plugins::Base
  def process

    xml.root.remove_attribute("height")
    xml.root.set_attribute("width","!!WIDTH!!")
  end
end
class RoundPoints < SvgOptimizer::Plugins::Base
  def process
    xml.xpath("//*[@*]").each do |node|
      if node.attributes["d"]
        d = node.attributes["d"]
        d.value = d.value.gsub(/([\d.]+)/){|n| n.to_f.round(2).to_s}
      end

    end
  end
end
#logger = Logger.new(STDOUT)
#logger.level = Logger::INFO
PLUGINS_BLACKLIST = [
  SvgOptimizer::Plugins::CleanupId,
]

PLUGINS = SvgOptimizer::DEFAULT_PLUGINS.delete_if {|plugin|
  PLUGINS_BLACKLIST.include? plugin
}+[
  RemoveSize,
  RoundPoints
]

#logger.info(PLUGINS)
module Jekyll
  class RenderSvg < Liquid::Tag

    def initialize(tag_name, input, tokens)
      super
      params = split_params(input)
      @svg = params[0][0..params[0].rindex(" ")].strip
      size = /size=(\d*)/.match(input)
      if size && size[1]
        @width=size[1]
      else
        @width=24
      end

    end

    def split_params(params)
      params.split("=")
    end
    def render(context)
      svg_name = context[@svg] || @svg
      svg_file = File.join(context.registers[ :site ].source, svg_name.strip)
      xml = File.open(svg_file, "rb")
      optimized = SvgOptimizer.optimize(xml.read,PLUGINS)
	    "#{optimized.gsub("!!WIDTH!!","#{@width}px")}"
    end
  end
end

Liquid::Template.register_tag('svg', Jekyll::RenderSvg)
