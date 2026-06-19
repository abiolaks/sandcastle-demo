# Issue 5: Polish + responsive design

## Parent

[PRD: PrepWise AI – Smart Study Planner](https://github.com/abiolaks/sandcastle-demo/issues/2)

## What to build

Final visual pass to make the app look clean, consistent, and work well on mobile and desktop. Also includes the deployment checklist documentation so students know exactly which Vercel environment variables to set.

This is the finishing cross-cut — no new features, just refinement.

Includes:
- **Responsive Tailwind pass** — form, plan cards, and layouts adapt gracefully from mobile (single column, full-width) to desktop (centered, max-width container). Tested at 375px and 1280px widths.
- **Consistent design tokens** — unified color palette (e.g., indigo primary, gray neutrals), consistent spacing scale, typography hierarchy (heading → subheading → body → caption).
- **Visual polish** — subtle card shadows and rounded corners, hover states on interactive elements, smooth transitions on state changes (loading → success).
- **Page layout** — centered max-width container, clear section separation, app feels like a cohesive product, not a collection of components.
- **Deployment checklist** — created as a section or tooltip listing the three required Vercel environment variables: `GROQ_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, with notes on where to find each value.

## Acceptance criteria

- [ ] App is fully usable and looks good on mobile (375px width)
- [ ] App is fully usable and looks good on desktop (1280px width)
- [ ] Form, plan cards, and `/plans` page share a consistent visual language
- [ ] All interactive elements have hover/focus states
- [ ] No horizontal scroll on any page at any viewport width
- [ ] Deployment checklist is visible (either in-app or in README) with the three required env vars

## Blocked by

- [#5](https://github.com/abiolaks/sandcastle-demo/issues/5) Persist plans + history page
- [#6](https://github.com/abiolaks/sandcastle-demo/issues/6) Loading, errors, and empty states
