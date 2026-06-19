# Issue 4: Loading, errors, and empty states

## Parent

[PRD: PrepWise AI – Smart Study Planner](https://github.com/abiolaks/sandcastle-demo/issues/2)

## What to build

Adds user-facing state handling across all pages: a loading indicator while the plan is generating, error messages when API calls fail, and empty states where data is absent.

This is a UX cross-cut slice — no new features, but makes the existing ones feel complete and production-like.

Includes:
- **Loading spinner** — displayed on the "Generate Plan" button or as an overlay while the API call is in flight. The submit button is disabled during generation to prevent duplicate requests.
- **Error handling** — if the API returns an error (network failure, invalid API key, Groq quota exceeded, malformed JSON), a visible error banner appears on the page with a human-readable message. Users can dismiss it and try again.
- **Empty state on /plans** — already handled in Issue #3, but verified here for consistency and styling.
- **Form validation feedback** — inline error messages if fields are empty on submit (red border + message below each invalid field).

## Acceptance criteria

- [ ] A loading spinner is visible while the plan generation API call is in progress
- [ ] The "Generate Plan" button is disabled during generation to prevent duplicate submissions
- [ ] If the API call fails, an error message is displayed (not a blank screen or crash)
- [ ] The error message is dismissible and the user can try again
- [ ] Form fields show inline validation errors if submitted empty
- [ ] No layout shift or visual jarring between loading/success/error states

## Blocked by

- [#4](https://github.com/abiolaks/sandcastle-demo/issues/4) Generate plan end-to-end
