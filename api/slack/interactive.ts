// api/slack/interactive.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

/**
 * Handles Slack interactive components (button clicks in DMs).
 * Parses the payload, identifies the action (LIKE, COMMENT, RESHARE),
 * and logs it in the engagement_events table.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  // Slack sends interactive payloads as URL-encoded form data.
  // The JSON payload is stored in the `payload` field.
  const payloadStr = req.body.payload;
  if (!payloadStr) return res.status(400).end();

  let payload;
  try {
    payload = JSON.parse(payloadStr);
  } catch (e) {
    return res.status(400).end();
  }

  // We only care about block actions (button clicks)
  if (payload.type !== 'block_actions' || !payload.actions || payload.actions.length === 0) {
    return res.status(200).end();
  }

  const action = payload.actions[0];
  const value = action.value; // Expected format: TYPE_POSTID (e.g. LIKE_uuid)
  const slackUserId = payload.user.id;

  if (!value || !value.includes('_')) return res.status(200).end();

  const [type, postId] = value.split('_');

  // Find the member id by slack_user_id
  const { data: member } = await supabase
    .from('engagement_members')
    .select('id')
    .eq('slack_user_id', slackUserId)
    .single();

  if (member && postId) {
    // Upsert into engagement_events (on conflict ignore due to unique constraint)
    const { error } = await supabase.from('engagement_events').upsert(
      {
        post_id: postId,
        member_id: member.id,
        type: type.toUpperCase(), // LIKE, COMMENT, RESHARE
      },
      { onConflict: 'post_id, member_id, type' }
    );
    
    if (error) {
      console.error('Error logging event:', error);
    }
  }

  // Respond 200 OK immediately to close the Slack interaction gracefully
  res.status(200).end();
}
