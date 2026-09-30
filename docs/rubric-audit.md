# MP2 rubric audit

This is an evidence map for review. It targets all 100 rubric points but does not claim or guarantee the instructor's grade.

| Requirement                      | Points | Implementation                                                                                  | Automated evidence                                                                                           |
| -------------------------------- | -----: | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| List displays API items          |      4 | List toggle renders normalized TheMealDB recipes                                                | `browse.spec.ts` checks exact API fixture items in List                                                      |
| Search filters as the user types |      8 | 250 ms debounced Axios name search; no form submit                                              | Search E2E covers partial terms, successive typing, URL encoding, clear, empty state and stale responses     |
| Sort by at least two properties  |      8 | Recipe name, category, cuisine and ingredient count                                             | E2E verifies the complete expected order for all four properties                                             |
| Ascending and descending         |      8 | URL-backed order control                                                                        | E2E verifies both directions for every sort property                                                         |
| Gallery displays media           |      4 | TheMealDB thumbnails with accessible failure fallback                                           | E2E verifies image URLs and decoded image width                                                              |
| Gallery filters results          |      8 | One or more category toggles with OR semantics                                                  | E2E covers single, multiple, deselection and All recipes reset                                               |
| List item opens details          |     10 | Router links use `/recipes/:id`                                                                 | List journey checks URL, title and content                                                                   |
| Gallery item opens details       |     10 | Same stable detail route                                                                        | Gallery journey checks URL, title and content                                                                |
| Detail contains attributes       |      8 | Category, cuisine, tags, ingredient quantities, instructions, safe source/video links           | Navigation and missing-field E2E cases check exact rendered values                                           |
| Previous and Next work           |     10 | Cyclic navigation follows the filtered and sorted collection                                    | E2E checks both directions, wraparound, filtered order, singleton disable and direct external item inclusion |
| React Router and TypeScript      |     12 | React Router basename, strict TypeScript and GitHub Pages deep-link fallback                    | Build plus direct URL, refresh, browser history and unknown route E2E cases                                  |
| Design                           |     10 | Responsive editorial recipe design, keyboard support, visible focus, loading/error/empty states | Axe WCAG checks, overflow checks and screenshots at desktop/tablet/mobile/narrow-phone widths                |

## Verification recorded locally

- Formatting: passed.
- Unit and assignment-rule tests: 12 passed.
- Production TypeScript/Vite build: passed.
- Deterministic Playwright suite: 55 passed, 5 intentional skips. The skipped live-API case runs separately once, and the keyboard-only desktop scenario is skipped in the two touch projects.
- Real TheMealDB browser smoke: passed independently.
- Public GitHub Actions build and Pages deployment: passed.
- Live site browser check: HTTP 200; 25 recipes loaded; search, routed details, direct-route refresh and mobile overflow check passed without browser errors.
- `git diff --check`: passed.
- No inline styles, inline scripts or HTML tables: enforced by test.
- Original assignment README and deployment workflow: retained.

## Published project

- Repository: https://github.com/eunaverse/mp2
- Live site: https://eunaverse.github.io/mp2/
- Pages source: GitHub Actions workflow on `main`

## State still requiring student completion

The privacy-filtered parent and delegated-agent LLM chatlogs are included in the repository and indexed by `llm_logs.csv`. The student must still record and share the demo, answer the LLM survey, and submit the grading form. These submission steps are separate from a successful deployment.
