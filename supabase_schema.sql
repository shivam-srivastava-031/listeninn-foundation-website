-- 1. Members Table (synchronized with Slack users)
create table if not exists engagement_members (
    id uuid primary key default gen_random_uuid(),
    slack_user_id text unique not null,
    name text not null,
    real_name text,
    display_name text,
    title text,            -- Scraped job title from Slack profile
    timezone text,         -- Scraped user timezone from Slack profile
    persona text default 'Active team member',
    is_active boolean default true not null,
    created_at timestamptz default now() not null
);

-- Index for fast lookups on Slack User ID
create index if not exists idx_engagement_members_slack_id on engagement_members(slack_user_id);

-- 2. Posts Table (social media URLs submitted via Slack channel)
create table if not exists engagement_posts (
    id uuid primary key default gen_random_uuid(),
    platform text not null check (platform in ('linkedin', 'x', 'instagram')),
    url text unique not null,
    content text,
    slack_thread_ts text,
    slack_channel_id text not null,
    slack_message_ts text not null,
    submitted_by text not null,
    status text default 'NEW' not null check (status in ('NEW', 'WAITING_FOR_TEXT', 'GENERATING', 'SENT', 'FAILED')),
    created_at timestamptz default now() not null
);

-- 3. Generated Comments Table (personalized comments/thoughts per member per post)
create table if not exists generated_comments (
    id uuid primary key default gen_random_uuid(),
    post_id uuid references engagement_posts(id) on delete cascade not null,
    member_id uuid references engagement_members(id) on delete cascade not null,
    comment_text text not null,
    reshare_text text,
    created_at timestamptz default now() not null,
    unique(post_id, member_id)
);

-- 4. Engagement Events Ledger Table (records user button clicks inside Slack)
create table if not exists engagement_events (
    id uuid primary key default gen_random_uuid(),
    post_id uuid references engagement_posts(id) on delete cascade not null,
    member_id uuid references engagement_members(id) on delete cascade not null,
    type text not null check (type in ('LIKE', 'COMMENT', 'RESHARE')),
    created_at timestamptz default now() not null,
    unique(post_id, member_id, type)  -- Deduplication check
);

-- 5. Jobs Table (monitoring, observability, and errors)
create table if not exists engagement_jobs (
    id uuid primary key default gen_random_uuid(),
    post_id uuid references engagement_posts(id) on delete cascade,
    status text not null check (status in ('NEW', 'WAITING_FOR_TEXT', 'GENERATING', 'SENT', 'FAILED')),
    attempts integer default 0 not null,
    error_message text,
    gemini_latency_ms integer,
    slack_latency_ms integer,
    tokens_used integer,
    started_at timestamptz default now() not null,
    finished_at timestamptz
);

-- Indexes for performance on aggregation queries
create index if not exists idx_engagement_events_post_member on engagement_events(post_id, member_id);
create index if not exists idx_engagement_jobs_post_id on engagement_jobs(post_id);
