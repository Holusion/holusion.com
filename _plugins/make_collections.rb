require "jekyll/utils"

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

Jekyll::Hooks.register :site, :post_read do |site|
  c = {
    "products" => { "fr" =>[], "en" => []},
    "store" => { "fr" =>[], "en" => []},
  }

  site.pages.each do |page|
    match = /\/(?<lang>fr|en)\/(?<type>products|store)\/(?!index)[^\/]+$/.match(page.url)
    next if ! match
    c["#{match["type"]}"][match["lang"]].push( page )
    # then assign defaults to categories
    # we don't do it in _config.yml because it's buggy
    case match["type"]
    when "products"
      page.data["layout"] = "product" unless page.data.key? "layout"
    end
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

  end

  # Sort collections
  c["products"]["fr"].sort! {|a,b|product_sort(a,b)}
  c["products"]["en"].sort! {|a,b|product_sort(a,b)}
  c["store"]["fr"].sort! {|a,b|product_sort(a,b)}
  c["store"]["en"].sort! {|a,b|product_sort(a,b)}
  #print c["posts"]["fr"].map {|p| p.basename}.join("\n")
  #print "\n"
  c.each do |cat, val|
    site.config["#{cat}_items"] = val
  end

end
