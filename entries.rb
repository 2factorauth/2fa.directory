#!/usr/bin/env ruby
# frozen_string_literal: true

require 'json'
require 'fileutils'
require 'yaml'
require 'parallel'

data_dir = './data'
websites = JSON.parse(File.read("#{data_dir}/all.json"))
categories = JSON.parse(File.read("#{data_dir}/categories.json"))

Parallel.each(websites, in_threads: 8) do |name, website|
  website['keywords'].each do |category|
    categories[category] = {} unless categories.key? category
    categories[category][name] = website
  end
end

File.open("#{data_dir}/entries.json", "w") { |file| file.write JSON.generate categories }