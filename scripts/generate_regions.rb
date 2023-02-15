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

used_regions = regions.filter_map do |id, region|
  if region['count'] >= 10 && id != 'int'
    entries.filter_map do |_, e|
      e_regions = e['regions']
      if e_regions.nil? || (e_regions.any? { |r| !r.start_with?('-') && r == id } &&
        e_regions.none? { |r| r.start_with?('-') && r.tr('-', '') == id })
        r_categories = e['keywords'].map { |category| categories.slice(category) }.reduce(&:merge)
        File.write("./data/#{id}.json", JSON.generate(r_categories.sort.to_h))
        id
      end
    end
  end
end.flatten.uniq

all_regions = API.fetch('https://raw.githubusercontent.com/stefangabos/world_countries/master/data/countries/en/world.json')
                 .select { |region| used_regions.include?(region['alpha2']) }
                 .map { |region| [region['alpha2'], region['name']] }
                 .to_h

# Change long official names
all_regions.merge!({ 'us' => 'United States',
                     'gb' => 'United Kingdom',
                     'tw' => 'Taiwan',
                     'ru' => 'Russia',
                     'kr' => 'South Korea' })

# Flags for these regions should have square geometry
square_flags = %w[ch np va]

# Change output format to array of hashmaps
output = all_regions.map do |k, v|
  { 'id' => k, 'name' => v }
    .tap { |h| h['square_flag'] = 1 if square_flags.include?(k) }
end
File.open('data/regions.yml', 'w') { |file| file.write output.to_yaml }

output.each do |region|
  dir = "content/#{region['id']}"
  FileUtils.mkdir_p dir
  File.open("#{dir}/_index.md", 'w') do |file|
    file.write("#{{ 'layout' => 'tables', 'region' => region }.to_yaml}---")
  end
end
