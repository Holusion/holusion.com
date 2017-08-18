module Jekyll
  class Icon < Liquid::Tag
    def initialize(tag_name, input, tokens)
      super
      # we split on every = then take a substring on last space.
      # ie : we're fine as long as param keys are 1 word.
      params = input.split("=")
      @name = params[0][0..params[0].rindex(" ")].strip

      # Parse parameters
      size = /size\s*=\s*(\d*)/.match(input)
      @width = (size && size[1])? size[1] : 24

      style =  /style\s*=\s*["']?(.+)(["']|$)/.match(input)
      @style = (style && style[1]) ? %(style="#{style[1]}") : ""

      fill = /fill=\s*["']?(#[0-9abcdefABCDEF]+|none)(["']|$)/.match(input)
      @fill = (fill && fill[1]) ? fill[1] : "#ffffff"
    end

    def render(context)
      %(
      <svg aria-label="#{@name}" fill="#{@fill}" height="#{@width}" viewBox="0 0 24 24" width="#{@width}" #{@style} xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
        <use xlink:href="##{@name}"></use>
      </svg>
      )
    end
  end
end

Liquid::Template.register_tag('icon', Jekyll::Icon)
