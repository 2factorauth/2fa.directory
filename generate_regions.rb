#!/usr/bin/env ruby
# frozen_string_literal: true

require 'fileutils'
require 'json'
require 'net/http'
require 'uri'
require 'yaml'

# Generate /content/{region}/_index.md
data_dir = './data'
regions = YAML.load_file("#{data_dir}/regions.yml")
regions.each do |region|
  File.open("content/#{region['id']}/_index.md", "w") do |file|
    file.write("---\nlayout: tables\nregion:\n  id: \"#{region['id']}\"\n  name: \"#{region['name']}\"\n---");
  end
end

# Generate /data/{region}.json
categories = JSON.parse(File.read('./data/categories.json'))
regions = YAML.load_file('./data/regions.yml')
url = URI('https://2fa.directory/api/v3/all.json')
https = Net::HTTP.new(url.host, url.port)
https.use_ssl = true
request = Net::HTTP::Get.new(url)
response = https.request(request)

regions.each do |region|
  used_categories = {}

  JSON.parse(response.body).each do |_, entry|
    unless entry['regions'].nil?
      site_regions = entry['regions'].reject { |r| r.start_with?('-') }
      site_excluded_regions = entry['regions'].select { |r| r.start_with?('-') }.map! { |region_code| region_code.tr('-', '') }
    end

    unless entry['regions'].nil? || site_regions.empty? || site_regions.include?(region['id']) || region['id'].eql?('int')
      next
    end

    next if !site_excluded_regions.nil? && site_excluded_regions.include?(region['id'])

    entry['keywords'].each { |category| used_categories[category] = categories[category] unless used_categories.key? category }
  end
  File.open("./data/#{region['id']}.json", 'w') { |file| file.write JSON.generate used_categories }
end
