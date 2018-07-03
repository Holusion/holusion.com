module Jekyll
  module Tags
    class JekyllAriane < Liquid::Tag
      def render(context)
        #global site variable
        page = context.registers[:page]
        site = context.registers[:site]
        url = page["url"]
        lang = page["lang"]
        return if lang.nil? || lang.length == 0
        path = url.split("/")
        path.shift(2)
        path.pop() if (path.last == "index" or path.last == "index.html")
        cat_link="/#{lang}"

        #print "#{path}\n"
        links = path.map do |fragment|
          cat_link+="/#{fragment}"
          localized_title = if site.data["sections"][fragment] and site.data["sections"][fragment][lang]
            site.data["sections"][fragment][lang]
          else
            fragment
          end
          %!<a href="#{cat_link}">#{localized_title}</a> !
        end
        return %!
        <div class="container ariane">
          <a href="/#{lang}">
            #{site.data["sections"]["home"][lang]}
          </a>
          #{links.join("\n")}
        </div>
        !
      end
    end
  end
end
Liquid::Template.register_tag('ariane', Jekyll::Tags::JekyllAriane)
