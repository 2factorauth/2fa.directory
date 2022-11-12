# 2FA.Directory Frontend

This repository contains the HTML, JavaScript and CSS for 2fa.directory proposed version 5.0.  
All data used to populate the categories is located in [2factorauth/twofactorauth](https://github.com/2factorauth/twofactorauth.git).

![](screenshot.png)

## Local installation

The website is based on the static site generator [Hugo](https://gohugo.io/).
To build locally you will need to follow the [installation instructions](https://gohugo.io/installation/) for Hugo.  
[Ruby](https://www.ruby-lang.org/en/documentation/installation/) is also required for some scripts. 

After you've installed Hugo and Ruby, follow these steps to build the site locally:
* Fetching entries:
  `ruby generate_entries.rb`
* Generating regional pages:
  `ruby generate_regions.rb`
* Run Hugo locally:
  `hugo serve`

## Contributing

When contributing changes to this repository, please make sure your IDE follows our [editorconfig](https://editorconfig.org/).

## License
