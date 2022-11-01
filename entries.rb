#!/usr/bin/env ruby
# frozen_string_literal: true

require 'fileutils'
require 'net/http'
require 'json'
require 'yaml'
require 'parallel'
require 'uri'

data_dir = './data'
categories = JSON.parse(File.read("#{data_dir}/categories.json"))
url = URI('https://2fa.directory/api/v3/all.json')
https = Net::HTTP.new(url.host, url.port)
https.use_ssl = true
request = Net::HTTP::Get.new(url)
response = https.request(request)
websites = JSON.parse(response.body)

Parallel.each(websites, in_threads: 8) do |name, website|
  website['keywords'].each do |category|
    categories[category] = {} unless categories.key? category
    categories[category][name] = website
  end
end

File.open("#{data_dir}/entries.json", "w") { |file| file.write JSON.generate categories }
