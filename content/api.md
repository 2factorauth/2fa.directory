---
title: API usage
---
## Introduction

The data collected for the [2FA Directory][site_url] website is also available as JSON files for developers to use in their programs.

## Supported versions

The table below provides the End of Life (EOL) dates for different 2FA Directory API versions. Please refer to this table to ensure you are using a supported version.

|     Version      |          Supported           |
|:----------------:|:----------------------------:|
| [Version 4](#v4) |             Yes              |
| [Version 3](#v3) |             Yes              |
| [Version 2](#v2) | Unsupported since 2023-08-01 |
| [Version 1](#v1) | Unsupported since 2023-07-01 |

## Things to note

When using the 2FA Directory data, there are a few important considerations to keep in mind to ensure compliance and optimal performance.

#### Attribution

The data for the 2FA Directory is licensed under an [MIT license][license] which requires attribution when using the data.
If the data collected from the 2FA Directory is visible to your users, please provide attribution. This helps acknowledge the source and supports the ongoing maintenance of the directory.  
At a minimum, please include the following attribution:

> Data sourced from [2FA Directory][site_url] by [2factorauth][repo_url].

#### Caching

It is advisable to cache the files locally to avoid potential service interruptions, especially if you intend to query our JSON files frequently or generate significant traffic. Cloudflare, our reverse proxy provider, may block excessive traffic, so local caching ensures your access remains uninterrupted and reduces server load.

#### Avoid downloading unnecessary data

It is recommended that you download only the specific datasets you need to maximize efficiency and minimize data transfer. For example, if you only require information about sites supporting TOTP (RFC-6238), use the URI that lists only those sites. This approach conserves bandwidth and accelerates data processing.

#### Signed Files

All JSON files provided by the 2FA Directory are also available as PGP-signed files. These files are signed by 2factorauth to ensure their integrity and authenticity. Using signed files allows you to verify that the data has not been tampered with and is indeed from 2factorauth.

The public key used for signing is published as a CERT record on `security.2fa.directory`. In the event that the GitHub repository, domain name, or build process is compromised, the key will be missing or revoked.

## FAQ

### How often is the data updated?

Changes to the data are reflected within a minute of being made on the GitHub repository. The frequency of changes in the GitHub repository varies from several per day to a few per week.

### How do I verify the PGP signatures?

Using GPG, you can download the public key of our signing key.

```bash
gpg --auto-key-locate cert --locate-keys security@2fa.directory
```

You can then verify a `.json.sig`-file using:

```bash
gpg --verify <file>.sig <file>
```

## Version 4 {#v4}

Version 4 of the 2FA Directory JSON files focuses on only outputting data relevant to third-party applications.
We have removed elements such as service names, icon paths, and service categories.

### URIs

The following JSON files are available for Version 4, each serving different 2FA methods and data requirements.

| Coverage                    | Unsigned File                                      | PGP Signed File                                            |
|-----------------------------|----------------------------------------------------|------------------------------------------------------------|
| All sites                   | [v4/all.json][v4/all.json]                         | [v4/all.json.sig][v4/all.json.sig]                         |
| SMS 2FA                     | [v4/sms.json][v4/sms.json]                         | [v4/sms.json.sig][v4/sms.json.sig]                         |
| Email 2FA                   | [v4/email.json][v4/email.json]                     | [v4/email.json.sig][v4/email.json.sig]                     |
| Non-U2F hardware 2FA tokens | [v4/custom-hardware.json][v4/custom-hardware.json] | [v4/custom-hardware.json.sig][v4/custom-hardware.json.sig] |
| U2F hardware tokens         | [v4/u2f.json][v4/u2f.json]                         | [v4/u2f.json.sig][v4/u2f.json.sig]                         |
| TOTP (RFC-6238)             | [v4/totp.json][v4/totp.json]                       | [v4/totp.json.sig][v4/totp.json.sig]                       |
| Non-RFC-6238 software 2FA   | [v4/custom-software.json][v4/custom-software.json] | [v4/custom-software.json.sig][v4/custom-software.json.sig] |

### Elements

The JSON files contain various elements that provide detailed information about the 2FA implementations of different sites.
The availability of the elements depends on their presence in the source data.

| Key             | Type           | Description                                                                                                               |
|-----------------|----------------|---------------------------------------------------------------------------------------------------------------------------|
| methods         | Array\<String> | Array containing all supported 2FA methods                                                                                |
| documentation   | URL            | URL to documentation page                                                                                                 |
| recovery        | URL            | URL to recovery documentation page                                                                                        |
| notes           | String         | Text describing any discrepancies in the 2FA implementation                                                               |
| custom-hardware | Array\<String> | Array of custom hardware methods that the site supports. Only present if the `methods` element contains "custom-hardware" |
| custom-software | Array\<String> | Array of custom software methods that the site supports. Only present if the `methods` element contains "custom-software" |

### Examples

Below are examples of what an entry can look like in API version 4.

#### Example website with 2FA enabled

```JSON
{
  "example.com": {
    "methods": [
      "sms",
      "call",
      "email",
      "totp",
      "u2f",
      "custom-software",
      "custom-hardware"
    ],
    "custom-software": [
      "Authy"
    ],
    "documentation": "<link to site TFA documentation>",
    "recovery": "<link to site TFA recovery documentation>"
  }
}
```

#### Example website with 2FA disabled

```JSON
{
  "example.com": {}
}
```

## Version 3 {#v3}

### URIs

| Coverage                    | Unsigned File                                      | PGP Signed File                                            |
|-----------------------------|----------------------------------------------------|------------------------------------------------------------|
| All sites                   | [v3/all.json][v3/all.json]                         | [v3/all.json.sig][v3/all.json.sig]                         |
| All 2FA-supporting sites    | [v3/tfa.json][v3/tfa.json]                         | [v3/tfa.json.sig][v3/tfa.json.sig]                         |
| SMS                         | [v3/sms.json][v3/sms.json]                         | [v3/sms.json.sig][v3/sms.json.sig]                         |
| Phone calls                 | [v3/call.json][v3/call.json]                       | [v3/call.json.sig][v3/call.json.sig]                       |
| Email 2FA                   | [v3/email.json][v3/email.json]                     | [v3/email.json.sig][v3/email.json.sig]                     |
| non-U2F hardware 2FA tokens | [v3/custom-hardware.json][v3/custom-hardware.json] | [v3/custom-hardware.json.sig][v3/custom-hardware.json.sig] |
| U2F hardware tokens         | [v3/u2f.json][v3/u2f.json]                         | [v3/u2f.json.sig][v3/u2f.json.sig]                         |
| RFC-6238 (TOTP)             | [v3/totp.json][v3/totp.json]                       | [v3/totp.json.sig][v3/totp.json.sig]                       |
| non-RFC-6238 software 2FA   | [v3/custom-software.json][v3/custom-software.json] | [v3/custom-software.json.sig][v3/custom-software.json.sig] |

### Elements

| Key                         | Value Type            |   Always Defined   | Description                                                                                                                                                                                             |
|-----------------------------|-----------------------|:------------------:|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| domain                      | <define>FQDN</define> | :heavy_check_mark: | The domain name of the service                                                                                                                                                                          |
| img                         | String                |                    | Image name used. If this is not defined, the image name is `domain`.svg                                                                                                                                 |
| url                         | URL                   |                    | URL of the site. If this is not defined, the url is https://`domain`                                                                                                                                    |
| tfa                         | Array\<String>        |                    | Array containing all supported 2FA methods                                                                                                                                                              |
| documentation               | URL                   |                    | URL to documentation page                                                                                                                                                                               |
| recovery                    | URL                   |                    | URL to recovery documentation page                                                                                                                                                                      |
| notes                       | String                |                    | Text describing any discrepancies in the 2FA implementation                                                                                                                                             |
| contact                     | Object                |                    | Object containing contact details. See table below for elements                                                                                                                                         |
| regions                     | Array\<String>        |                    | Array containing ISO 3166-1 country codes of the regions in which the site is available. If the site is available everywhere apart from a specific region, that region will be prefixed by a `-` symbol |
| additional-domains          | Array\<hostname>      |                    | Array of domains that the site exists at in addition to the main domain listed in the `domain` field.                                                                                                   |
| custom-(software\|hardware) | Array\<String>        |                    | Array of custom software/hardware methods that the site supports. Only present if the `tfa` element contains one of these 2FA types                                                                     |
| keywords                    | Array\<String>        | :heavy_check_mark: | Array of categories to which the site belongs                                                                                                                                                           |

#### Contact Object Elements
| Key      | Value  | Always Defined | Description                                                            |
|----------|--------|:--------------:|------------------------------------------------------------------------|
| twitter  | String |                | Twitter handle                                                         |
| facebook | String |                | Facebook page name                                                     |
| email    | String |                | Email address to support                                               |
| form     | String |                | Support contact form                                                   |
| language | String |                | Lowercase ISO 639-1 language code for the site if it is not in English |

### Example website with 2FA enabled

```JSON
[
  [
    "Site Name",
    {
      "domain": "example.com",
      "additional-domains": [
        "example.net"
      ],
      "tfa": [
        "sms",
        "call",
        "email",
        "totp",
        "u2f",
        "custom-software",
        "custom-hardware"
      ],
      "custom-software": [
        "Authy"
      ],
      "documentation": "<link to site TFA documentation>",
      "recovery": "<link to site TFA recovery documentation>",
      "keywords": [
        "keyword1",
        "keyword2"
      ]
    }
  ]
]
```

### Example website with 2FA disabled

```JSON
[
  [
    "Site Name", 
    {
      "domain": "example.com",
      "contact": {
        "twitter": "example",
        "facebook": "example",
        "email": "example@example.com"
      },
      "keywords": [
        "keyword1",
        "keyword2"
      ]
    }
  ]
]
```

## Version 2 {#v2}

API version 2 is no longer available. Please upgrade to a [supported version](#supported-versions).

## Version 1 {#v1}

API version 1 is no longer available. Please upgrade to a [supported version](#supported-versions).

[license]: https://github.com/2factorauth/twofactorauth/blob/master/LICENSE.md
[site_url]: https://2fa.directory/
[repo_url]: https://github.com/2factorauth/
[v3/all.json]: https://api.2fa.directory/v3/all.json
[v3/all.json.sig]: https://api.2fa.directory/v3/all.json.sig
[v3/tfa.json]: https://api.2fa.directory/v3/tfa.json
[v3/tfa.json.sig]: https://api.2fa.directory/v3/tfa.json.sig
[v3/sms.json]: https://api.2fa.directory/v3/sms.json
[v3/sms.json.sig]: https://api.2fa.directory/v3/sms.json.sig
[v3/call.json]: https://api.2fa.directory/v3/call.json
[v3/call.json.sig]: https://api.2fa.directory/v3/call.json.sig
[v3/email.json]: https://api.2fa.directory/v3/email.json
[v3/email.json.sig]: https://api.2fa.directory/v3/email.json.sig
[v3/custom-hardware.json]: https://api.2fa.directory/v3/custom-hardware.json
[v3/custom-hardware.json.sig]: https://api.2fa.directory/v3/custom-hardware.json.sig
[v3/u2f.json]: https://api.2fa.directory/v3/u2f.json
[v3/u2f.json.sig]: https://api.2fa.directory/v3/u2f.json.sig
[v3/totp.json]: https://api.2fa.directory/v3/totp.json
[v3/totp.json.sig]: https://api.2fa.directory/v3/totp.json.sig
[v3/custom-software.json]: https://api.2fa.directory/v3/custom-software.json
[v3/custom-software.json.sig]: https://api.2fa.directory/v3/custom-software.json.sig
[v4/all.json]: https://api.2fa.directory/v4/all.json
[v4/all.json.sig]: https://api.2fa.directory/v4/all.json.sig
[v4/sms.json]: https://api.2fa.directory/v4/sms.json
[v4/sms.json.sig]: https://api.2fa.directory/v4/sms.json.sig
[v4/email.json]: https://api.2fa.directory/v4/email.json
[v4/email.json.sig]: https://api.2fa.directory/v4/email.json.sig
[v4/custom-hardware.json]: https://api.2fa.directory/v4/custom-hardware.json
[v4/custom-hardware.json.sig]: https://api.2fa.directory/v4/custom-hardware.json.sig
[v4/u2f.json]: https://api.2fa.directory/v4/u2f.json
[v4/u2f.json.sig]: https://api.2fa.directory/v4/u2f.json.sig
[v4/totp.json]: https://api.2fa.directory/v4/totp.json
[v4/totp.json.sig]: https://api.2fa.directory/v4/totp.json.sig
[v4/custom-software.json]: https://api.2fa.directory/v4/custom-software.json
[v4/custom-software.json.sig]: https://api.2fa.directory/v4/custom-software.json.sig
