# 🤖 BugToByte Academy v2

## Stack
- **Frontend**: React + TypeScript + Vite + Framer Motion
- **Backend**:  Node.js + Express + TypeScript
- **Database**: Supabase (PostgreSQL + RLS + Realtime)
- **Auth**:     Supabase Auth (Email + Google OAuth)
- **Payments**: Stripe
- **Emails**:   Nodemailer (Gmail)

---

## 📁 Structure
```
bugtobyte-v2/
├── supabase/
│   └── schema.sql          ← Run once in Supabase SQL Editor
├── backend/
│   ├── src/
│   │   ├── server.ts
│   │   ├── routes/
│   │   │   ├── bookings.ts
│   │   │   └── contact.ts
│   │   └── lib/
│   │       ├── supabase.ts
│   │       └── email.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── App.tsx
    │   ├── main.tsx
    │   ├── lib/supabase.ts
    │   ├── contexts/AuthContext.tsx
    │   ├── hooks/
    │   │   ├── useAvailability.ts  ← Real-time slot watcher
    │   │   └── useBookings.ts
    │   ├── components/
    │   │   └── Navbar.tsx
    │   └── pages/
    │       ├── Home.tsx     ← Framer Motion landing page
    │       ├── About.tsx
    │       ├── Contact.tsx
    │       ├── Auth.tsx     ← Email + Google login
    │       ├── Booking.tsx  ← Real-time calendar
    │       └── Dashboard.tsx
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    └── .env.example
```

---

## ⚡ Quick Start

### Step 1 — Set up Supabase
1. Create a project at supabase.com (free tier is fine)
2. Go to **SQL Editor** and paste/run the entire `supabase/schema.sql` file
3. Go to **Authentication → Providers → Google** and enable it:
   - Add your Google OAuth Client ID & Secret
   - (Get these from console.cloud.google.com → Create OAuth 2.0 credentials)
   - Set the redirect URL to: `https://your-project.supabase.co/auth/v1/callback`

### Step 2 — Frontend
```bash
cd frontend
npm install
cp .env.example .env
```
Fill in `.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key    # from Project Settings → API
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...  # optional
```
Run:
```bash
npm run dev
```
→ Open http://localhost:3000

### Step 3 — Backend
```bash
cd backend
npm install
cp .env.example .env
```
Fill in `.env`:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # from Project Settings → API
SMTP_USER=your@gmail.com
SMTP_PASS=your_gmail_app_password
CLIENT_ORIGIN=http://localhost:3000
```
Run:
```bash
npm run dev
```
→ API at http://localhost:5000

---

## 🔑 Supabase Keys Explained
| Key | Where to use |
|-----|-------------|
| `anon` public key | Frontend VITE_SUPABASE_ANON_KEY — safe to expose |
| `service_role` key | Backend only — NEVER expose to browser |

---

## 🔐 Enable Google OAuth
1. Supabase Dashboard → Authentication → Providers → Google → Enable
2. Create OAuth credentials at https://console.cloud.google.com:
   - Authorized redirect URI: `https://<project>.supabase.co/auth/v1/callback`
3. Paste Client ID and Secret into Supabase
4. Add your domain to Supabase → URL Configuration → Site URL & Redirect URLs

---

## 📧 Gmail App Password
1. Google Account → Security → 2-Step Verification → App Passwords
2. Create one for "Mail"
3. Paste the 16-char password as SMTP_PASS

---

## 🚀 Deploy
| Service | What it runs |
|---------|-------------|
| Vercel  | Frontend (zero config, just point to /frontend) |
| Railway | Backend Node.js + auto-detect TypeScript |
| Supabase | DB + Auth (already hosted!) |

Remember to:
- Update `CLIENT_ORIGIN` in backend .env to your Vercel URL
- Add your production domain to Supabase → URL Configuration
- Switch Stripe to live keys

---

## ✨ Key Features
- **Real-time calendar**: Supabase Realtime subscription means if another parent books a slot, it instantly disappears from your calendar view — no page refresh needed.
- **Conflict-proof bookings**: PostgreSQL UNIQUE constraint on (appt_date, time_slot) means it's physically impossible to double-book at the DB level.
- **Row Level Security**: Parents can only see/edit their own bookings. Public can only read active courses. All enforced at the database level.
- **Auto-profile creation**: When a user signs up (email or Google), a trigger auto-creates their profile row.
- **Framer Motion**: Staggered hero reveals, scroll-triggered section animations, magnetic buttons, floating code snippets.
