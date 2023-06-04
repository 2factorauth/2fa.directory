#!/usr/bin/env ruby
# frozen_string_literal: true

require 'fileutils'
require 'net/http'
require 'json'
require 'uri'

path = ENV['LOCAL_2FA_PATH']
if path
  response = File.read(path+'/api/v3/all.json')
else
  response = Net::HTTP.get URI('https://api.2fa.directory/v3/all.json')
end
entries = {}

JSON.parse(response).each do |name, website|
  website['keywords'].each do |category|
    entries[category] = {} unless entries.key? category
    entries[category].merge!({ name => website })
  end
end

File.open('./data/entries.json', 'w') { |file| file.write JSON.generate entries.sort.to_h }
