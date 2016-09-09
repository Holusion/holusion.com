
module Jekyll
  module AssetFilter
    def canonical(str)
      return if  !str.is_a? String
      str = str.sub(/\/index$/,"/")
      if(str.index('/') !=0)
        #it's a relative link
      end
      if(/^\/?dev\//.match(str))
        str = str.sub(/^\/dev\//,"https://dev.holusion.com/")
      else
        str = str.prepend("https://holusion.com")
      end
      return str
    end
  end
end

Liquid::Template.register_filter(Jekyll::AssetFilter)
