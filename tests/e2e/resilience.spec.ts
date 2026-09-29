import { test, expect, meals, resultNames, openCollection } from './fixtures';
test('loading transitions to API error and retry succeeds', async ({
  page,
}) => {
  let failures = 1;
  await page.route('**/search.php?*', async (route) => {
    if (failures-- > 0) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await route.fulfill({ status: 503, json: { message: 'Unavailable' } });
    } else await route.fulfill({ json: { meals } });
  });
  await page.goto('./');
  await expect(
    page.getByRole('heading', { name: 'Finding something delicious…' }),
  ).toBeVisible();
  await expect(page.getByRole('alert')).toContainText(
    'We couldn’t reach the recipe service',
  );
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(resultNames(page)).toHaveCount(5);
});
test('detail error is recoverable without losing route', async ({ page }) => {
  let failures = 1;
  await page.route('**/lookup.php?*', async (route) => {
    if (failures-- > 0) await route.fulfill({ status: 500, json: {} });
    else await route.fulfill({ json: { meals: [meals[0]] } });
  });
  await page.goto('./recipes/101');
  await expect(page.getByRole('alert')).toBeVisible();
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Apple Crumble',
  );
});
test('stale slow search never replaces the latest results', async ({
  page,
}) => {
  await openCollection(page);
  await page.route('**/search.php?s=apple', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await route.fulfill({ json: { meals: [meals[0]] } }).catch(() => {});
  });
  const oldRequest = page.waitForRequest('**/search.php?s=apple');
  await page.getByRole('searchbox').fill('apple');
  await oldRequest;
  await page.getByRole('searchbox').fill('beef');
  await expect(resultNames(page)).toHaveText(['Beef Stew']);
  await page.waitForTimeout(1200);
  await expect(resultNames(page)).toHaveText(['Beef Stew']);
});
test('broken images show an accessible fallback and recipes still open', async ({
  page,
}) => {
  await page.route('https://www.themealdb.com/images/**', (route) =>
    route.abort(),
  );
  await openCollection(page);
  await expect(
    page.getByRole('img', { name: 'Apple Crumble — image unavailable' }).last(),
  ).toBeVisible();
  await page.getByRole('link', { name: 'View recipe: Apple Crumble' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Apple Crumble',
  );
});
test('collection failure does not hide independently loaded recipe', async ({
  page,
}) => {
  let failures = 1;
  await page.route('**/search.php?*', async (route) => {
    if (failures-- > 0) await route.abort();
    else await route.fulfill({ json: { meals } });
  });
  await page.goto('./recipes/102');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Beef Stew');
  await expect(page.getByRole('alert')).toContainText(
    'its collection couldn’t load',
  );
  await page.getByRole('button', { name: 'Retry collection' }).click();
  await expect(
    page.getByRole('link', { name: 'Next recipe: Chickpea Salad' }),
  ).toBeVisible();
});
test('missing optional recipe fields render honestly without broken links', async ({
  page,
}) => {
  await page.route('**/lookup.php?i=101', (route) =>
    route.fulfill({
      json: {
        meals: [
          {
            idMeal: '101',
            strMeal: 'Simple Soup',
            strIngredient1: 'Water',
            strMeasure1: null,
            strArea: null,
            strSource: 'javascript:alert(1)',
          },
        ],
      },
    }),
  );
  await page.goto('./recipes/101');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Simple Soup',
  );
  await expect(page.locator('.ingredients li')).toHaveText([
    'WaterNot specified',
  ]);
  await expect(
    page.getByText('No instructions were provided for this recipe.'),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Original recipe' })).toHaveCount(
    0,
  );
});
