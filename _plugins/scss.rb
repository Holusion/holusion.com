# frozen_string_literal: true

require "sass"
require "jekyll/utils"

module Jekyll
  module Converters
    class Scss < Converter
      def convert(content)
        return content
        output = ::Sass.compile(content, sass_configs)
        replacement = add_charset? ? '@charset "UTF-8";' : ""
        output.sub(BYTE_ORDER_MARK, replacement)
      rescue ::Sass::SyntaxError => e
        raise SyntaxError, "#{e} on line #{e.sass_line}"
      end

      private
      def site_source
        @site_source ||= File.expand_path(@config["source"]).freeze
      end
    end
  end
end
