# Issue 2: Generate plan end-to-end (no database)

## Parent

[PRD: PrepWise AI – Smart Study Planner](https://github.com/abiolaks/sandcastle-demo/issues/2)

## What to build

The full AI generation flow: a form captures study inputs, a POST API route calls the Groq LLM, the structured JSON response is parsed and rendered as a day-by-day study timeline on the page.

This is the tracer bullet — every layer except the database, fully wired. After this slice, a student can enter their details, click "Generate," and see a real AI-generated study plan.

Includes:
- **StudyForm** component with fields: subject (text), topics (text), hours per day (number), exam date (date picker). All fields required.
- **API route** `POST /api/generate` — accepts form data, sends it to Groq with a structured prompt, receives JSON, parses it, returns it to the frontend.
- **Prompt template** — system prompt establishes the LLM as an expert study planner using spaced repetition and active recall. User prompt includes subject, topics, hours/day, exam date, and days remaining. Output must be valid JSON with a `schedule` array of `{ day, date, topic, task, technique }` objects.
- **JSON recovery utility** — strips markdown code fences (```json ... ```) from the LLM response before parsing. Displays a clear error if parsing still fails.
- **PlanCard** component — renders the plan as a timeline: each day shows the date, topic, task, and study technique.

## Acceptance criteria

- [ ] Study form displays all four fields and validates they are filled before submitting
- [ ] "Generate Plan" button sends form data to `/api/generate`
- [ ] API route sends a well-structured prompt to Groq (or configurable LLM)
- [ ] LLM response is successfully parsed as JSON with the expected `schedule` array
- [ ] Parsed plan is rendered on the page as a day-by-day timeline
- [ ] If the LLM returns invalid JSON (even wrapped in markdown fences), a clear error message is shown to the user
- [ ] The API route's LLM provider is swappable via env var (e.g., Groq default, OpenAI compatible)

## Blocked by

- [#3](https://github.com/abiolaks/sandcastle-demo/issues/3) Scaffold project + deploy skeleton
