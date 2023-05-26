import axios from "axios";
import * as cheerio from "cheerio";

let DEBUG = false;
if (process.env.DEBUG == "true") {
  DEBUG = true;
}

/**
 * Fetches HTML markup from url.
 * @param {string} url - URL of the target website.
 * @returns {string} Markup data.
 */
export async function getMarkup(url) {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.error(error.message || error.toString());
  }
}

/**
 * Scrapes posts from page markup.
 * @param {string} pageName - Name of the page being scraped.
 * @param {string} pageMarkup - Markup to be scraped.
 * @returns {object} Scraped data.
 */
export function scrapePosts(pageName, pageMarkup) {
  DEBUG && console.log(`Scraping ${pageName}...\n===============`);

  const $ = cheerio.load(pageMarkup);
  const yesterdaysDate = new Date(Date.now() - 1000 * 60 * 60 * 24);
  // Reset hours, minutes, and seconds to zero because we only have yyyy-mm-dd to compare
  yesterdaysDate.setUTCHours(0, 0, 0);
  DEBUG && console.log(`yesterdaysDate: ${yesterdaysDate}\n`);

  let pageData = { name: pageName, posts: [] };

  // select all HTML elements that contain post data
  // (selector based on the state of https://ucg.ac.me/etf on 5.4.2023.)
  let $postsMarkup = $("#content > div > div > .row:not(:first) > div");
  // DEBUG && console.log($postsMarkup);

  // get each post's date, title, link, and subject
  $postsMarkup.each((_idx, el) => {
    DEBUG && console.log("Scraping post...\n-----------------");
    let date = $(el).prop("innerText").trim().split("\n")[0].slice(-10);
    DEBUG && console.log(`date: ${date}\n`);
    /* sometimes posts won't have dates at all and so the 'date' variable will just be empty
     * this causes problems since we filter for posts made in the last 24h by their dates
     */
    // if post date is not valid, set it to "DATE MISSING", and push the post data to the returned object
    if (!/\d/.test(date)) {
      date = "DATE MISSING";
      let title = $("div > h5 > a", el).text().trim();
      let link = "https://www.ucg.ac.me".concat($("h5 > a", el).attr("href"));
      let subject = $(el).prop("innerText").trim().split("\n")[0].trim();
      pageData.posts.push({ title, date, link, subject });
    } else {
      let dateArr = date.split(".").map((item) => parseInt(item));
      // Date sets hours, minutes, and seconds to zero if not explicitly declared
      let dateObj = new Date(dateArr[2], dateArr[1] - 1, dateArr[0]);
      // Normalize hours to equate with yesterdaysDate
      dateObj.setHours(3, 0, 0);
      DEBUG && console.log(`dateObj: ${dateObj}\n`);

      // if the post is newer than 24h, grab its data and push it to the returned object
      if (dateObj >= yesterdaysDate) {
        DEBUG &&
          console.log(
            "Post is newer than 24h, grab its data and push it to the returned object"
          );
        let title = $("h5 > a", el).text().trim();
        let link = "https://www.ucg.ac.me".concat($("h5 > a", el).attr("href"));
        let subject = $(el)
          .prop("innerText")
          .trim()
          .split("\n")[0]
          .slice(0, -10)
          .trimEnd();
        pageData.posts.push({ title, date, link, subject });
      }
    }
  });
  return pageData;
}
