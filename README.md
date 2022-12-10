# 2FA.Directory Frontend

> **Note**
> This repository contains a proposed redesign of [2fa.directory][website].  
> Until it is approved as the official design, the project is accessible
> via [beta.2fa.directory](https://beta.2fa.directory/).

This repository contains the HTML, JavaScript and CSS for [2fa.directory][website].  
All data used to populate the categories is located
in [2factorauth/twofactorauth][data_repo].

![][screenshot]

## Local installation

The website is based on the static site generator [Hugo][hugo].
To build locally you will need to follow the [installation instructions][hugo_install] for Hugo.  
[Ruby][ruby_install] is also required for some scripts.

After you've installed Hugo and Ruby, follow these steps to build the site locally:

1. Install NPM packages
   `npm install`
1. Install Ruby gems
   `bundle install`
1. Fetch entries:
   `./generate_entries.rb`
1. Generate regional pages:
   `./generate_regions.rb`
1. Run Hugo locally:
   `hugo serve`  
   The site should then be reachable at [127.0.0.1:1313][localhost].

> **Note**
> The [region-redirection](/functions/redirect.js) script does not run locally. You will therefore always be directed to
> the international page when using `hugo serve`.

## Publishing forks

This repository is built on the frameworks of [Cloudflare Pages][cf_pages] and requires the build process to be done via
Cloudflare.

To publish your fork of this repo, follow these steps:

1. Log in to your Cloudflare [Dashboard][cf_dash] and select Pages. Create a new project and select
   your fork as the source.
2. When prompted for build configuration, enter the following:
   * __Framework preset:__ `None`
   * __Build command:__ `./scripts/build.sh`
   * __Build output directory:__ `/public`

## Contributing

When contributing changes to this repository, please make sure your IDE follows
our [editorconfig][editorconfig].

The general file structure is as follows:

|     Type     | Path                  |
|:------------:|-----------------------|
|  JavaScript  | `assets/js`           |
|     CSS      | `assets/css`          |
|   Layouts    | `layouts/_default`    |
|    Pages     | `content`             |
| Translations | `data/languages.json` |

## License

This project is licensed under GPLv3. For the entire license see [LICENSE](/LICENSE).

Before you make changes to the code, please keep the following in mind:
* The data is [licensed separately][data_license].
* Attribution is required if you use this project as a template for your own website.
* The initial contents of [LICENSE](/LICENSE) must still be included in distributions and forks but we allow (and
  encourage) you to prepend your own copyright and GPLv3-compatible license for changes you make.

For a more information on what is and isn't allowed under a GPLv3 license, see
this [guide][gplv3_guide].

[cf_dash]: https://dash.cloudflare.com/
[cf_pages]: https://pages.cloudflare.com/
[data_repo]: https://github.com/2factorauth/twofactorauth.git
[data_license]: https://github.com/2factorauth/twofactorauth/blob/master/LICENSE.md
[editorconfig]: https://editorconfig.org/
[gplv3_guide]: https://www.gnu.org/licenses/quick-guide-gplv3.html
[hugo]: https://gohugo.io/
[localhost]: http://127.0.0.1:1313/
[hugo_install]: https://gohugo.io/installation/
[ruby_install]: https://www.ruby-lang.org/en/documentation/installation/
[website]: https://2fa.directory/
[screenshot]: https://i.imgur.com/4WvIsg0.png
