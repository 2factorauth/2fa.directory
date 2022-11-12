#!/usr/bin/env ruby
# frozen_string_literal: true

require 'fileutils'
require 'net/http'
require 'json'
require 'uri'

url = URI('https://2fa.directory/api/v3/all.json')
https = Net::HTTP.new(url.host, url.port)
https.use_ssl = true
request = Net::HTTP::Get.new(url)
response = https.request(request)
entries = {}

JSON.parse(response.body).each do |name, website|
  website['keywords'].each do |category|
    entries[category] = {} unless entries.key? category
    entries[category].merge!({ name => website })
  end
end

File.open('./data/entries.json', 'w') { |file| file.write JSON.generate entries.sort.to_h }
