module Jekyll
  class Icon < Liquid::Tag
    def initialize(tag_name, input, tokens)
      super
      # we split on every = then take a substring on last space.
      # ie : we're fine as long as param keys are 1 word.
      params = input.split("=")
      @name = params[0][0..params[0].rindex(" ")].strip
      size = /size=(\d*)/.match(input)
      if size && size[1]
        @width=size[1]
      else
        @width=24
      end
      style =  /style=["']?(.*)(["']|$)/.match(input)
      if style && style[1]
        @style=%(style="#{style[1]}")
      else
        @style=""
      end
    end

    def render(context)
      %(
      <svg aria-label="#{@name}" fill="#ffffff" height="#{@width}" viewBox="0 0 24 24" width="#{@width}" #{@style} xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
        <use xlink:href="##{@name}"></use>
      </svg>
      )
    end
  end
end

Liquid::Template.register_tag('icon', Jekyll::Icon)
