import mailchimp from "@mailchimp/mailchimp_marketing";

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_API_SERVER, // e.g. us1
});

export default async (req, res) => {
  const id = req.query.id;

  if (req.method === "POST") {
    const { plain_text } = req.body;
    console.log(plain_text);

    try {
      const response = await mailchimp.campaigns.setContent(id, { plain_text });

      return res.status(201).json(response);
    } catch (error) {
      return res.status(500).json(response);
    }
  }

  try {
    const response = await mailchimp.campaigns.getContent(id);

    return res.status(201).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message || error.toString() });
  }
};
