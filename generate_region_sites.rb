#!/usr/bin/env ruby
# frozen_string_literal: true

require 'json'
require 'fileutils'
require 'yaml'
require 'parallel'

data_dir = './data'
regions = YAML.load_file("#{data_dir}/regions.yml")
regions.each do |region|
  File.open("content/#{region['id']}/_index.md", "w") do |file|
    file.write("---\nlayout: tables\nregion:\n  id: \"#{region['id']}\"\n  name: \"#{region['name']}\"\n---");
  end
end

