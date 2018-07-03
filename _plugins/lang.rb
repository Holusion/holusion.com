
RE = /^\/(?<lang>fr|en)\//


def add_alt_language(doc)
  pageType = "#{doc.class.name}"
  site = doc.site
  alts = pageType == "Jekyll::Page" ? site.pages: site.documents
  url = doc.url
  filepath = doc.relative_path
  #always set page.data["lang"] because it otherwise breaks things
  if !  doc.data.key? "lang"
    match = RE.match(url)
    if match
      #print ("assign lang for #{url}: #{match["lang"]}\n")
      doc.data["lang"] = match["lang"]
    else
      #print "assign default for #{url}\n"
      doc.data["lang"] = "fr"
    end
  end

  lang = doc.data["lang"]
  alt_lang = lang == "fr" ? "en" : "fr"
  alt_path = filepath.sub("#{lang}/","#{alt_lang}/")
  alt_url = url.sub("/#{lang}/","/#{alt_lang}/")
  # check if we're in fr/ or en/ and an alternative lang might exist
  if ( url.include? lang and ! doc.data.key? "alt_url")
    # in post_init, all pages are not loaded yet
    # if this page's peer exists but is not in site.pages, it will later be initialized
    # and will call this hook and set alt_lang and alt_url for both pages
    peer = alts.find_index {|p| p.url == alt_url}
    if peer != nil
      #print "lang is #{page.data["lang"]} alt lang is : #{alt_lang}\n"
      doc.data["alt_lang"] = alt_lang
      doc.data["alt_url"] = alt_url
      alts[peer].data["alt_lang"] = lang
      alts[peer].data["alt_url"] = url
    end
  end
end

Jekyll::Hooks.register :pages, :post_init, priority: "high" do |p|
  #print "Making alt for page : #{p.name}\n"
  add_alt_language(p)
end

Jekyll::Hooks.register :posts, :post_init, priority: "high" do |p|
  add_alt_language(p)
end

=begin
Jekyll::Hooks.register :pages, :pre_render, priority: "high" do |p|
  if !p.data.key? "alt_url"
    print "no alt lang #{p.url}\n"
  end
end
=begin
=end
