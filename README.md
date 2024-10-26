# 2FA.Directory Frontend

This repository contains the HTML, JavaScript and CSS for [2fa.directory][website].  
All data used to populate the categories is located
in [2factorauth/twofactorauth][data_repo].

![][screenshot]

## Local installation

To run the site locally, follow these steps:

1. Install NPM packages
   `npm install`
1. Run the site locally:
   `npm run dev`

> **Note**
> The [region-redirection](/functions/redirect.js) script does not run locally. You will therefore always be directed to
> the international page when using `npm run dev`.

## Publishing forks

This repository is built on the frameworks of [Cloudflare Pages][cf_pages] and requires the build process to be done via
Cloudflare.

To publish your fork of this repo, follow these steps:

1. Log in to your Cloudflare [Dashboard][cf_dash] and select Pages. Create a new project and select
   your fork as the source.
2. When prompted for build configuration, enter the following:
  * **Framework preset:** `None`
  * **Build command:** `npm run build`
  * **Build output directory:** `/dist`

## Contributing

When contributing changes to this repository, please make sure your IDE follows
our [editorconfig][editorconfig].

The general file structure is as follows:

|       Type        | Path                  |
|:-----------------:|-----------------------|
|    JavaScript     | `src`                 |
|        CSS        | `assets/css`          |
| Layout components | `src/components`      |
|   Translations    | `data/languages.json` |

## License

This project is licensed under GPLv3. For the entire license see [LICENSE](/LICENSE).

Before you make changes to the code, please keep the following in mind:

* The data is [licensed separately][data_license].
* Attribution is required if you use this project as a template for your own website.
* The initial contents of [LICENSE](/LICENSE) must still be included in distributions and forks but we allow (and
  encourage) you to prepend your own copyright and GPLv3-compatible license for changes you make.

For a more information on what is and isn't allowed under a GPLv3 license, see
this [guide][gplv3_guide].

[cf_dash]: https://dash.cloudflare.com/?to=/:account/workers-and-pages/create/pages
[cf_pages]: https://pages.cloudflare.com/
[data_repo]: https://github.com/2factorauth/twofactorauth.git
[data_license]: https://github.com/2factorauth/twofactorauth/blob/master/LICENSE.md
[editorconfig]: https://editorconfig.org/
[gplv3_guide]: https://www.gnu.org/licenses/quick-guide-gplv3.html
[localhost]: http://127.0.0.1:1313/
[website]: https://2fa.directory/
[screenshot]: https://i.imgur.com/4WvIsg0.png
