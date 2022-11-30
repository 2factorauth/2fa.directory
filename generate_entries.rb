#!/usr/bin/env ruby
# frozen_string_literal: true

require 'fileutils'
require 'net/http'
require 'json'
require 'uri'

response = Net::HTTP.get URI('https://2fa.directory/api/v3/all.json')
entries = {}

JSON.parse(response).each do |name, website|
  website['keywords'].each do |category|
    entries[category] = {} unless entries.key? category
    entries[category].merge!({ name => website })
  end
end

File.open('./data/entries.json', 'w') { |file| file.write JSON.generate entries.sort.to_h }
