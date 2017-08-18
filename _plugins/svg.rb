require 'svg_optimizer'

class RemoveSize < SvgOptimizer::Plugins::Base
  def process
    xml.root.remove_attribute("height")
    xml.root.remove_attribute("width")
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
PLUGINS_BLACKLIST = [
  SvgOptimizer::Plugins::CleanupId,
]

PLUGINS = SvgOptimizer::DEFAULT_PLUGINS.delete_if {|plugin|
  PLUGINS_BLACKLIST.include? plugin
}+[
  RemoveSize
]

#logger.info(PLUGINS)
module Jekyll
  module Tags
    class RenderSvg < Liquid::Tag
      VARIABLE_SYNTAX = %r!
        (?<variable>[^{]*(\{\{\s*[\w\-\.]+\s*(\|.*)?\}\}[^\s{}]*)+)
        (?<params>.*)
      !x
      def initialize(tag_name, input, tokens)
        super

        #@logger = Logger.new(STDOUT)
        #@logger.level = Logger::INFO
        matched = input.strip.match(VARIABLE_SYNTAX)
        if matched
          @svg = matched["variable"].strip
          @params = matched["params"].strip
        else
          @svg, @params = input.strip.split(%r!\s+!, 2)
        end
        size = /size\s*=\s*(\d*)/.match(input)
        @width = (size && size[1])? size[1] : 24

        style =  /style\s*=\s*["']?(.+)(["']|$)/.match(input)
        @style = (style && style[1]) ? %( style="#{style[1]}") : ""

        fill = /fill\s*=\s*(#[0-9abcdefABCDEF]+)/.match(input)
        @fill = (fill && fill[1]) ? %( fill=#{fill[1]}) : ""
        #@logger.info(@svg +", "+@width)
      end

      def render(context)
        #global site variable
        site = context.registers[:site]
        #check if given name is a variable. Otherwise use it as a file name
        svg_name = context[@svg] || @svg
        svg_file = File.join(site.source, svg_name.strip)
        xml = File.open(svg_file, "rb")
        optimized = SvgOptimizer.optimize(xml.read, PLUGINS)
  	    "#{optimized.sub("<svg ","<svg width='#{@width}px'#{@fill}#{@style} ")}"
      end
    end
  end
end
Liquid::Template.register_tag('svg', Jekyll::Tags::RenderSvg)
