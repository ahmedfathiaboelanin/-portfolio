# Supabase setup (5 min)

## 1. Create project
1. Go to https://supabase.com → New project
2. Settings → API → copy **Project URL** + **anon public** key

## 2. Env
```bash
cp .env.example .env
# fill VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY, then:
npm run dev
```

## 3. Database
Supabase Dashboard → SQL Editor → New query → paste entire `schema.sql` → Run.
This creates: `profiles`, `projects`, `skills`, `socials`, `messages`, `site_settings` + RLS + seed data.

## 4. Admin user (Supabase Auth)
Authentication → Users → Add user → Email + password (e.g. you@example.com).
Sign in at `/admin/login`.

## 5. Image uploads (optional)
Storage → New bucket → name `portfolio-images` → **Public: ON**.
Dashboard → Projects → Upload image stores here automatically. You can also paste any image URL.

## How it works
- Public site (`/`) reads published rows; if Supabase is empty/unconfigured it falls back to bundled constants so the site never breaks.
- `/admin` requires Supabase Auth session; RLS allows anon read + anon insert into `messages` only.
- Contact form writes to `messages` inbox AND opens the visitor's mail app.

## Deploy (Vercel/Netlify)
Add the same two env vars in the host dashboard and redeploy. SPA routes `/admin` + `/admin/login` use react-router — on Vercel no extra config needed; on Netlify add a `_redirects`/`netlify.toml` rewrite to `/index.html` if you use it.
