import { verifySignature } from "@upstash/qstash/nextjs";

async function handler(req, res) {
  try {
    const raw = await fetch("https://google.com");

    res.send("OK");
  } catch (err) {
    res.status(500).send(err);
  } finally {
    res.end();
  }
}

/**
 * Wrap your handler with `verifySignature` to automatically reject all
 * requests that are not coming from Upstash.
 */
export default verifySignature(handler);

/**
 * To verify the authenticity of the incoming request in the `verifySignature`
 * function, we need access to the raw request body.
 */
export const config = {
  api: {
    bodyParser: false,
  },
};
