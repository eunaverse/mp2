import { writeFileSync } from 'node:fs';
// External script keeps the assignment's no-inline-scripts rule intact.
writeFileSync(
  'dist/404.html',
  `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Opening Pantry</title><script src="/mp2/route-redirect.js" defer></script></head><body><p>Opening your recipe… <a href="/mp2/">Return to Pantry</a></p></body></html>`,
);
writeFileSync(
  'dist/route-redirect.js',
  `const route = location.pathname + location.search + location.hash; location.replace('/mp2/?__route=' + encodeURIComponent(route));\n`,
);
