import { test, expect } from '@playwright/test';
test('real MealDB search, details and refresh', async ({ page }, testInfo) => {
  test.skip(
    !process.env.LIVE_API,
    'Opt in with npm run test:live; deterministic tests do not require the API.',
  );
  await page.goto('./');
  const recipes = page.getByRole('list', { name: 'Recipes', exact: true });
  await expect(recipes).toBeVisible({ timeout: 25000 });
  const firstImage = recipes.getByRole('img').first();
  await firstImage.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      firstImage.evaluate((image: HTMLImageElement) => image.naturalWidth),
    )
    .toBeGreaterThan(0);
  await page.screenshot({
    path: testInfo.outputPath('live-home.png'),
    fullPage: true,
  });
  await page.getByRole('searchbox').fill('Arrabiata');
  const link = page.getByRole('link', { name: /View recipe:.*Arrabiata/i });
  await expect(link).toBeVisible({ timeout: 25000 });
  await link.click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    /Arrabiata/i,
    { timeout: 25000 },
  );
  await expect(page.locator('.ingredients li')).not.toHaveCount(0);
  await expect(page.locator('.method li')).not.toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    /Arrabiata/i,
    { timeout: 25000 },
  );
  await expect(page.locator('.navigation-count')).toHaveText('1 / 1', {
    timeout: 25000,
  });
  await page.screenshot({
    path: testInfo.outputPath('live-detail.png'),
    fullPage: true,
  });
});
