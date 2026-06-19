# PrepWise AI – Smart Study Planner

An AI-powered study planner where students enter a subject, topics, and exam date — the app generates a personalized study schedule and stores it for later use.

## Tech Stack

- **Next.js** — full-stack React framework
- **Tailwind CSS** — utility-first styling
- **Supabase** — database & backend storage
- **Groq API / LLM** — AI-powered study plan generation
- **Vercel** — deployment

## Project Structure

```
prepwise-lite/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── plans/
│   │   └── page.tsx
│   └── api/
│       └── generate/
│           └── route.ts
├── components/
│   ├── StudyForm.tsx
│   └── PlanCard.tsx
├── .env.local
└── package.json
```

## Day-by-Day Plan

| Day | Tasks |
|-----|-------|
| **Day 1** | Create Next.js project, set up Tailwind, build the study form (subject, topics, exam date) |
| **Day 2** | Create API route, connect Groq/LLM API, generate AI study plan |
| **Day 3** | Connect Supabase, save & display plans, deploy to Vercel |

## Tips

- Keep the UI clean and simple
- Focus on functionality before styling
- Test API responses carefully
- Ensure Supabase is connected properly
- Complete all features before deployment

## Deployment Checklist

Deploy to Vercel by connecting your GitHub repository. Set these **three environment variables** in the Vercel dashboard (Project → Settings → Environment Variables):

| Variable | Description | Where to find it |
|---|---|---|
| `GROQ_API_KEY` | API key for Groq LLM | [console.groq.com/keys](https://console.groq.com/keys) — create a key |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Supabase Dashboard → Settings → API → Project API Keys → `anon` / `public` |

After deploying, run the database migration:
1. Open your Supabase project dashboard
2. Go to the **SQL Editor**
3. Paste the contents of `supabase/migrations/001_create_plans_table.sql`
4. Click **Run**

## Submission

**Deadline: 20th June (end of day)**

Students are free to modify, improve, or organize the project structure differently based on their creativity and understanding.
