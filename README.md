# MannSetu - Mental Health Support Platform for Universities

A comprehensive mental health and counseling management platform for university students, built with React, TypeScript, and Supabase.

## Features

- **Multi-Role System** — Students, Counselors, and Institute Admins
- **Session Booking** — Students can book 30-min counseling sessions with available counselors
- **Mental Health Assessments** — PHQ-9 (depression) and GAD-7 (anxiety) screenings
- **Mood Tracking** — Daily mood logging with notes
- **AI Chatbot (MannMitra)** — Gemini-powered empathetic mental health assistant
- **Peer Support Forums** — Institute-scoped discussion forums with anonymous posting
- **Resource Hub** — Articles, videos, and audio for mental wellness
- **Voice AI Support** — Vapi-powered voice assistant integration
- **Institute Dashboard** — Analytics, counselor management, student overview

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **UI:** shadcn/ui, Radix UI, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **AI:** Google Gemini 2.0 Flash, Vapi AI (voice)
- **State:** TanStack React Query
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts

## Getting Started

### Prerequisites

- Node.js & npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- A Supabase project ([create one](https://supabase.com/dashboard))
- Supabase CLI (`npm install -g supabase`)

### Setup

```sh
# 1. Clone the repository
git clone <YOUR_GIT_URL>
cd MannSetu-Manual-1

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Create a .env file with:
VITE_SUPABASE_PROJECT_ID="<your-project-id>"
VITE_SUPABASE_PUBLISHABLE_KEY="<your-anon-key>"
VITE_SUPABASE_URL="https://<your-project-id>.supabase.co"
VITE_VAPI_PUBLIC_KEY="<your-vapi-key>"
VITE_VAPI_ASSISTANT_ID="<your-vapi-assistant-id>"

# 4. Link Supabase CLI to your project
npx supabase link --project-ref <your-project-id>

# 5. Push database schema (creates all tables, functions, RLS policies)
npx supabase db push

# 6. Deploy the AI chatbot edge function
npx supabase functions deploy generate-ai-response --no-verify-jwt

# 7. Set the Gemini API key for the chatbot
npx supabase secrets set GEMINI_API_KEY=<your-gemini-api-key>

# 8. Start the dev server
npm run dev
```

### Manual Setup Steps (Supabase Dashboard)

1. **Storage:** Create a public bucket named `institute-verification-documents`
2. **Auth:** Ensure the Email provider is enabled under Authentication > Providers

## Seed Data / Test Accounts

The database comes with seed data for testing. All accounts use password: **`password123`**

### Institutes

| Email | Institute |
|-------|-----------|
| delhi.tech@example.com | Delhi Technical University |
| mumbai.uni@example.com | Mumbai National Institute |

### Counselors

| Email | Name | Institute |
|-------|------|-----------|
| dr.sharma@example.com | Dr. Priya Sharma | Delhi Technical University |
| dr.patel@example.com | Dr. Rajesh Patel | Delhi Technical University |
| dr.gupta@example.com | Dr. Neha Gupta | Mumbai National Institute |

### Students

| Email | Name | Institute |
|-------|------|-----------|
| aarav.kumar@example.com | Aarav Kumar | Delhi Technical University |
| meera.singh@example.com | Meera Singh | Delhi Technical University |
| rohan.desai@example.com | Rohan Desai | Mumbai National Institute |
| ananya.joshi@example.com | Ananya Joshi | Mumbai National Institute |

### Seeded Content

- 4 forums (Exam Stress, Wellness, First-Year Adjustment, Career Anxiety)
- 5 forum posts with replies
- Mood entries, PHQ-9 & GAD-7 test results
- Counselor availability schedules (Mon-Fri)
- Student reminders
- 4 mental health resources (articles, video, audio)

## Database Schema

21 tables including: `profiles`, `institutes`, `students`, `counselors`, `bookings`, `time_slots`, `counselor_availability`, `session_records`, `phq_tests`, `gad_7_tests`, `mood_entries`, `forums`, `forum_posts`, `forum_replies`, `forum_likes`, `forum_post_reactions`, `chat_history`, `reminders`, `resources`, `audit_logs`, `availability_slots`

All tables have Row Level Security (RLS) policies enforcing role-based access.

## Project Structure

```
src/
  components/ui/       # shadcn-ui components
  contexts/            # AuthContext
  hooks/               # useStudentData, useBookingSystem, useCounselorData, etc.
  integrations/supabase/ # Supabase client & generated types
  pages/
    auth/              # Login & Signup
    student/           # Student dashboard, chatbot, bookings, assessments
    counselor/         # Counselor dashboard, records
    institute/         # Institute admin, counselor management, analytics
    dashboards/        # Role-specific dashboards
supabase/
  functions/           # Edge functions (generate-ai-response)
  migrations/          # SQL schema & seed data
```

## Scripts

```sh
npm run dev        # Start dev server (port 8080)
npm run build      # Production build
npm run lint       # Run ESLint
npm run preview    # Preview production build
```
