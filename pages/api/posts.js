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

async function crawlPageHTML(pageName, pageHTML) {
  const $ = cheerio.load(pageHTML);
  const currentDate = new Date().toISOString();
  let pageData = { name: pageName, posts: [] };

  let posts = $("#content > div > div > .row > div");
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

      if (dateObj) {
        let title = $("h5 > a", el).text().trim();
        let link = "https://www.ucg.ac.me".concat($("h5 > a", el).attr("href"));
        pageData.posts.push({ title, date, link });
      }
    }
  });
  return pageData;
}

async function getPageHTML(pageURL) {
  try {
    const { data } = await axios.get(pageURL);
    return data;
  } catch (error) {
    return res.status(500).json({ error: error.message || error.toString() });
  }
}

export default async (req, res) => {
  let posts = { pages: [] };
  try {
    for (let page of PAGES) {
      let pageHTML = await getPageHTML(page["url"]);
      let pageData = await crawlPageHTML(page["name"], pageHTML);
      posts.pages.push(pageData);
    }

    return res.status(201).json(posts);
  } catch (error) {
    return res.status(500).json({ error: error.message || error.toString() });
  }
};
