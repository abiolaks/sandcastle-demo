# PRD: PrepWise AI – Smart Study Planner

## Problem Statement

Bootcamp students need a hands-on project to learn full-stack Next.js development, but typical tutorials are fragmented — they cover routing, APIs, databases, and AI integration in isolation. Students need a single cohesive project that connects all these pieces in 3 days, producing something they actually deployed and can show.

## Solution

PrepWise AI is a 3-day guided project where students build a smart study planner. They enter a subject, topics, hours per day, and an exam date. The app calls Groq's LLM API to generate a structured JSON study schedule, saves it to Supabase, and displays both the new plan and previously saved plans. The finished app is deployed to Vercel.

## User Stories

1. As a student, I want to enter my subject, topics, hours per day, and exam date into a form, so that I can describe what I need to study.
2. As a student, I want to click a "Generate Plan" button, so that I can receive a personalized study schedule.
3. As a student, I want to see a loading spinner while the AI generates my plan, so that I know the app is working.
4. As a student, I want the generated study plan displayed as a structured timeline (not raw JSON), so that I can easily follow it day by day.
5. As a student, I want the plan to use proven study techniques (spaced repetition, active recall), so that the schedule is actually effective.
6. As a student, I want my generated plan automatically saved to a database, so that I don't lose it when I close the app.
7. As a student, I want to view all my previously saved plans on a dedicated page, so that I can revisit past study schedules.
8. As a student, I want to see an error message if the AI generation fails, so that I know something went wrong instead of staring at a blank screen.
9. As a student, I want to deploy my finished app to a public URL, so that I can share it and prove I built something real.
10. As a student, I want each saved plan to show the subject, exam date, and a preview of the schedule, so that I can quickly identify which plan is which.
11. As a student, I want the app styled with Tailwind CSS and looking clean, so that it feels like a real product, not a tutorial exercise.

## Implementation Decisions

1. **Audience** — Bootcamp students with foundational JavaScript and React knowledge. No prior database or API experience assumed, but they can read documentation and follow instructions.

2. **Tech Stack** — Next.js (App Router), Tailwind CSS, Supabase (database only, no auth), Groq API (or any LLM API), Vercel (deployment).

3. **Database Schema** — Single table, no authentication. All plans are public and visible to everyone. This tradeoff is explicitly noted for students.
   ```
   plans
   ├── id (uuid, primary key)
   ├── subject (text)
   ├── topics (text)
   ├── exam_date (date)
   ├── hours_per_day (integer)
   ├── plan_content (jsonb) — the structured JSON from the LLM
   └── created_at (timestamp)
   ```

4. **LLM Output** — Structured JSON. The prompt template instructs the model to return a JSON object with a `schedule` array of `{ day, date, topic, task, technique }` objects. A recovery utility strips markdown fences and handles common JSON parsing edge cases.

5. **Prompt Strategy** — System prompt establishes the role ("expert study planner"), output format requirements, and study methodology. User prompt injects the form inputs: subject, topics, hours per day, exam date, and total days until exam.

6. **API Route** — A single POST route at `/api/generate/` accepts the form data, calls the Groq API with the structured prompt, parses the JSON response, stores the plan in Supabase, and returns the plan to the frontend.

7. **Deployment** — Vercel auto-detects Next.js on push to GitHub. Students must set three environment variables in the Vercel dashboard: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GROQ_API_KEY`. The brief includes an explicit env var checklist.

8. **Error & Loading States** — Loading spinner shown during plan generation. Error message displayed if the API call fails (network error, invalid API key, malformed JSON). No retry logic required; a simple "try again" message suffices.

9. **Submission Criteria** — Feature checklist with binary pass/fail items:
   - Form accepts and submits all four fields
   - LLM generates a valid JSON study plan
   - Plan is saved to Supabase
   - `/plans` page displays all saved plans
   - App is deployed and accessible on Vercel
   - Loading and error states are handled
   - Clean, responsive UI with Tailwind CSS

## Testing Decisions

- **What to test** — External behavior only: does the form submit, does the API return a plan, does the plans page render saved data, do errors display when the API fails.
- **How to test** — Manual testing against the deployed Vercel URL. Students test their own API responses by submitting the form and inspecting the output.
- **No automated tests required** — This is a bootcamp learning project, not production software. The submission checklist serves as the test plan.

## Out of Scope

- User authentication or login
- Editing or deleting saved plans
- Custom study methodologies (hardcoded to spaced repetition + active recall)
- Multi-user support or row-level security
- Plan sharing or export
- Mobile app or PWA
- Analytics or usage tracking
- Rate limiting on the API route
- Pagination on the plans page (assume < 50 plans total)

## Further Notes

- Students are free to modify the project structure, add features, or reorganize based on their creativity. The structure provided is a starting reference.
- The Groq API is recommended for its speed and free tier, but any LLM API works as long as it accepts a system prompt and returns text.
- If a student finishes early, suggested stretch goals: add a delete button, color-code days by subject, or add a dark mode toggle.
