import crypto from 'crypto';
import type { NextApiRequest } from 'next';

/**
 * Validates the Slack request signature according to Slack's signing secret.
 *
 * @param req - The incoming request (Next.js API handler compatible).
 * @param signingSecret - Your Slack app's signing secret.
 * @returns true if the signature is valid, false otherwise.
 */
export function validateSlackSignature(req: NextApiRequest, signingSecret: string): boolean {
  const timestamp = req.headers['x-slack-request-timestamp'];
  const signature = req.headers['x-slack-signature'];

  if (!timestamp || !signature || Array.isArray(timestamp) || Array.isArray(signature)) {
    return false;
  }

  // Prevent replay attacks – reject requests older than 5 minutes.
  const fiveMinutes = 60 * 5;
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - Number(timestamp)) > fiveMinutes) {
    return false;
  }

  const baseString = `v0:${timestamp}:${req.body}`;
  const hmac = crypto.createHmac('sha256', signingSecret);
  hmac.update(baseString, 'utf8');
  const mySignature = `v0=${hmac.digest('hex')}`;

  // Use constant-time comparison to avoid timing attacks.
  const isValid = crypto.timingSafeEqual(Buffer.from(mySignature), Buffer.from(signature as string));
  return isValid;
}
