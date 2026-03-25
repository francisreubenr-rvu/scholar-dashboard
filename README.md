# Scholar Dashboard — Full-Stack Setup Guide
**Stack:** Next.js 14 · Supabase · Vercel  
**Time to deploy:** ~25 minutes

---

## What you're building

A cloud-synced academic dashboard with:
- **Google / Magic-link login** — sign in from any device
- **Today view** — date hero, stoic quote, next-up indicator, inline check-in
- **Week view** — browse any day's timetable + study plan
- **Check-in** — animated progress ring, per-task toggles, saved to cloud
- **Attendance tracker** — per-subject counters, 75% warning, colour-coded bars
- **Schedule editor** — add custom blocks to any day, stored in database
- **Theme toggle** — dark/light, synced to your account across devices

---

## PART 1 — Supabase (database + auth)

### Step 1 — Create a free Supabase account
1. Go to https://supabase.com → click **Start your project**
2. Sign up with GitHub (easiest) or email
3. Click **New project** and fill in:
   - **Project name:** scholar-dashboard
   - **Database password:** something strong — save this
   - **Region:** ap-south-1 Mumbai (closest to Bangalore)
4. Click **Create new project** — wait ~2 minutes

### Step 2 — Run the database schema
1. In Supabase dashboard → click **SQL Editor** in the left sidebar
2. Click **New query**
3. Open `supabase/migrations/001_schema.sql` from this project
4. Paste the entire file contents into the editor
5. Click **Run** ▶
6. You should see: `Success. No rows returned`

This creates all tables: profiles, attendance, checkins, schedule_blocks, preferences.

### Step 3 — Enable Google login (optional)
1. Supabase → **Authentication** → **Providers** → find Google → toggle on
2. Go to https://console.cloud.google.com → create a project
3. APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID
4. Application type: Web application
5. Authorised redirect URI: paste the callback URL shown on the Supabase Google page
   (looks like https://xxxx.supabase.co/auth/v1/callback)
6. Copy Client ID and Client Secret back into Supabase → Save

Skip this if you want — magic link email login works without it.

### Step 4 — Copy your API keys
1. Supabase → **Settings** → **API**
2. Copy:
   - **Project URL** (https://yourproject.supabase.co)
   - **anon public** key (long string starting with eyJ...)

---

## PART 2 — Local development

### Step 5 — Install Node.js
Go to https://nodejs.org → download the LTS version → install it.

Verify in terminal:
```
node --version
```
Should show v18 or v20.

### Step 6 — Set up the project
```bash
# Enter the project folder
cd scholar-dashboard

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
```

Open .env.local in any text editor and fill in your values:
```
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 7 — Run locally
```bash
npm run dev
```

Open http://localhost:3000 in your browser.
You should see the Scholar login page. Sign in with email (magic link).

---

## PART 3 — Deploy to Vercel (free, live URL)

### Step 8 — Push to GitHub
1. Create a free account at https://github.com
2. Create a new private repository called `scholar-dashboard`
3. In your terminal:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/scholar-dashboard.git
git push -u origin main
```

### Step 9 — Deploy on Vercel
1. Go to https://vercel.com → sign up with GitHub
2. Click **Add New Project** → import your `scholar-dashboard` repo
3. Before clicking Deploy, open **Environment Variables** and add:
   ```
   NEXT_PUBLIC_SUPABASE_URL      = (your Supabase URL)
   NEXT_PUBLIC_SUPABASE_ANON_KEY = (your Supabase anon key)
   ```
4. Click **Deploy**

After ~2 minutes you get a live URL like:
https://scholar-dashboard-yourname.vercel.app

### Step 10 — Update Supabase redirect URLs
1. Supabase → **Authentication** → **URL Configuration**
2. Add to Redirect URLs:
   ```
   https://scholar-dashboard-yourname.vercel.app/auth/callback
   http://localhost:3000/auth/callback
   ```
3. Save

Done. Your dashboard is live.

---

## Project structure

```
scholar-dashboard/
├── app/
│   ├── auth/                    Login page + OAuth callback
│   ├── dashboard/
│   │   ├── layout.tsx           Auth guard + nav wrapper (server)
│   │   ├── DashboardClient.tsx  Nav, theme toggle, sign out (client)
│   │   ├── page.tsx             Today view — fetches DB server-side
│   │   ├── TodayClient.tsx      Today view UI — handles interactions
│   │   ├── week/                Week view
│   │   ├── checkin/             Check-in with progress ring
│   │   ├── attendance/          Attendance tracker
│   │   └── editor/              Schedule block editor
│   ├── api/
│   │   ├── attendance/route.ts  POST: upsert counts
│   │   ├── checkin/route.ts     POST: upsert task done/not done
│   │   └── schedule/route.ts    POST: add block | DELETE: remove block
│   ├── globals.css              All styles — glass, palette, animations
│   └── layout.tsx               Root — Google fonts, html tag
├── components/
│   └── ScheduleBlock.tsx        Reusable coloured schedule card
├── lib/
│   ├── data.ts                  Schedule data, quotes, subjects, helpers
│   └── supabase/
│       ├── client.ts            Browser Supabase client
│       └── server.ts            Server Supabase client
├── middleware.ts                 Protects /dashboard, redirects to /auth
└── supabase/migrations/
    └── 001_schema.sql           Run this in Supabase SQL Editor
```

---

## How it all connects

```
Browser request
      ↓
middleware.ts  →  no session?  →  redirect to /auth
      ↓  (has session)
layout.tsx (server)  →  fetch user profile from Supabase
      ↓
page.tsx (server)  →  fetch attendance, checkins, blocks from Supabase
      ↓
TodayClient.tsx (client)  →  renders UI with server-fetched data
      ↓
User clicks checkbox
      ↓
supabase.from('checkins').upsert(...)  →  saves to DB instantly
```

---

## Multi-user — how it works

Row Level Security is already configured in the SQL migration.
Every student who signs up gets their own isolated data.
They cannot see or modify any other user's rows.

Share your Vercel URL with classmates — they sign up, get their own dashboard.

---

## Customising schedule data

All data is in `lib/data.ts`:
- `CTT` — college timetable per day (index 0 = Monday)
- `PSCHED` — personal study + life schedule per day
- `TASKS` — daily check-in tasks per day
- `SUBJECTS` — subject list with codes and credits
- `STOIC_QUOTES` — add more here, one per day cycles automatically

Edit the file, `git push`, Vercel auto-deploys in ~60 seconds.

---

## Troubleshooting

**"Invalid API key" on login**
Check .env.local — values must match Supabase exactly, no trailing spaces.

**Magic link email not arriving**
Check spam folder. Supabase sends from noreply@mail.supabase.io

**Stays stuck on /auth after clicking magic link**
The redirect URL must be added in Supabase → Authentication → URL Configuration.

**Vercel build fails**
Confirm both env vars are set in Vercel project settings → Environment Variables.

**Google login redirect error**
The URI in Google Cloud Console must match exactly what Supabase shows.

---

## What to build next

- **LeetCode tracker** — log problems, difficulty, topic per day
- **Coursera progress** — track % complete per certification  
- **Grade logger** — CIE marks per subject → auto projected CGPA
- **Study streak** — consecutive days of full check-in completion
- **Push notifications** — Vercel Cron + Web Push to remind before study blocks
- **Section leaderboard** — opt-in attendance/streak board for your classmates
