# Sources and LLM disclosure

Consulted project and API references:

- Assignment template and original requirements: https://github.com/cs409-fa25/mp2
- TheMealDB API documentation: https://www.themealdb.com/api.php
- Public API used for recipes and media: https://www.themealdb.com/api/json/v1/1/search.php?s= and lookup.php?i=<id>
- Google Fonts stylesheet serves DM Sans and Libre Caslon Display; browser/system fallbacks are included.

The app and test code were generated with OpenAI Codex in this conversation, then executed, debugged and verified locally. Tests contain explicitly fabricated recipe fixtures. Recipe facts shown in the application come from TheMealDB; cooking times, ratings, servings and nutritional estimates are not invented.

The required privacy-filtered LLM exports are included as [the parent conversation](llm-chat-log.md) and [the delegated-agent sessions](llm-subagents.md), indexed by the repository-root `llm_logs.csv`. They preserve recorded visible messages and provenance while omitting system instructions, reasoning, credentials, tool outputs, ambient context, and private filesystem paths. The student must still answer the LLM survey in the grading form and declare any additional references used during later work.
