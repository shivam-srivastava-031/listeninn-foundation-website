// api/slack/process-post.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';
import fetch from 'node-fetch';
import { LinkedInAdapter } from '../lib/adapters/LinkedInAdapter';
import { XAdapter } from '../lib/adapters/XAdapter';
import { InstagramAdapter } from '../lib/adapters/InstagramAdapter';
import { PlatformAdapter } from '../lib/adapters/PlatformAdapter';

const adapters: Record<string, PlatformAdapter> = {
  linkedin: new LinkedInAdapter(),
  x: new XAdapter(),
  instagram: new InstagramAdapter(),
};

/**
 * Background worker triggered by QStash.
 * Scrapes metadata, calls Gemini, and sends Slack DMs.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { post_id } = req.body;
  if (!post_id) return res.status(400).json({ error: 'Missing post_id' });

  // 1. Fetch Post & Members
  const { data: post, error: postError } = await supabase
    .from('engagement_posts')
    .select('*')
    .eq('id', post_id)
    .single();

  if (postError || !post) return res.status(404).json({ error: 'Post not found' });

  const { data: members, error: memError } = await supabase
    .from('engagement_members')
    .select('*')
    .eq('is_active', true);

  if (memError || !members || members.length === 0) {
    return res.status(400).json({ error: 'No active members found' });
  }

  const adapter = adapters[post.platform];
  if (!adapter) return res.status(400).json({ error: 'Unsupported platform' });

  // 2. Fetch & Parse Metadata
  let content = post.content;
  if (!content) {
    try {
      const response = await fetch(post.url);
      const html = await response.text();
      const meta = adapter.parseMetadata(post.url, html);
      content = meta.description || meta.title || '';

      if (content) {
        await supabase.from('engagement_posts').update({ content }).eq('id', post.id);
      }
    } catch (e) {
      console.error('Scraping error:', e);
    }
  }

  // 2b. Scraper Blocked Fallback
  if (!content) {
    await supabase.from('engagement_posts').update({ status: 'WAITING_FOR_TEXT' }).eq('id', post.id);
    
    // Alert admin in Slack thread
    const slackToken = process.env.SLACK_BOT_TOKEN;
    if (slackToken) {
      const reply = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${slackToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          channel: post.slack_channel_id,
          thread_ts: post.slack_message_ts,
          text: "I couldn't read this post automatically. Please reply in this thread with the post text so I can generate the comments!"
        })
      });
      const slackRes: any = await reply.json();
      if (slackRes.ts) {
        await supabase.from('engagement_posts').update({ slack_thread_ts: slackRes.ts }).eq('id', post.id);
      }
    }
    return res.status(200).json({ status: 'waiting_for_text' });
  }

  // 3. Generate AI Comments
  await supabase.from('engagement_posts').update({ status: 'GENERATING' }).eq('id', post.id);

  const geminiKey = process.env.GEMINI_API_KEY;
  const geminiModel = process.env.GEMINI_MODEL || "gemini-1.5-flash-latest"; // Make sure to use 1.5 flash

  const personas = members.map(m => `Member ${m.id} (${m.name}): ${m.persona || 'Team member'}`).join('\n');
  const prompt = `
  ${adapter.getPromptGuide()}
  
  Post Content: "${content}"
  
  We have the following team members:
  ${personas}
  
  Generate a personalized, unique comment and a reshare text for each member. 
  Output strictly valid JSON with no markdown wrapping, in this exact format:
  [
    {
      "member_id": "uuid",
      "comment_text": "...",
      "reshare_text": "..."
    }
  ]
  `;

  let aiData;
  try {
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": geminiKey! },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { 
            temperature: 0.7, 
            responseMimeType: "application/json" 
          },
        }),
      }
    );
    
    if (!upstream.ok) throw new Error('Gemini API failed');
    const result: any = await upstream.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    aiData = JSON.parse(text);
  } catch (err: any) {
    await supabase.from('engagement_posts').update({ status: 'FAILED' }).eq('id', post.id);
    await supabase.from('engagement_jobs').insert({
      post_id: post.id, status: 'FAILED', error_message: err.message || 'Gemini error'
    });
    return res.status(500).json({ error: 'AI generation failed' });
  }

  // 4. Store Results
  const commentsToInsert = aiData.map((d: any) => ({
    post_id: post.id,
    member_id: d.member_id,
    comment_text: d.comment_text,
    reshare_text: d.reshare_text
  }));

  const { error: insertError } = await supabase.from('generated_comments').insert(commentsToInsert);
  if (insertError) {
    return res.status(500).json({ error: 'Failed to insert comments' });
  }

  // 5. Dispatch DMs
  const slackToken = process.env.SLACK_BOT_TOKEN;
  let successCount = 0;
  
  if (slackToken) {
    for (const comment of aiData) {
      const member = members.find(m => m.id === comment.member_id);
      if (!member || !member.slack_user_id) continue;

      const blocks = [
        {
          "type": "section",
          "text": { "type": "mrkdwn", "text": `*New ${post.platform} Post!* Please engage:\n<${post.url}|View Post>` }
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
              "action_id": "action_liked"
            },
            {
              "type": "button",
              "text": { "type": "plain_text", "text": "💬 Done: Commented", "emoji": true },
              "value": `COMMENT_${post.id}`,
              "action_id": "action_commented"
            },
            {
              "type": "button",
              "text": { "type": "plain_text", "text": "🔄 Done: Reshared", "emoji": true },
              "value": `RESHARE_${post.id}`,
              "action_id": "action_reshared"
            }
          ]
        }
      ];

      try {
        await fetch('https://slack.com/api/chat.postMessage', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${slackToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ channel: member.slack_user_id, blocks, text: 'New post to engage with!' })
        });
        successCount++;
        // Throttle slightly
        await new Promise(r => setTimeout(r, 1000));
      } catch (err) {
        console.error('Slack DM failed for member', member.slack_user_id);
      }
    }
  }

  await supabase.from('engagement_posts').update({ status: 'SENT' }).eq('id', post.id);
  await supabase.from('engagement_jobs').insert({
    post_id: post.id, status: 'SENT', attempts: 1
  });

  res.status(200).json({ success: true, dms_sent: successCount });
}
