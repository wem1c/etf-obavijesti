import { verifySignature } from "@upstash/qstash/nextjs";

/**
 * Upon receiving a POST request from Upstash, creates a new MailChimp campaign
 * and sends it.
 *
 * @param {object} req An instance of http.IncomingMessage, plus some pre-built middlewares
 * @param {object} res An instance of http.ServerResponse, plus some helper functions
 */
async function handler(req, res) {
  // Get secret key from env vars to prove that the request is internal
  const secretKey = process.env.FAMILY_SECRET;
  const authorization = `Bearer ${secretKey}`;

  try {
    // Get latest posts from ucg.ac.me/etf/ via GET request to "/api/posts"
    const posts = await fetch(`${process.env.ROOT_API_URL}posts/`);
    const postsJSON = await posts.json();

    // Generate the email body from the latest post data
    let emailBody = "";

    postsJSON.pages.forEach((page) => {
      emailBody += `# ${page.name.toUpperCase()}\n`;
      emailBody += `\n\n`.padStart(page.name.length + 4, "=");
      if (page.posts.length > 0) {
        page.posts.forEach((post) => {
          emailBody += `${post.subject}\n`;
          emailBody += `${post.title}\n`;
          emailBody += `${post.link}\n`;
          emailBody += `${post.date}\n\n`;
        });
        emailBody += `\n`;
      } else {
        emailBody += `Nema novih postova u posljednih 24h.\n\n\n`;
      }
    });

    // Create new campaign via GET request to "/api/campaign/create"
    const createCampaign = await fetch(
      `${process.env.ROOT_API_URL}campaign/create`,
      { headers: { Authorization: authorization } }
    );
    const createCampaignJSON = await createCampaign.json();

    // Pull the newly created campaign's ID from the response
    const campaignID = createCampaignJSON.id;

    // Set the content for the campaign via POST to "/api/campaign/content"
    const setCampaignContent = await fetch(
      `${process.env.ROOT_API_URL}campaign/content?id=${campaignID}`,
      {
        body: JSON.stringify({
          plain_text: emailBody,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
        },
        method: "POST",
      }
    );

    // Send the campaign via POST to "/api/campaign/send"
    const sendCampaign = await fetch(
      `${process.env.ROOT_API_URL}campaign/send?id=${campaignID}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
        },
        method: "POST",
      }
    );

    res
      .status(204)
      .send("Succesfully created, populated, and sent a new email campaign!");
  } catch (error) {
    return res.status(500).json({ error: error.message || error.toString() });
  }
}

/**
 * Wrap handler with `verifySignature` to automatically reject all
 * requests that are not coming from Upstash.
 */
export default verifySignature(handler);

/**
 * To verify the authenticity of the incoming request in the `verifySignature`
 * function, access to the raw request body is needed.
 */
export const config = {
  api: {
    bodyParser: false,
  },
};
