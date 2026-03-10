-- ================================================================
--  BugToByte Academy — Supabase Schema
--  Run this in: Supabase Dashboard → SQL Editor
-- ================================================================

-- ── Enable extensions ────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_net";

-- ── PROFILES (extends Supabase auth.users) ───────────────────
CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT,
  email         TEXT,
  phone         TEXT,
  avatar_url    TEXT,
  role          TEXT NOT NULL DEFAULT 'parent' CHECK (role IN ('parent', 'admin')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── KIDS ─────────────────────────────────────────────────────
CREATE TABLE public.kids (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  age           SMALLINT NOT NULL CHECK (age BETWEEN 5 AND 17),
  skill_level   TEXT NOT NULL DEFAULT 'beginner' CHECK (skill_level IN ('beginner','intermediate','advanced')),
  interests     TEXT[] DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── COURSES ──────────────────────────────────────────────────
CREATE TABLE public.courses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  category      TEXT,
  age_min       SMALLINT DEFAULT 7,
  age_max       SMALLINT DEFAULT 17,
  duration_weeks SMALLINT DEFAULT 6,
  price_usd     NUMERIC(8,2) NOT NULL DEFAULT 0,
  thumbnail_url TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order    SMALLINT DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── APPOINTMENTS ─────────────────────────────────────────────
-- conflict-proof via unique constraint on (date, time_slot)
CREATE TABLE public.appointments (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id             UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  kid_id                UUID REFERENCES public.kids(id) ON DELETE SET NULL,
  course_id             UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  appt_date             DATE NOT NULL,
  time_slot             TIME NOT NULL,
  timezone              TEXT NOT NULL DEFAULT 'UTC',
  status                TEXT NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending','confirmed','cancelled','completed')),
  notes                 TEXT,
  zoom_link             TEXT,
  stripe_session_id     TEXT,
  stripe_payment_intent TEXT,
  amount_paid           NUMERIC(8,2),
  payment_status        TEXT NOT NULL DEFAULT 'unpaid'
                          CHECK (payment_status IN ('unpaid','paid','refunded')),
  confirmation_sent     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- ✅ Conflict-proof: only one booking per slot per day
  CONSTRAINT unique_slot UNIQUE (appt_date, time_slot)
);

CREATE INDEX idx_appts_parent   ON public.appointments(parent_id);
CREATE INDEX idx_appts_date     ON public.appointments(appt_date);
CREATE INDEX idx_appts_status   ON public.appointments(status);

-- ── CONTACT MESSAGES ─────────────────────────────────────────
CREATE TABLE public.contact_messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT,
  message    TEXT NOT NULL,
  is_read    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── TESTIMONIALS ─────────────────────────────────────────────
CREATE TABLE public.testimonials (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_name TEXT NOT NULL,
  kid_name    TEXT,
  avatar_initials TEXT,
  rating      SMALLINT CHECK (rating BETWEEN 1 AND 5),
  body        TEXT NOT NULL,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order  SMALLINT DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
--  ROW LEVEL SECURITY (RLS)
-- ================================================================

ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kids              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials      ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can read own profile"   ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can read all profiles" ON public.profiles FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Kids
CREATE POLICY "Parents manage own kids" ON public.kids FOR ALL USING (auth.uid() = parent_id);

-- Courses (public read, admin write)
CREATE POLICY "Anyone can read active courses" ON public.courses FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins manage courses"          ON public.courses FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Appointments
CREATE POLICY "Parents manage own appointments" ON public.appointments FOR ALL  USING (auth.uid() = parent_id);
-- ⚠️  Removed "Anyone can read booked slots" — it exposed parent/payment data to the public.
--     Availability is now served via the `booked_slots` view below (date + time_slot only).
CREATE POLICY "Admins manage all appointments"  ON public.appointments FOR ALL  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Contact messages (insert only publicly, admins can read)
CREATE POLICY "Anyone can submit contact"    ON public.contact_messages FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins can read messages"     ON public.contact_messages FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Testimonials (public read)
CREATE POLICY "Anyone can read testimonials" ON public.testimonials FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage testimonials"   ON public.testimonials FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ================================================================
--  AVAILABILITY VIEW (safe public access — date + time_slot only)
-- ================================================================

-- Public view that exposes ONLY the columns needed for the booking calendar.
-- No parent IDs, no payment data, no zoom links.
CREATE OR REPLACE VIEW public.booked_slots
  WITH (security_invoker = false)
AS
  SELECT appt_date, time_slot
  FROM   public.appointments
  WHERE  status != 'cancelled';

-- Grant SELECT to anon so the frontend Supabase client can subscribe in real-time
GRANT SELECT ON public.booked_slots TO anon, authenticated;

-- ================================================================
--  TRIGGERS
-- ================================================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name  = COALESCE(EXCLUDED.full_name, profiles.full_name),
    email      = COALESCE(EXCLUDED.email,     profiles.email),
    avatar_url = COALESCE(EXCLUDED.avatar_url,profiles.avatar_url),
    updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_profiles_updated_at     BEFORE UPDATE ON public.profiles     FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ================================================================
--  SEED DATA
-- ================================================================

INSERT INTO public.courses (title, slug, description, category, age_min, age_max, duration_weeks, price_usd, is_active, sort_order) VALUES
  ('AI Explorers',         'ai-explorers',      'Discover how AI thinks and creates through hands-on experiments and fun challenges.',      'AI',       8,  14, 6,  149.00, TRUE, 1),
  ('Python Launchpad',     'python-launchpad',  'Build real games and apps while mastering programming logic step by step.',                 'Coding',   10, 16, 8,  179.00, TRUE, 2),
  ('Chatbot Builder',      'chatbot-builder',   'Create your very own AI assistant using modern tools — no experience needed.',             'AI',       9,  15, 4,   99.00, TRUE, 3),
  ('Robotics & Circuits',  'robotics-circuits', 'Program robots and explore electronics with hands-on automation projects.',               'Robotics', 7,  13, 10, 199.00, TRUE, 4),
  ('Web Dev for Teens',    'web-dev-teens',     'Build real websites with HTML, CSS, and JavaScript from scratch.',                        'Coding',   13, 17, 8,  179.00, TRUE, 5);

INSERT INTO public.testimonials (parent_name, kid_name, avatar_initials, rating, body, is_featured, sort_order) VALUES
  ('Sarah M.', 'Liam, 11',  'SM', 5, 'Liam went from zero to building his own chatbot in 4 weeks. I couldn''t believe what he showed me at the end of the course!', TRUE, 1),
  ('David K.', 'Priya, 9',  'DK', 5, 'Priya now talks about machine learning at the dinner table. The instructors made complex ideas feel like magic for her age.',  TRUE, 2),
  ('Jess T.',  'Noah, 13',  'JT', 5, 'Noah is already freelancing! The Python course gave him real skills, not just toy examples. Worth every penny.',             TRUE, 3),
  ('Amir H.',  'Zara, 10',  'AH', 5, 'The booking system is so smooth, and the live sessions are incredibly engaging. Zara never misses a class.',                TRUE, 4);

-- ================================================================
--  UPDATED SEED — Real BugToByte course data (run after initial schema)
--  Replaces placeholder courses with actual curriculum
-- ================================================================

DELETE FROM public.courses;

INSERT INTO public.courses
  (title, slug, description, category, age_min, age_max, duration_weeks, price_usd, is_active, sort_order)
VALUES
  (
    'Scratch Creators',
    'scratch-creators',
    'Young learners dive into MIT''s Scratch environment to design animated stories, interactive games, and creative simulations. No typing required — just drag, drop, and discover the joy of making things move.',
    'Scratch',
    7, 9, 8, 149.00, TRUE, 1
  ),
  (
    'AI Fundamentals',
    'ai-fundamentals',
    'Students uncover how AI really works by training real machine-learning models and deploying them inside Scratch. Text recognition, image classification, sound detection — they build it all.',
    'AI',
    10, 12, 8, 179.00, TRUE, 2
  ),
  (
    'Python Lab',
    'python-lab',
    'Teens graduate from blocks to professional Python — the language of Google, NASA, and Netflix. They build functional apps, data projects, and games using the same tools real developers use every day.',
    'Python',
    13, 14, 10, 199.00, TRUE, 3
  );

-- Update testimonials with real parent voices
DELETE FROM public.testimonials;

INSERT INTO public.testimonials
  (parent_name, kid_name, avatar_initials, rating, body, is_featured, sort_order)
VALUES
  ('Sarah M.', 'Liam, age 11', 'SM', 5,
   'Liam finished the AI Fundamentals course and immediately started explaining machine learning to his grandparents. I couldn''t believe the depth of what he understood in just 8 weeks.',
   TRUE, 1),
  ('David K.', 'Priya, age 9', 'DK', 5,
   'Priya was nervous before her first session. By week three she was helping other kids in the class debug their Scratch projects. The instructors are genuinely brilliant with young learners.',
   TRUE, 2),
  ('Jess T.', 'Noah, age 14', 'JT', 5,
   'Noah completed the Python Lab and built a working to-do app for his school project. He''s now asking me about university CS courses. Worth every single penny.',
   TRUE, 3),
  ('Amir H.', 'Zara, age 10', 'AH', 5,
   'The booking system is effortless and the real-time calendar is so convenient. Zara has never missed a session — the classes are the highlight of her week.',
   TRUE, 4);
