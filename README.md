# What is this?

A simple web scraper that grabs the latest news in the past 24 hours from [The University of Montenegro](https://www.ucg.ac.me/) and sends them via plaintext email. _For now it only scrapes The Faculty of Electrical Engineering._

The scraper itself is a JS scraper using [cheerio](https://cheerio.js.org/) and [axios](https://github.com/axios/axios).

The cron job that manages the scraper is actually controlled by [upstash](https://upstash.com/). Using upstash's Qstash, there's an HTTP request made to the web apps Next API at `/api/cron`. This endpoint handles the scraping via internal functions, and the creation and sending of a new Mailchimp campaing via Mailchimp's Node package.

The frontend holds a tiny newsletter subscription form.

# Tech used

- [Next.js](https://nextjs.org/)
- [Vercel](https://vercel.com/)
- [upstash](https://upstash.com/)
- [cheerio](https://cheerio.js.org/)
- [axios](https://github.com/axios/axios)
- [Mailchimp](https://mailchimp.com/)

# Development

## Prerequisites

- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)

## Installation

1. Clone this repository
2. Install dependencies via `npm install`
3. Run `npm run dev` to start the development server
4. Run `npm run build` to build the project
5. Run `npm run start` to start the local server

## Licence

The content of this project itself is licensed under the [Creative Commons Attribution 3.0 Unported license](https://creativecommons.org/licenses/by/3.0/), and the underlying source code used to format and display that content is licensed under the [MIT license](https://opensource.org/license/mit/).
