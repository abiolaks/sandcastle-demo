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

## Submission

**Deadline: 20th June (end of day)**

Students are free to modify, improve, or organize the project structure differently based on their creativity and understanding.
