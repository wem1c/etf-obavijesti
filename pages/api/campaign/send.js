import mailchimp from "@mailchimp/mailchimp_marketing";

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_API_SERVER,
});

export default async (req, res) => {
  const id = req.query.id;

  try {
    const response = await mailchimp.campaigns.send(id);

    return res.status(201).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || error.toString(), ...response });
  }
};
