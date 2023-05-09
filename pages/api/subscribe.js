import mailchimp from "@mailchimp/mailchimp_marketing";

// Configure Mailchimp's API client
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_API_SERVER, // e.g. us1
});

/**
 * Upon receiving an internal request, add a new subscriber to the Mailchimp audience.
 *
 * Requires the subscribers email to be passed in the request's body.
 *
 * @param {object} req An instance of http.IncomingMessage, plus some pre-built middlewares
 * @param {object} res An instance of http.ServerResponse, plus some helper functions
 */
export default async function handler(req, res) {
  // If the request is not internal, decline
  if (req.headers["sec-fetch-site"] !== "same-origin") {
    return res.status(418).json({ error: "I'm a teapot" });
  }

  // Grab email from the request body
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email missing from request body." });
  }

  try {
    const response = await mailchimp.lists.addListMember(
      process.env.MAILCHIMP_AUDIENCE_ID,
      {
        email_address: email,
        status: "pending",
      }
    );

    return res.status(201).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message || error.toString() });
  }
}
