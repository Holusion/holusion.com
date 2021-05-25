source 'https://rubygems.org'

group :core do
  gem 'jekyll', "~>4.2.0"
  gem 'jekyll-sass-converter', ">=2.1.0"
  gem 'sass' #otherwise jekyll-assets/sprockets complains
  gem 'wdm', ">=0.1.0" if Gem.win_platform?
end

group :plugins do
  gem 'jekyll-sitemap', ">=1.2.0"
  gem 'jekyll-redirect-from', ">=0.14.0"
  gem 'jekyll-inline-svg', "~>1.1.1"
  gem 'jekyll-paginate-v2', "~>3.0.0"
end

group :assets do
  gem "jekyll-assets", git: "https://github.com/envygeeks/jekyll-assets" #v4.0.0-alpha not yet published to rubygems
  gem "image_optim"
  gem "image_optim_pack" # Optional if we prefer to install system deps
  gem "mini_magick"
end

group :test, optional: true do
  gem 'html-proofer'
end
