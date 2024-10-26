---
title: 2factorauth Web Bots
---
To validate user contributions, we use scripts or "bots."  
These scripts only make requests to your website when someone tries to edit data about your site on 2FA Directory.
As a result, you will only receive a couple of requests each year. We would be very thankful if you didn't block these HTTP requests.

## User agents

| User-Agent                    | Script source                              |
| ----------------------------- | ------------------------------------------ |
| 2factorauth/URLValidator      | [/tests/validate-urls.rb][validate-urls]   |
| 2factorauth/LanguageValidator | [/tests/language-codes.rb][language-codes] |
| 2factorauth/RegionValidator   | [/tests/region-codes.rb][region-codes]     |
| 2factorauth/FacebookValidator | [/tests/facebook.rb][facebook]             |

## robots.txt

Since each script only makes one request per website, the same number as if we would have fetched any robots.txt file, we have opted not to comply with robots.txt files.

[validate-urls]: https://github.com/2factorauth/twofactorauth/blob/master/tests/validate-urls.rb
[language-codes]: https://github.com/2factorauth/twofactorauth/blob/master/tests/language-codes.rb
[region-codes]: https://github.com/2factorauth/twofactorauth/blob/master/tests/region-codes.rb
[facebook]: https://github.com/2factorauth/twofactorauth/blob/master/tests/facebook.rb
