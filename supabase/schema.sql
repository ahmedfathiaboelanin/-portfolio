-- ============================================================
-- Portfolio CMS schema for Supabase (Postgres)
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Paste → Run
-- Then: Authentication → Users → Add user (your admin email/password)
-- Then: Storage → Create bucket `portfolio-images` (public)
-- ============================================================

-- Extensions
create extension if not exists "pgcrypto";

-- ── PROFILES (singleton hero / about) ───────────────────────
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null default 'Ahmed Fathi',
  role text not null default 'Frontend Developer',
  tagline text not null default 'Hello, I''m Ahmed — Frontend Developer',
  hero_title_line1 text not null default 'Building the future,',
  hero_title_line2 text not null default 'one line at a time',
  hero_description text not null default 'A passionate Frontend Developer with a knack for crafting engaging, fast and user-friendly web experiences.',
  years_exp text not null default '1+',
  projects_count text not null default '10+',
  clients_count text not null default '3+',
  email text not null default 'ahmedfathiaboelanin@gmail.com',
  resume_url text not null default 'Ahmed_Fathi.pdf',
  github_url text not null default 'https://github.com/ahmedfathiaboelanin',
  linkedin_url text not null default 'https://www.linkedin.com/in/ahmed-fathi-1a4593247/',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── PROJECTS ────────────────────────────────────────────────
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  image_url text not null default '',
  live_url text default '',
  code_url text default '',
  tech text[] not null default '{}',
  featured boolean not null default false,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── SKILLS ──────────────────────────────────────────────────
-- category: 'frontend' | 'backend' | 'tool'
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  percentage int not null default 80 check (percentage >= 0 and percentage <= 100),
  category text not null default 'frontend' check (category in ('frontend','backend','tool')),
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

