require "nokogiri"
module Jekyll
  module Tags
    class DevNav < Liquid::Tag
      @@uids = 1
      #import lookup_variable function
      # https://github.com/jekyll/jekyll/blob/master/lib/jekyll/liquid_extensions.rb
      include Jekyll::LiquidExtensions

      # For interpoaltion, look for liquid variables
      VARIABLE = /\{\{\s*([\w]+\.?[\w]*)\s*\}\}/i
      # parse the first parameter in a string, giving :
     #  [full_match, param_name, double_quoted_val, single_quoted_val, unquoted_val]
     # The Regex works like :
     # - first group
     #    - match a group of characters that is alphanumeric, _ or -.
     # - second group (non-capturing OR)
     #    - match a double-quoted string
     #    - match a single-quoted string
     #    - match an unquoted string matching the set : [\w\.\-#]
     PARAM_SYNTAX= %r!
       ([\w-]+)\s*=\s*
       (?:"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'|([\w\.\-#]+))
     !x
      def cache
        @@cache ||= Jekyll::Cache.new("DevNav")
      end
      def getUid
        @@uids += 1
        return @@uids
      end

      def initialize(tag_name, markup, tokens)
        super
        @params = split_params(markup)
      end

      #lookup Liquid variables from markup in context
      def interpolate(params, context)
        result = {}
        params.each do |key, value|
          vars = value.scan VARIABLE
          if 0 < vars.size
            vars.each do |variable|
              result[key] = value.sub(VARIABLE, lookup_variable(context, variable.first))
            end
          else
            result[key] = lookup_variable(context, value)
          end
        end
        return result
      end
      def split_params(markup)
        params={}
        while (match = PARAM_SYNTAX.match(markup))
          markup = markup[match.end(0)..-1]
          value = if match[2]
            match[2].gsub(%r!\\"!, '"')
          elsif match[3]
            match[3].gsub(%r!\\'!, "'")
          elsif match[4]
            match[4]
          end
          params[match[1]] = value
        end
        return params
      end

      # makes a tree of docs as a hash like :
      # {
      #   "fr" => {
      #     "page_path" => { :title, :url, :children }
      #   }
      # }
      def doc_tree(docs)
        tree = { "fr" =>{}, "en" => {}}
        docs.each do |doc|
          match = /\/dev\/(?<lang>fr|en)\/((?<rest>.*)\/)?(?<last>(?!index)[^\/]+)/.match(doc.url)
          next if ! match #skip if page does not match
          lang = match["lang"]
          parts = match["rest"]? match["rest"].split("/") : []
          last_part = match["last"]

          current_hash = tree[lang]

          parts.each do |part|
            #print "current hash :#{current_hash}"
            current_hash[part] = {:children =>{}, :title => part } if not current_hash.has_key? part
            current_hash = current_hash[part][:children]
          end

          current_hash[last_part] = {
            :title => doc.data["title"],
            :rank => doc.data.has_key?("rank")? doc.data["rank"] : 0,
            :url => doc.url,
            :children =>(current_hash.has_key?(last_part)) ? current_hash[last_part][:children]: {},
            :visible => doc.data.has_key?("visible")? doc.data["visible"] : true
          } if doc.data["visible"] != false
        end

        return tree
      end

      def render_item(path, item, active_uri)
        uid = getUid

        is_active = active_uri.include? path
        title = item[:title] || path.split("/").last
        url = item[:url] || ""

        markup = %(<li class="list-group-item content-bar--link#{is_active ? " current" : ""}">)

        if item[:children].empty?
          markup += %(<a href="#{url}">#{title}</a>)
        else
          sorted_children = item[:children].sort_by { |key, val| val[:rank] }
          child_nodes = sorted_children.map do |childKey, child|
            render_item(path+"/#{childKey}", child, active_uri)
          end

          markup += %(
            <a class="dropdown-toggle" role="button"
              data-bs-toggle="collapse"  aria-haspopup="true"
              aria-expanded="#{is_active ? "true" : "false"}"
              data-bs-target="#collapseList#{uid}"
              aria-expanded="#{ is_active ? "true" : "false"}"
              aria-controls="collapseList#{uid}">
              #{title}
            </a>
          )

          markup += %(
            <ul class="collapse list-group list-group-flush content-bar-group--sub#{is_active ? " show" : ""}"
              id="collapseList#{uid}"
            >
          )
          if url and 0 < url.length
            markup += %(
              <li class="list-group-item content-bar--link#{url == active_uri ? " current": ""}">
                <a href="#{url}">Introduction</a>
              </li>
            )
          end
          markup += child_nodes.join("\n")
          markup += %(</ul>)
        end

        markup += %(</li>)
        return markup
      end

      def render(context)
        #global site variable
        site = context.registers[:site]
        page = context.registers[:page]
        #replace variables with their current value
        params = interpolate(@params,context)
        docs = params["list"]
        if docs.class != Array
          raise SyntaxError, <<~END
          Syntax Error in tag 'devnav' : require an Array. Got #{docs.class}
          END
        end
        lang = params["lang"] || page["lang"]
        if not lang
          raise SyntaxError, <<~END
          Syntax Error in tag 'devnav' : require a lang to be set
          END
        end

        docs_tree = cache.getset(docs) do
          doc_tree(docs)
        end

        html = %(<ul class="list-group list-group-flush content-bar-group--main">)

        html += %(<li class="list-group-item content-bar--link#{ page["url"] == %(/dev/#{lang}/index) ? " current" : ""}">
          <a href="/dev/#{lang}/">Introduction</a>
        </li>)

        sorted_localized_docs = docs_tree[lang].sort_by { |key, val| val.has_key?(:rank)? val[:rank] : 0 }
        sorted_localized_docs.each do |key, doc|
          next if doc[:children].empty?# do not render categories with no children for now
          html += render_item(key, doc, page["url"])
        end
  	    return html+"</ul>"
      end
    end
  end
end

Liquid::Template.register_tag('devnav', Jekyll::Tags::DevNav)
