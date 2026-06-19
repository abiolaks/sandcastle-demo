# Issue 3: Persist plans + history page

## Parent

[PRD: PrepWise AI – Smart Study Planner](https://github.com/abiolaks/sandcastle-demo/issues/2)

## What to build

Adds the Supabase data layer: generated plans are saved to a `plans` table, the current plan reloads on page refresh, and a new `/plans` page displays all previously saved plans as a browsable history.

This is the data persistence vertical — DB → API → UI in both directions.

Includes:
- **Supabase client setup** — install `@supabase/supabase-js`, configure with env vars, add a helper module for queries.
- **Database migration** — a `plans` table with columns: `id` (uuid, primary key, auto-generated), `subject` (text), `topics` (text), `exam_date` (date), `hours_per_day` (integer), `plan_content` (jsonb), `created_at` (timestamp, auto-set). No authentication. No RLS policies. All plans are public (noted as intentional).
- **Save on generate** — after the LLM returns a valid plan, the API route saves it to Supabase before responding. The response includes the saved `id`.
- **Load on mount** — the home page fetches the most recent plan from Supabase on load, so it survives a refresh.
- **Plans page** — a new route at `/plans` fetches all plans ordered by `created_at DESC`, renders each as a PlanCard. Simple navigation link between home and `/plans`.
- **Empty state** — if no plans exist, `/plans` shows "No study plans yet. Generate your first one!"

## Acceptance criteria

- [ ] Supabase client connects successfully using env vars
- [ ] `plans` table exists with the correct schema
- [ ] Generating a plan saves it to the database (verifiable in Supabase dashboard)
- [ ] Refreshing the home page after generating shows the saved plan (not lost)
- [ ] Navigating to `/plans` displays all saved plans in reverse chronological order
- [ ] Each plan card shows the subject, exam date, and a preview of the schedule
- [ ] Empty state message appears when no plans exist
- [ ] Navigation works between home page and `/plans`

## Blocked by

- [#4](https://github.com/abiolaks/sandcastle-demo/issues/4) Generate plan end-to-end
