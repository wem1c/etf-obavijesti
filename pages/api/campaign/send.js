import mailchimp from "@mailchimp/mailchimp_marketing";

// Configure Mailchimp's API client
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_API_SERVER,
});

/**
 * Upon receiving an internal request, sends the Mailchimp campaign.
 *
 * Requires the campaign's ID to be passed in the request's query.
 *
 * @param {object} req An instance of http.IncomingMessage, plus some pre-built middlewares
 * @param {object} res An instance of http.ServerResponse, plus some helper functions
 */
export default async function handler(req, res) {
  // Pull the campaign's ID from the query string
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

  try {
    const response = await mailchimp.campaigns.send(id);

    return res.status(201).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message || error.toString() });
  }
}
