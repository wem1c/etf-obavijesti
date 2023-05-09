import { getMarkup, scrapePosts } from "../../lib/scraper";
import { pageData } from "../../data/targetPages";

export default async function handler(req, res) {
  if (req.method === "GET") {
    let posts = { pages: [] };
    try {
      for (let page of pageData) {
        let pageMarkup = await getMarkup(page["url"]);
        let pageData = scrapePosts(page["name"], pageMarkup);
        posts.pages.push(pageData);
      }
      return res.status(201).json(posts);
    } catch (error) {
      return res.status(500).json({ error: error.message || error.toString() });
    }
  }

  return res.status(405).send("Method Not Allowed");
}
