module Jekyll
  module Tags
    class JekyllAriane < Liquid::Tag
      # we use a lazy quantifier on rest to not match trailing /index.html
      @@re = /^\/(?<prefix>(?<dev>dev\/)?(?<lang>fr|en))\/(?<rest>.*?)(index|index.html)?$/
      def render(context)
        #global site variable
        page = context.registers[:page]
        site = context.registers[:site]
        url = page["url"]
        m = @@re.match(url)
        if not m
          #print "{%ariane%} called on #{url} (invalid url)\n"
          return
        end
        lang = m["lang"]
        path_parts = m["rest"].split("/")
        fragment_link = "/#{m["prefix"]}"
        #print "#{path}\n"
        links = path_parts.map do |fragment|
          fragment_link+="/#{fragment}"
          localized_title = if site.data["sections"][fragment] and site.data["sections"][fragment][lang]
            site.data["sections"][fragment][lang]
          else
            fragment
          end
          %!<a href="#{fragment_link}">#{localized_title}</a> !
        end
        links.unshift( %!<a href="/#{m["prefix"]}">dev</a> !) if m["dev"]

        return %@
        <div class="ariane">
          <a href="/#{m["prefix"]}">
            #{site.data["sections"]["home"][lang]}
          </a>
          #{links.join("\n")}
        </div>
        @
      end
    end
  end
end
Liquid::Template.register_tag('ariane', Jekyll::Tags::JekyllAriane)
