# 40s Women Condition Coaching App MVP

This is an AI-powered daily coaching app tailored to 40s women.
It shifts from a simple logging app to a habit-forming service that gives pattern-based advice via OpenAI.

## Tech Stack
- Next.js 15 (App Router, Tailwind CSS)
- Supabase (Database)
- OpenAI API (gpt-4o-mini)
- Lucide React (Icons)

## Setup Instructions

1. **Database Setup**
   - Go to [Supabase](https://supabase.com/) and create a new project.
   - Open the SQL Editor and copy-paste the contents of `../supabase.sql` to create the tables and policies.

2. **Environment Variables**
   - Copy `.env.example` to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Fill in your `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `OPENAI_API_KEY`.

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Run Locally**
   ```bash
   npm run dev
   ```

## Key Features
- **Frictionless Onboarding**: Uses `device_id` saved in `localStorage` to identify the user immediately.
- **Pattern Analysis**: Fetches 3 days of past logs combined with today's metrics to prompt OpenAI for meaningful insights.
- **Action Checklist**: Rewards users with completion scores, driving engagement and building "streak days".
- **Premium Hook**: A blurred section at the end of the results page teases weekly pattern insights for monetization.
