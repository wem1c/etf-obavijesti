// IMPORTS
const axios = require("axios").default;
const cheerio = require("cheerio");

// GLOBAL VARIABLES
const PAGES = [
  {
    name: "vijesti",
    url: "https://www.ucg.ac.me/objave_spisak/blog/1267",
  },
  {
    name: "obavjestenja",
    url: "https://www.ucg.ac.me/objave_spisak/blog/1269",
  },
  {
    name: "obavZaPredmete",
    url: "https://www.ucg.ac.me/objave_spisak/poslao/fakultet/2",
  },
  {
    name: "obavRukovodilaca",
    url: "https://www.ucg.ac.me/objave_spisak/poslao/rukovodioci/2",
  },
];

/** FUNCTION DEFINITIONS */

function crawlPage(pageName, pageHTML, lastRunDateObj) {
  const $ = cheerio.load(pageHTML);
  let pageData = { name: pageName, posts: [] };
  if (pageName === "vijesti" || pageName === "obavjestenja") {
    posts = $("#content > div > div > div:nth-child(3) > div");
    posts.each((_idx, el) => {
      let date = $(el).prop("innerText").trim().split("\n")[0].slice(-10);
      let dateArr = date.split(".").map((item) => parseInt(item));
      let dateObj = new Date(
        dateArr[2],
        dateArr[1] - 1,
        dateArr[0],
        23,
        59,
        59
      );
      if (dateObj >= lastRunDateObj) {
        let title = $("h5 > a", el).text().trim();
        let link = "https://www.ucg.ac.me".concat($("h5 > a", el).attr("href"));
        pageData.posts.push({ title, date, link });
      }
    });

    return pageData;
  } else {
    posts = $("#content > div > div > div:nth-child(4) > div");
    posts.each((_idx, el) => {
      let date = $(el).prop("innerText").trim().split("\n")[0].slice(-10);
      if (!/\d/.test(date)) {
        date = "DATE MISSING";
        let title = $("div > h5 > a", el).text().trim();
        let link = "https://www.ucg.ac.me".concat($("h5 > a", el).attr("href"));
        let subject = $(el).prop("innerText").trim().split("\n")[0].trim();
        pageData.posts.push({ title, date, link, subject });
      } else {
        let dateArr = date.split(".").map((item) => parseInt(item));
        let dateObj = new Date(
          dateArr[2],
          dateArr[1] - 1,
          dateArr[0],
          23,
          59,
          59
        );
        if (dateObj >= lastRunDateObj) {
          let title = $("div > h5 > a", el).text().trim();
          let link = "https://www.ucg.ac.me".concat(
            $("h5 > a", el).attr("href")
          );
          let subject = $(el)
            .prop("innerText")
            .trim()
            .split("\n")[0]
            .slice(0, -10)
            .trim();
          pageData.posts.push({ title, date, link, subject });
        }
      }
    });

    return pageData;
  }
}

async function scrapeData(pageName, pageURL, lastRunDateObj) {
  try {
    const { data } = await axios.get(pageURL);
    const pageData = crawlPage(pageName, data, lastRunDateObj);
    return pageData;
  } catch (error) {
    console.error("Error: ", error);
  }
}

async function app() {
  let data = { pages: [] };
  for (let page of PAGES) {
    let pageData = await scrapeData(page["name"], page["url"], lastRunDateObj);
    data.pages.push(pageData);
  }
}

app();
