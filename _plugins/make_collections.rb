
class PostsReg
  @@list
  def self.set (l)
    @@list = l
  end
  def self.get
    return @@list
  end
end

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
    "posts" =>{ "fr" =>[], "en" => []},
    "products" => { "fr" =>[], "en" => []},
    "store" => { "fr" =>[], "en" => []},
  }

  site.collections["content_main"].docs.each do |page|
    match = /\/(?<lang>fr|en)\/(?<type>posts|products|store)\/(?!index)[^\/]+$/.match(page.url)

    # Any product/store_item/post MUST have an image AND a title
    if match and page.data["title"] and page.data["image"]
      c["#{match["type"]}"][match["lang"]].push( page )
    end
  end
  # Sort collections
  c["products"]["fr"].sort! {|a,b|product_sort(a,b)}
  c["products"]["en"].sort! {|a,b|product_sort(a,b)}
  c["store"]["fr"].sort! {|a,b|product_sort(a,b)}
  c["store"]["en"].sort! {|a,b|product_sort(a,b)}

  c.each do |cat, val|
    site.config["#{cat}_items"] = val
  end
end
