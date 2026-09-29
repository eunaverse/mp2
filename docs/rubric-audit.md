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
- `git diff --check`: passed.
- No inline styles, inline scripts or HTML tables: enforced by test.
- Original assignment README and deployment workflow: retained.

## State still requiring external completion

The current `origin` is the read-only course template. No student repository has been created, pushed, configured for Pages or checked live. A local pass does not establish GitHub Actions or deployment success. The student must also review and export the required LLM chatlogs, record and share the demo, and submit the grading form.
