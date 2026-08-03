// api/slack/events.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { validateSlackSignature } from '../lib/slack-crypto';
import { supabase } from '@/lib/supabaseClient'; // Assumes supabase client export
import fetch from 'node-fetch';

/**
 * Slack Event Subscription endpoint.
 * Receives events from Slack (e.g., message posted in monitored channel).
 * Validates request signature, stores the post, and enqueues a background job.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const signingSecret = process.env.SLACK_SIGNING_SECRET;
  if (!signingSecret) return res.status(500).json({ error: 'Missing SLACK_SIGNING_SECRET' });

  if (!validateSlackSignature(req, signingSecret)) {
    return res.status(401).json({ error: 'Invalid Slack signature' });
  }

  const payload = req.body;
  // URL verification challenge (when Slack initially registers the endpoint)
  if (payload.type === 'url_verification') {
    return res.status(200).json({ challenge: payload.challenge });
  }

  // Only handle message events from the designated channel
  if (payload.event && payload.event.type === 'message' && !payload.event.subtype) {
    const { channel, text, ts, user } = payload.event;
    const urlMatch = text?.match(/https?:\/\/[^\s]+/);
    if (!urlMatch) return res.status(200).end(); // Not a URL post, ignore

    const url = urlMatch[0];
    const platform = url.includes('linkedin.com') ? 'linkedin' : url.includes('twitter.com') || url.includes('x.com') ? 'x' : 'instagram';

    // Insert post record
    const { data: post, error } = await supabase.from('engagement_posts').insert({
      platform,
      url,
      slack_thread_ts: '', // Will be set after thread creation if needed
      slack_channel_id: channel,
      slack_message_ts: ts,
      submitted_by: user,
    }).single();

    if (error) {
      console.error('DB insert error', error);
      return res.status(500).json({ error: 'DB error' });
    }

    // Enqueue background job via Upstash QStash (simple HTTP POST)
    const qstashUrl = process.env.QSTASH_URL; // e.g., https://qstash.upstash.io/v1/publish/<topic>
    const qstashToken = process.env.QSTASH_TOKEN;
    if (qstashUrl && qstashToken) {
      await fetch(qstashUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${qstashToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ post_id: post.id }),
      });
    }
  }

  // Respond quickly to avoid Slack timeout
  res.status(200).end();
}
