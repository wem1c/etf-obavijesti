import mailchimp from "@mailchimp/mailchimp_marketing";

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_API_SERVER, // e.g. us1
});

export default async (req, res) => {
  const options = {
    type: "plaintext",
    recipients: { list_id: "9879b597cf" },
    settings: {
      subject_line: "UCG Obavijesti",
      title: "Test Campaign",
      from_name: "Conor",
      reply_to: "conorpetersondev@gmail.com",
    },
  };

  try {
    const response = await mailchimp.campaigns.create(options);

    return res.status(201).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || error.toString(), ...response });
  }
};
