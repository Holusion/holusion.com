source 'https://rubygems.org'
ruby File.read(".ruby-version").strip

group :core do
  gem 'jekyll', "~>4.3.2"
  gem 'wdm', ">=0.1.0" if Gem.win_platform?
end

group :jekyll_plugins do
  gem 'jekyll-sitemap', ">=1.2.0"
  gem 'jekyll-redirect-from', ">=0.14.0"
  gem 'jekyll-inline-svg', "~>1.1.1"
  gem 'jekyll-paginate-v2', "~>3.0.0"
  gem 'jekyll_picture_tag', "~> 2.0"
  gem 'jekyll-sass-converter', "~>3.0.0"
end

group :test, optional: true do
  gem 'html-proofer', "~>4.4.3"
end
