import mailchimp from "@mailchimp/mailchimp_marketing";

// Configure Mailchimp's API client
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_API_SERVER,
});

/**
 * Upon receiving an internal request, sets the content of a Mailchimp campaign.
 *
 * Requires the campaign's ID to be passed in the request's query, as well as the
 * content in the request's body.
 *
 * @param {object} req An instance of http.IncomingMessage, plus some pre-built middlewares
 * @param {object} res An instance of http.ServerResponse, plus some helper functions
 */
export default async function handler(req, res) {
  // Pull the campaign ID from the query string
  const id = req.query.id;

  // If the request is not internal, decline
  if (!req.headers["authorization"]) {
    return res.status(400).json({ error: "Missing header 'authorization'." });
  }
  const reqAuth = req.headers["authorization"];
  const secretKey = process.env.FAMILY_SECRET;
  if (reqAuth !== `Bearer ${secretKey}`) {
    return res.status(401).json({ error: "Invalid authorization." });
  }

  // Only accept POST requests
  if (req.method === "POST") {
    // Pull the campaign content from the request body
    const { plain_text } = req.body;

    try {
      const response = await mailchimp.campaigns.setContent(id, { plain_text });

      return res.status(201).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message || error.toString() });
    }
  }

  return res.status(405).send("Method Not Allowed");
}
