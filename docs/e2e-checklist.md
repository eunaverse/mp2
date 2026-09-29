# Pantry E2E checklist and rubric map

| Grading item                   | Points | Verification                                                          |
| ------------------------------ | -----: | --------------------------------------------------------------------- |
| List shows API items           |      4 | list-gallery: exact fixture names, categories, images                 |
| Search filters while typing    |      8 | search: no submit; request query; matching results, empty, races      |
| Sort at least two properties   |      8 | sorting: name, category, cuisine, ingredient count                    |
| Both sort directions           |      8 | sorting: full ordered arrays for all four properties                  |
| Gallery displays media         |      4 | list-gallery: image source, loaded image, gallery layout              |
| Gallery filters change results |      8 | list-gallery: one/multiple category toggles and reset                 |
| List opens details             |     10 | navigation: URL plus name, ingredients and instructions               |
| Gallery opens details          |     10 | navigation: URL plus recipe content                                   |
| Detail attributes              |      8 | navigation: exact fixture quantities and directions                   |
| Previous/next                  |     10 | navigation: expected neighbors, wrap, filtered order, singleton       |
| React Router and TypeScript    |     12 | source/build plus direct URL, refresh and Back behavior               |
| Design                         |     10 | responsive: screenshots, overflow, image loading, a11y, manual review |

## Test buckets

- `tests/unit/recipes.test.ts`: parsing, filtering, sorting and boundaries.
- `tests/unit/api.test.ts`: Axios contract, cache, failures and IDs.
- `tests/e2e/browse.spec.ts`: search, sorting, gallery/list, multiselect and reset.
- `tests/e2e/navigation.spec.ts`: details, matching collection order, deep links, back/forward, missing item.
- `tests/e2e/resilience.spec.ts`: loading, error, retry, empty, stale response and broken image.
- `tests/e2e/responsive.spec.ts`: mobile/tablet/desktop, keyboard, axe, screenshots.
- `tests/e2e/live.spec.ts`: separately opted-in real API smoke.

## Release gate

- [ ] Unit tests pass.
- [ ] TypeScript and production build pass.
- [ ] Browser tests pass against production assets.
- [ ] Search success/error/loading/empty/retry states pass.
- [ ] Previous/next preserve filters and sort order; singleton is disabled.
- [ ] Direct recipe URLs survive refresh on a static host.
- [ ] Mobile/tablet/desktop screenshots reviewed for clipping, overlaps and hidden actions.
- [ ] Live API smoke passes, without fixture interception.
- [ ] Public deployment and live URL verified after publication approval.
- [ ] Demo, chatlogs, source declarations and submission form completed by student.
