# Issue 8: AI Agent with web search — auto-extract topics

## Parent

[PRD: PrepWise AI – Smart Study Planner](https://github.com/abiolaks/sandcastle-demo/issues/2)

## What to build

Upgrade the LLM from a simple prompt-and-response to an **AI agent with a web search tool**. Instead of the user manually typing topics, they enter only the course name (e.g. "CS 101: Introduction to Computer Science"). The agent searches the web, extracts the syllabus topics, then generates a personalized study plan.

### User flow

1. User enters: course name, hours per day, exam date (no "topics" field)
2. User clicks "Generate Plan"
3. Agent searches the web for the course syllabus and extracts topics
4. Agent generates a structured study plan from those topics
5. Plan is saved and displayed

### Technical approach

- **Web search tool** — `lib/web-search.ts` using a free search API (DuckDuckGo, SerpAPI, or Brave Search)
- **Agent loop** — LLM prompt instructs the model to search, parse results into topics, then generate the schedule
- **API route** — `/api/generate` runs two phases: search → extract topics → generate plan
- **Form update** — "Course Name" replaces "Topics" field
- **Graceful fallback** — if search fails, fall back to LLM inferring common topics for the course

## Acceptance criteria

- [ ] Form updated: "Course Name" replaces "Topics" field
- [ ] Web search tool module created (`lib/web-search.ts`)
- [ ] API route searches the web for course topics before generating
- [ ] Extracted topics are fed into the LLM prompt
- [ ] Search failures degrade gracefully (fallback to LLM inference)
- [ ] Loading state accounts for extra search time
- [ ] Error message displayed if both search and fallback fail

## Blocked by

None — can start immediately. Builds on existing code from closed issues #3-#7.
