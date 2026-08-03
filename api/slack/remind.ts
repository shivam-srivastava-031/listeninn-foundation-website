// api/slack/remind.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';
import fetch from 'node-fetch';

/**
 * Admin endpoint to trigger reminders.
 * Looks up members who do not have recorded interactive clicks in `engagement_events`
 * for a specific post and resends their customized DM.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { post_id } = req.body;
  if (!post_id) return res.status(400).json({ error: 'Missing post_id' });

  // 1. Fetch Post details
  const { data: post, error: postError } = await supabase
    .from('engagement_posts')
    .select('*')
    .eq('id', post_id)
    .single();

  if (postError || !post) return res.status(404).json({ error: 'Post not found' });

  // 2. Fetch all generated comments for this post
  const { data: generatedComments, error: gcError } = await supabase
    .from('generated_comments')
    .select('*, member:engagement_members(slack_user_id)')
    .eq('post_id', post_id);

  if (gcError || !generatedComments) return res.status(500).json({ error: 'Failed to fetch comments' });

  // 3. Fetch engagement events for this post
  const { data: events, error: evError } = await supabase
    .from('engagement_events')
    .select('member_id')
    .eq('post_id', post_id);
  
  if (evError) return res.status(500).json({ error: 'Failed to fetch events' });

  // Set of member IDs who have already interacted
  const interactedMemberIds = new Set(events.map((e: any) => e.member_id));

  const slackToken = process.env.SLACK_BOT_TOKEN;
  let sentCount = 0;

  if (slackToken) {
    for (const comment of generatedComments) {
      if (interactedMemberIds.has(comment.member_id)) continue;
      
      const slackUserId = (comment.member as any)?.slack_user_id;
      if (!slackUserId) continue;

      const blocks = [
        {
          "type": "section",
          "text": { "type": "mrkdwn", "text": `*Reminder: New ${post.platform} Post!* We haven't seen your engagement yet:\n<${post.url}|View Post>` }
        },
        {
          "type": "section",
          "text": { "type": "mrkdwn", "text": `*Suggested Comment:*\n> ${comment.comment_text}` }
        },
        {
          "type": "actions",
          "elements": [
            {
              "type": "button",
              "text": { "type": "plain_text", "text": "✅ Done: Liked", "emoji": true },
              "value": `LIKE_${post.id}`,
              "action_id": "action_liked_remind"
            },
            {
              "type": "button",
              "text": { "type": "plain_text", "text": "💬 Done: Commented", "emoji": true },
              "value": `COMMENT_${post.id}`,
              "action_id": "action_commented_remind"
            },
            {
              "type": "button",
              "text": { "type": "plain_text", "text": "🔄 Done: Reshared", "emoji": true },
              "value": `RESHARE_${post.id}`,
              "action_id": "action_reshared_remind"
            }
          ]
        }
      ];

      try {
        await fetch('https://slack.com/api/chat.postMessage', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${slackToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ channel: slackUserId, blocks, text: 'Friendly reminder to engage with the latest post!' })
        });
        sentCount++;
        await new Promise(r => setTimeout(r, 1000));
      } catch (err) {
        console.error('Slack reminder DM failed for member', slackUserId);
      }
    }
  }

  res.status(200).json({ success: true, reminders_sent: sentCount });
}
