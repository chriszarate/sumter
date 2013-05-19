Sumter
======

Sumter is a bookmarklet that sums up all the numbers in your text selection. It can also be embedded into pages. [**Try the demo!**](http://chriszarate.github.io/sumter/)

## Typical Use
I often find myself wishing I could quickly add up some numbers on a Web page without transferring them to a spreadsheet. The most common example is when I'm reading a credit card statement online:

| Date       | Description               | Amount  |
| ---------- | ------------------------- | -------:|
| 03/01/2013 | B&H DAIRY LUNCH           |  $12.49 |
| 02/28/2013 | MTA VENDING               | $104.00 |
| 02/26/2013 | AMAZON WEB SERVICES       |   $0.25 |
| 02/26/2013 | ABC BEER CO               |  $18.17 |
| 02/20/2013 | MUJI                      |  $25.11 |
| 02/18/2013 | PRET A MANGER             |   $6.93 |
| 02/17/2013 | ASSOCIATED SUPERMARKET    |  $40.72 |
| 02/03/2013 | NETFLIX.COM               |   $7.99 |
| 01/30/2013 | UTRECHT ART SUPPLIES      |  $19.40 |

I'd really like to know how much I spent in February. Sumter lets me highlight the numbers I'm interested in and a total is displayed in the upper right-hand corner of the page.

## Multiple Currencies

Sumter can also handle select other currencies (detection is improving) and raw numbers. It will keep the totals separate.

| Dollar $  | Pound £  | Euro €   | Yen ¥    | Raw      |
| ---------:| --------:| --------:| --------:| --------:|
|    $23.04 |      £34 |   €12.75 |     700¥ |    3,478 |
|    $17.89 |     £15. |  €352.10 |   ¥1,200 |     1883 |
|     $3.51 |   £32.50 |   €25.63 |     235¥ |    23.14 |

It adds each total together for a grand total but doesn't convert currencies.

## No Dependencies
Sumter is plain JavaScript and does not require any libraries. It should work in most modern browsers.

## Issues
Sumter is new. Let me know how it can be improved by [opening an issue](https://github.com/chriszarate/sumter/issues).

## License
This is free software. It is released to the public domain without warranty.
