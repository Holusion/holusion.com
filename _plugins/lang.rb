
re = /^\/(?<lang>fr|en)\/(.*)$/
Jekyll::Hooks.register :documents, :pre_render, priority: "high" do |content, doc|
  url = doc.page["url"]
  filepath = doc.page["relative_path"]
  if !  doc.page.key? "lang"
    match = re.match(url)
    if match
      doc.page["lang"] = match["lang"]
    else
      doc.page["lang"] = "fr"
    end
  end
  alt_lang = doc.page["lang"] == "fr" ? "en" : "fr"
  #check if alternate path exists by finding it's counterpart path
  alt_path = filepath.sub("/#{doc.page["lang"]}/","/#{alt_lang}/")
  alt_url = url.sub("/#{doc.page["lang"]}/","/#{alt_lang}/")
  # do not sanitize path as it's a relative path given by jekyll
  if File.exist? alt_path
    doc.page["alt_lang"] = alt_lang
    doc.page["alt_url"] =alt_url
  end
end
