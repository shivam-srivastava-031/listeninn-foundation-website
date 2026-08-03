// api/slack/sync.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';
import fetch from 'node-fetch';

/**
 * Sync endpoint (called by Vercel Cron).
 * Fetches Slack workspace users and syncs them into `engagement_members`.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow manual invocation via POST or cron GET
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).end();

  const slackToken = process.env.SLACK_BOT_TOKEN;
  if (!slackToken) return res.status(500).json({ error: 'Missing SLACK_BOT_TOKEN' });

  try {
    const response = await fetch('https://slack.com/api/users.list', {
      headers: { 'Authorization': `Bearer ${slackToken}` }
    });
    
    const data: any = await response.json();
    if (!data.ok) throw new Error(data.error);

    const members = data.members.filter((m: any) => !m.deleted && !m.is_bot && m.id !== 'USLACKBOT');
    
    for (const member of members) {
      const profile = member.profile;
      
      await supabase.from('engagement_members').upsert({
        slack_user_id: member.id,
        name: member.name,
        real_name: profile.real_name,
        display_name: profile.display_name,
        title: profile.title,
        timezone: member.tz,
        is_active: true
      }, { onConflict: 'slack_user_id' });
    }

    res.status(200).json({ success: true, synced: members.length });
  } catch (error: any) {
    console.error('Slack sync error:', error);
    res.status(500).json({ error: 'Sync failed', details: error.message });
  }
}
