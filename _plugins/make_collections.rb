require "jekyll/utils"
#require "pp" #prettyprint

def product_sort(a, b)
  ra = a.data["rank"]
  rb = b.data["rank"]
  if ra && rb
    return ra <=> rb
  elsif ra
    return 1 #b follows a
  elsif rb
    return -1 #a follows b
  else
    return 0
  end
end


def product_filter(a)
  return a.data && a.data.key?("title") && a.data.key?("abstract")
end
Jekyll::Hooks.register :site, :post_read do |site|
  c = {
    "products"  => { "fr" =>[], "en" => []},
    "store"     => { "fr" =>[], "en" => []},
  }

  site.pages.each do |page|
    match = /\/(?<lang>fr|en)\/(?<type>products|store)\/(?!index)[^\/]+$/.match(page.url)
    next if ! match #skip if page does not match
    # then assign defaults to categories
    # we don't do it in _config.yml because it's buggy
    case match["type"]
      when "products"
        page.data["layout"] = "product" unless page.data.key? "layout"
    end
    print("")
    #add it to collections
    c["#{match["type"]}"][match["lang"]].push( page )
  end
  # merge data attributes once we got the whole site
  # it only work from french -> english and not the other way around
  c.keys.each do |col|
    c[col]["fr"].each do |p|
      alt_url = p.data["alt_url"]
      alt_p = site.pages.find {|item| item.url == alt_url}
      next if not alt_url or not alt_p  # break if no alt page exists

      # copy keys (no overwrite)
      alt_p.data = Jekyll::Utils.deep_merge_hashes(
        p.data, alt_p.data
      )
    end
    # Sort collections and filter bad pages
    c[col]["fr"].sort! {|a,b|product_sort(a,b)}
    c[col]["fr"].select!{|a|product_filter(a)}
    c[col]["en"].sort! {|a,b|product_sort(a,b)}
    c[col]["en"].select!{|a|product_filter(a)}

  end
  #print "\n"
  c.each do |cat, val|
    site.config["#{cat}_items"] = val
  end

end