-- ── SOCIALS ─────────────────────────────────────────────────
create table if not exists public.socials (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  icon text not null default 'github' -- github|linkedin|facebook|gmail|twitter|instagram|globe
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

-- ── MESSAGES (contact form inbox) ───────────────────────────
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ── SITE SETTINGS (flexible key/value) ──────────────────────
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ── Updated-at trigger ──────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_profiles_touch on public.profiles;
create trigger trg_profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_projects_touch on public.projects;
create trigger trg_projects_touch before update on public.projects
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_settings_touch on public.site_settings;
create trigger trg_settings_touch before update on public.site_settings
  for each row execute function public.touch_updated_at();

-- ── SEED (only if empty) ────────────────────────────────────
insert into public.profiles (full_name, role, tagline, hero_title_line1, hero_title_line2, hero_description, years_exp, projects_count, clients_count, email)
select 'Ahmed Fathi','Frontend Developer','Hello, I''m Ahmed — Frontend Developer','Building the future,','one line at a time','A passionate Frontend Developer with a knack for crafting engaging, fast and user-friendly web experiences.','1+','10+','3+','ahmedfathiaboelanin@gmail.com'
where not exists (select 1 from public.profiles);

insert into public.projects (title, description, image_url, live_url, code_url, tech, featured, sort_order) select * from (values
  ('Dar Al-Hoqooq','Dar Al-Hoqooq is a unified bilingual (Arabic / English) platform for company formation, legal and government services in Saudi Arabia.','daroflaw.png','https://daroflaw.com/','https://github.com/ahmedfathiaboelanin/',array['REACT JS','FRAMER MOTION','TAILWIND CSS','LARAVEL','MYSQL'],true,0),
  ('CAWEDHA','An online course platform that enables users to browse, enroll in, and manage educational content.','2.png','https://cawedha.vercel.app/','https://github.com/ahmedfathiaboelanin/Cawedha',array['NEXT JS','TAILWIND CSS','LARAVEL','MYSQL'],false,1),
  ('Supplements Shop','A modern e-commerce web application featuring product listings, cart and responsive UI.','supplements.png','https://demo-supplements-shop.vercel.app/','https://github.com/ahmedfathiaboelanin/Supplements-store',array['React','Vite','Tailwind css','Redux','TS'],false,2),
  ('FITNESS COACH','A Netflix-inspired streaming UI clone with modern design patterns and animations.','online-coach.png','https://mohammad-elsum.vercel.app/','https://github.com/ahmedfathiaboelanin/Fitness-Cooach',array['React','Tailwind','Vite'],false,3),
  ('TRANSRECIO','Neural acoustics turn your speech into perfectly punctuated text in real time — Arabic & English.','voice-text.png','http://voice-to-text-pied.vercel.app/','https://github.com/ahmedfathiaboelanin/voice-to-text',array['React','Vite','Tailwind css'],false,4),
  ('DASHBOARD','An interactive dashboard interface that visualizes data through structured layouts.','3.png','https://borsaa.vercel.app/','https://github.com/ahmedfathiaboelanin/Borsaa',array['REACT JS','ANT DESIGN'],false,5),
  ('SEO-Template','A fully responsive SEO-optimized website template.','5.png','https://ahmedfathiaboelanin.github.io/SEO-Template/','https://github.com/ahmedfathiaboelanin/SEO-Template',array['HTML','CSS','JS'],false,6)
) as v(title,description,image_url,live_url,code_url,tech,featured,sort_order)
where not exists (select 1 from public.projects);

insert into public.skills (title, percentage, category, sort_order) select * from (values
  ('HTML',95,'frontend',0),('CSS',90,'frontend',1),('JS',90,'frontend',2),('REACT JS',90,'frontend',3),('TAILWIND CSS',90,'frontend',4),('NEXT JS',80,'frontend',5),
  ('NODE JS',85,'backend',0),('EXPRESS JS',80,'backend',1),('MONGODB',80,'backend',2),('LARAVEL',80,'backend',3),('MYSQL',75,'backend',4),
  ('REACT ICONS',100,'tool',0),('ZUSTAND',100,'tool',1),('MONGOOSE',100,'tool',2),('JWT',100,'tool',3),('VS CODE',100,'tool',4),('POSTMAN',100,'tool',5),('XAMPP',100,'tool',6),('GIT',100,'tool',7)
) as v(title,percentage,category,sort_order)
where not exists (select 1 from public.skills);

insert into public.socials (label, href, icon, sort_order) select * from (values
  ('LinkedIn','https://www.linkedin.com/in/ahmed-fathi-1a4593247/','linkedin',0),
  ('GitHub','https://github.com/ahmedfathiaboelanin','github',1),
  ('Facebook','https://www.facebook.com/ahmed.fathi.912811','facebook',2)
) as v(label,href,icon,sort_order)
where not exists (select 1 from public.socials);

insert into public.site_settings (key, value) values
  ('general', '{"siteName":"Ahmed Fathi.","showStats":true,"contactEmail":"ahmedfathiaboelanin@gmail.com"}'::jsonb)
on conflict (key) do nothing;

-- ── ROW LEVEL SECURITY ──────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.skills enable row level security;
alter table public.socials enable row level security;
alter table public.messages enable row level security;
alter table public.site_settings enable row level security;

-- Drop existing policies (idempotent re-run)
drop policy if exists "public read profiles" on public.profiles;
drop policy if exists "auth write profiles" on public.profiles;
drop policy if exists "public read published projects" on public.projects;
drop policy if exists "auth write projects" on public.projects;
drop policy if exists "public read visible skills" on public.skills;
drop policy if exists "auth write skills" on public.skills;
drop policy if exists "public read visible socials" on public.socials;
drop policy if exists "auth write socials" on public.socials;
drop policy if exists "anon insert messages" on public.messages;
drop policy if exists "auth read messages" on public.messages;
drop policy if exists "auth write messages" on public.messages;
drop policy if exists "public read settings" on public.site_settings;
drop policy if exists "auth write settings" on public.site_settings;

-- Public (anon) can read published content
create policy "public read profiles"
  on public.profiles for select to anon, authenticated using (is_active = true);

create policy "public read published projects"
  on public.projects for select to anon, authenticated using (is_published = true);

create policy "public read visible skills"
  on public.skills for select to anon, authenticated using (is_visible = true);

create policy "public read visible socials"
  on public.socials for select to anon, authenticated using (is_visible = true);

create policy "public read settings"
  on public.site_settings for select to anon, authenticated using (true);

-- Contact form: anyone can insert, only admins read/update
create policy "anon insert messages"
  on public.messages for insert to anon, authenticated with check (true);

-- Admins (authenticated) have full write access
create policy "auth write profiles"
  on public.profiles for all to authenticated using (true) with check (true);

create policy "auth write projects"
  on public.projects for all to authenticated using (true) with check (true);

create policy "auth write skills"
  on public.skills for all to authenticated using (true) with check (true);

create policy "auth write socials"
  on public.socials for all to authenticated using (true) with check (true);

create policy "auth read messages"
  on public.messages for select to authenticated using (true);

create policy "auth write messages"
  on public.messages for update to authenticated using (true) with check (true);

create policy "auth write settings"
  on public.site_settings for all to authenticated using (true) with check (true);

-- Allow admins to delete messages
drop policy if exists "auth delete messages" on public.messages;
create policy "auth delete messages"
  on public.messages for delete to authenticated using (true);
