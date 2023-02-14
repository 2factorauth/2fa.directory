#!/usr/bin/env ruby
# frozen_string_literal: true

require 'fileutils'
require 'net/http'
require 'json'
require 'yaml'
require 'uri'

# Fetch API files
module API
  def self.fetch(uri)
    response = Net::HTTP.get_response URI(uri)
    return JSON.parse(response.body) unless response.code.eql? 200
  end
end

categories = JSON.parse(File.read('./data/categories.json'))
regions = API.fetch('https://api.2fa.directory/v3/regions.json')
entries = API.fetch('https://api.2fa.directory/v3/all.json')

used_regions = []
regions.each do |id, region|
  next unless region['count'] >= 10 && !id.eql?('int')

  used_regions.push(id)
  dir = "content/#{id}"
  FileUtils.mkdir_p dir
  File.open("#{dir}/_index.md", 'w') do |file|
    file.write("---\nlayout: tables\nregion:\n  id: \"#{id}\"\n  name: \"#{region['name']}\"\n---")
  end

  used_categories = {}
  entries.each do |_, entry|
    entry_regions = entry['regions']
    unless entry_regions.nil?
      included = entry_regions.reject { |r| r.start_with?('-') }
      excluded = entry_regions.select { |r| r.start_with?('-') }.map! { |v| v.tr('-', '') }
      next if (!included.empty? && !included&.include?(id)) || excluded.include?(id)
    end

    entry['keywords'].each { |category| used_categories.merge!(categories.slice(category)) }
  end
  File.open("./data/#{id}.json", 'w') { |file| file.write JSON.generate used_categories.sort.to_h }
end

all_regions = {}
API.fetch('https://raw.githubusercontent.com/stefangabos/world_countries/master/data/countries/en/world.json')
   .select do |region|
  all_regions[region['alpha2']] = region['name'] if used_regions.include? region['alpha2']
end

# Change long official names
all_regions.merge!({ 'us' => 'United States',
                     'gb' => 'United Kingdom',
                     'tw' => 'Taiwan',
                     'ru' => 'Russia',
                     'kr' => 'South Korea' })

# Flags for these regions should have square geometry
square_flags = [ "ch", "np", "va" ]

# Change output format to array of hashmaps
output = all_regions.map { |k, v| { 'id' => k, 'name' => v, 'square_flag' => square_flags.include?(k) } }
File.open('data/regions.yml', 'w') { |file| file.write output.to_yaml }
