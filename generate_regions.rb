#!/usr/bin/env ruby
# frozen_string_literal: true

require 'fileutils'
require 'json'
require 'net/http'
require 'uri'
require 'yaml'

categories = JSON.parse(File.read('./data/categories.json'))
url = URI('https://2fa.directory/api/v3/all.json')
https = Net::HTTP.new(url.host, url.port)
https.use_ssl = true
request = Net::HTTP::Get.new(url)
response = https.request(request)
entries = JSON.parse(response.body)

YAML.load_file('./data/regions.yml').each do |region|
  dir = "content/#{region['id']}"
  id = region['id']
  FileUtils.mkdir_p dir
  File.open("#{dir}/_index.md", 'w') do |file|
    file.write("---\nlayout: tables\nregion:\n  id: \"#{id}\"\n  name: \"#{region['name']}\"\n---")
  end

  used_categories = {}
  entries.each do |_, entry|
    regions = entry['regions']
    next if regions.nil? && !id.eql?('int')

    included = regions.reject { |r| r.start_with?('-') }
    excluded = regions.select { |r| r.start_with?('-') }.map! { |v| v.tr('-', '') }
    next unless included&.include?(id) || !excluded.include?(id)

    entry['keywords'].each { |category| used_categories.merge!(categories.slice(category)) }
  end
  File.open("./data/#{id}.json", 'w') { |file| file.write JSON.generate used_categories.sort.to_h }
end
