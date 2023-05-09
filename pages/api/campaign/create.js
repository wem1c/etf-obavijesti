import mailchimp from "@mailchimp/mailchimp_marketing";

// Configure Mailchimp's API client
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_API_SERVER,
});

/**
 * Upon receiving an internal request, creates a new email campaign via Mailchimp's API
 *
 * @param {object} req An instance of http.IncomingMessage, plus some pre-built middlewares
 * @param {object} res An instance of http.ServerResponse, plus some helper functions
 */
export default async function handler(req, res) {
  // Set options for MailChimp's campaign create API
  const options = {
    type: "plaintext",
    recipients: { list_id: process.env.MAILCHIMP_AUDIENCE_ID },
    settings: {
      subject_line: "ETF Obavijesti",
      title: "Dnevne Obavijesti",
      from_name: "Conor C. Peterson",
      reply_to: "conorpetersondev@gmail.com",
    },
    tracking: {
      opens: false,
      html_clicks: false,
      text_clicks: false,
    },
  };

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
    const response = await mailchimp.campaigns.create(options);

    return res.status(201).send(response);
  } catch (error) {
    return res.status(500).json({ error: error.message || error.toString() });
  }
}
