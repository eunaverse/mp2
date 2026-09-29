# Pantry — recipe discovery

A React + TypeScript single-page recipe app for CS409 MP2. The original assignment remains in the root README.

## Run locally

Use Node.js 22. Install and run:

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5173/mp2/. The public TheMealDB educational key `1` needs no account or secret. An internet connection is required for real recipe data and images. Missing fonts use local fallbacks; API failures offer retry.

## Verify

```sh
npx playwright install chromium
npm run verify
npm run test:live
```

`verify` runs unit tests, strict TypeScript compilation, a production build and browser tests at desktop, tablet and phone sizes. The browser server serves actual `dist` files and returns 404.html for unrecognized routes, just like GitHub Pages. `test:live` is separate because external API availability is outside our control. Tests use fabricated, clearly isolated fixtures, never production fallback data.

Other commands: `npm run test:watch`, `npm run format:check`, and `npx playwright show-report`. To inspect production locally: `npm run build`, then `node scripts/serve-static.mjs`; open http://127.0.0.1:4173/mp2/.

## Use the app

- Type a recipe name; search runs automatically after 250 ms. Clear the field to return to the initial discovery selection.
- Switch between Gallery and List without losing your filters or sort order.
- Select one or several categories; matches may belong to any selected category. These filters apply to current API search results. Choose All recipes to clear category selections.
- Sort by recipe name, category, cuisine or ingredient count, ascending or descending.
- Open a recipe to see category, cuisine, ingredients, quantities, original instructions, and any source/video links supplied by the API.
- Previous and Next cycle through the current filtered/sorted results, including wrapping at the ends. With one result, both controls are disabled. A direct URL loads its recipe independently.
- Back to recipes restores the collection state. URLs also retain state across refresh.

## Structure

- `src/pages/Browse.tsx`: gallery/list, search, filters and ordering.
- `src/pages/Detail.tsx`: recipe contents and result navigation.
- `src/components/`: image fallbacks, cards, status displays and icons.
- `src/lib/api.ts`: Axios, response validation, successful-response caching and timeout.
- `src/lib/hooks.ts`: loading/error state, debouncing, cancellation and race protection.
- `src/lib/recipes.ts`: typed recipe model and pure data operations.
- `src/App.tsx`: site shell and React Router routes.
- `src/styles.css`: external styles and responsive layouts.
- `scripts/pages-fallback.mjs`: writes an external-script-only GitHub Pages route fallback.
- `tests/unit/`: data, API and assignment-rule checks.
- `tests/e2e/`: user flows, edge cases, responsive accessibility and live smoke.

## Deployment and submission

The deployment workflow preserves the starter workflow, adds tests before deployment, and publishes `dist` only after passing. Base URL and fallback scripts assume the repository is named `mp2`. Deploying under another repository name requires changing both Vite's base and the generated Pages fallback.

See `submission-checklist.md`. Passing tests supports rubric coverage but is not a guarantee of a particular grade.
