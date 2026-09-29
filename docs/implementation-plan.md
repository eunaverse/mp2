# Pantry implementation and verification plan

Source of truth: the preserved assignment README. Due October 6, 2026, 11:59 PM CT.

## Step 1 — Data foundation

Normalize TheMealDB responses, handle null/missing fields, use Axios, cache successful requests, cancel outdated searches, and build deterministic filtering/sorting/navigation helpers. Unit-test real edge cases before UI implementation.

## Step 2 — Complete app

React + TypeScript, React Router with `/mp2/` basename. Gallery and list share URL-backed search, category, sorting and order state. Search TheMealDB by name as the user types (250 ms debounce). The initial API selection is a discovery collection, not a promise to show the entire database. Category filters use OR semantics within current search results. Sort name, category, cuisine or ingredient count both ways. Details render original ingredients/instructions and retain the matching results' order for cyclic navigation. A direct detail URL loads independently; include that recipe in the default navigation collection if absent.

Design: warm paper, terracotta, dark olive, readable serif headlines, generous food imagery. Use only API-provided recipe facts; do not invent preparation times or ratings. No inline styles/scripts or tables for layout.

## Step 3 — Verification and release preparation

Deterministic Playwright API fixtures test every rubric interaction, errors/retry, race conditions, empty data, keyboard use and accessibility. Check 390 px mobile, 820 px tablet, 1440 px desktop, plus narrow mobile overflow. Review screenshots. Separately exercise real API requests. Test the production build and static-host detail refresh fallback. CI runs the test gate before deploying.

Local success is separate from publication and course submission. Public repository creation, GitHub Pages activation, deployed-site checks, the student's <=3 minute demo, chatlog export and grading-form answers remain release/submission gates.
