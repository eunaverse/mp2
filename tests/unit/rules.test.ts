import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, it } from 'vitest';
function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? sourceFiles(join(directory, entry.name))
      : [join(directory, entry.name)],
  );
}
it('keeps styles external, scripts external and avoids tables for layout', () => {
  const sources = sourceFiles('src')
    .filter((path) => /\.(tsx|ts)$/.test(path))
    .map((path) => readFileSync(path, 'utf8'))
    .join('\n');
  expect(sources).not.toMatch(/\bstyle\s*=/);
  expect(sources).not.toMatch(/<table\b/i);
  expect(sources).not.toMatch(/<script\b/i);
  const html = readFileSync('index.html', 'utf8');
  expect(html).not.toMatch(/<style\b/i);
  expect(
    html.match(/<script\b[^>]*>/gi)?.every((tag) => /\bsrc=/.test(tag)),
  ).toBe(true);
});
it('retains the assignment and required lockfile/deployment files', () => {
  expect(readFileSync('README.md', 'utf8')).toContain(
    'Large Language Model (LLM) Usage Policy',
  );
  expect(
    JSON.parse(readFileSync('package-lock.json', 'utf8')).lockfileVersion,
  ).toBeGreaterThanOrEqual(3);
  expect(readFileSync('.github/workflows/deploy.yml', 'utf8')).toContain(
    'actions/deploy-pages',
  );
});
