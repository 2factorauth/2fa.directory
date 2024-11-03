<h1 align="center">2FA Directory - Frontend</h1>

<p align="center">
<a href="https://twitter.com/2faorg/"><img src="https://img.shields.io/badge/X/Twitter-@2faorg-1DA1F2.svg?style=for-the-badge&logo=x"/></a>
<a href="https://infosec.exchange/@2factorauth"><img src="https://img.shields.io/badge/Mastodon-@2factorauth-6364FF?style=for-the-badge&logo=mastodon"/></a>
<a href="https://github.com/sponsors/2factorauth/"><img src="https://img.shields.io/github/sponsors/2factorauth?color=db61a2&logo=GitHub&style=for-the-badge"/></a>
</p>

<strong>[2FA Directory][website] is an open-source project that aims to improve online security by providing a directory of websites and services that support two-factor authentication (2FA). Our community-driven platform allows anyone to contribute to the list, making it the most comprehensive directory of its kind.</strong>

This repository contains the HTML, JavaScript and CSS for [2fa.directory][website].  
All data used to populate the categories is sourced from [2factorauth/twofactorauth][data_repo].

![][screenshot]

## Tech Stack

- **Frontend:** HTML, JavaScript, CSS
- **Frameworks & Libraries:** Preact, HTM
- **Hosting:** Cloudflare Pages

## Local Installation

To run the site locally, follow these steps:

1. **Ensure you have [Node.js][nodejs] installed** (Recommended version: 20.x or higher).
2. **Clone the repository:**
   ```bash
   git clone https://github.com/2factorauth/2fa.directory.git
   cd frontend
   ```
3. **Install NPM packages:**
   ```bash
   npm install
   ```
4. **Run the site locally:**
   ```bash
   npm run dev
   ```
   After running this command, the site will be accessible at [http://localhost:5173][localhost] (or another port if 5173 is taken).

> [!NOTE]
> The [region-redirection][functions] script does not run locally. You will therefore always be directed to
> the international page when using `npm run dev`.

## Publishing forks

If you’d like to deploy your own version of this site, you can use Cloudflare Pages to host it. Here’s how you can publish a fork of this repository:

1. **Log in to your Cloudflare [Dashboard][cf_dash]** and select "Pages."
2. **Create a new project** and select your fork as the source.
3. **Configure the build settings:**
   * **Framework preset:** `None`
   * **Build command:** `npm run build`
   * **Build output directory:** `dist`
4. **Deploy your project.** Once completed, your site will be live on Cloudflare Pages.

> [!TIP]
> Be sure to update the fork with any new changes from the main repository to keep your version up-to-date.

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

This project is licensed under the GPLv3. See [LICENSE][license] for the full text.

Before you make changes to the code, please keep the following in mind:

* **Data License:** The data is [licensed separately][data_license].
* **Attribution:** If you use this project as a template for your own website, attribution is required.
* **License Modifications:** The original contents of [LICENSE][license] must be retained in distributions and forks, but you are allowed (and encouraged) to prepend your own copyright and GPLv3-compatible license for any changes you make.

For more details on what is and isn't allowed under a GPLv3 license, see this [guide][gplv3_guide].

[cf_dash]: https://dash.cloudflare.com/?to=/:account/workers-and-pages/create/pages
[data_repo]: https://github.com/2factorauth/twofactorauth.git
[data_license]: https://github.com/2factorauth/twofactorauth/blob/master/LICENSE.md
[license]: /LICENSE
[localhost]: http://localhost:5173
[editorconfig]: https://editorconfig.org/
[gplv3_guide]: https://www.gnu.org/licenses/quick-guide-gplv3.html
[website]: https://2fa.directory/
[screenshot]: https://i.imgur.com/4WvIsg0.png
[nodejs]: https://nodejs.org/
[functions]: /functions/redirect.js
