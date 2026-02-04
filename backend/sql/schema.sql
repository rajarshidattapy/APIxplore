-- SQL Schema for Policy-Aware AI API Explorer
-- Tables: api_specs, safety_verdicts, policies, user_profiles


-- User profiles (extends auth.users)
create table if not exists user_profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text,
    full_name text,
    avatar_url text,
    role text default 'user',
    api_usage_count integer default 0,
    last_active_at timestamptz,
    preferences jsonb default '{}',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

alter table user_profiles enable row level security;

create policy "Users can view own profile"
    on user_profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
    on user_profiles for update using (auth.uid() = id);
create policy "Users can insert own profile"
    on user_profiles for insert with check (auth.uid() = id);

    
-- API Specifications table
CREATE TABLE IF NOT EXISTS api_specs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    spec_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safety Verdicts table (audit log)
CREATE TABLE IF NOT EXISTS safety_verdicts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_spec_id UUID REFERENCES api_specs(id),
    user_intent TEXT,
    verdict_json JSONB,
    ui_contract_json JSONB,
    risk_score FLOAT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Policies table
CREATE TABLE IF NOT EXISTS policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_name TEXT,
    policy_json JSONB,
    version INT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
