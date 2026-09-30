import { test, expect, openCollection, resultNames } from './fixtures';
for (const view of ['gallery', 'list']) {
  test(`${view} opens full details and cycles in sorted, filtered order`, async ({
    page,
  }) => {
    await openCollection(page, `?view=${view}`);
    await page.getByRole('button', { name: 'Vegetarian', exact: true }).click();
    await page.getByLabel('Sort order').selectOption('desc');
    await page
      .getByRole('link', { name: 'View recipe: Tomato Soup', exact: true })
      .click();
    await expect(page).toHaveURL(/\/recipes\/105\?/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Tomato Soup',
    );
    await expect(
      page.getByRole('heading', { name: 'Ingredients', exact: true }),
    ).toBeVisible();
    await expect(page.locator('.ingredients li')).toHaveText(['Salt1 tsp']);
    await expect(page.locator('.method li p')).toHaveText([
      'Prepare the ingredients for Tomato Soup.',
      'Cook gently, then serve.',
    ]);
    await expect(page.getByText('Italian', { exact: true })).toBeVisible();
    await page
      .getByRole('link', { name: 'Next recipe: Chickpea Salad' })
      .click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Chickpea Salad',
    );
    await page.getByRole('link', { name: 'Next recipe: Tomato Soup' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Tomato Soup',
    );
    await page
      .getByRole('link', { name: 'Previous recipe: Chickpea Salad' })
      .click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Chickpea Salad',
    );
    await page.getByRole('link', { name: 'Back to recipes' }).click();
    await expect(resultNames(page)).toHaveText([
      'Tomato Soup',
      'Chickpea Salad',
    ]);
    await expect(
      page.getByRole('button', {
        name: view === 'list' ? 'List' : 'Gallery',
        exact: true,
      }),
    ).toHaveAttribute('aria-pressed', 'true');
  });
}
test('direct detail URL and refresh work through real static 404 fallback', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const response = await page.goto('./recipes/104?sort=ingredients&order=desc');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Lemon Chicken',
  );
  await expect(page).toHaveURL(
    /\/mp2\/recipes\/104\?sort=ingredients&order=desc$/,
  );
  await expect(
    page.getByRole('link', { name: 'Next recipe: Beef Stew' }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Lemon Chicken',
  );
  await page
    .getByRole('link', { name: 'Previous recipe: Tomato Soup' })
    .click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Tomato Soup',
  );
  expect(errors).toEqual([]);
});
test('single matching recipe disables previous and next', async ({ page }) => {
  await page.goto('./recipes/101?q=Apple');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Apple Crumble',
  );
  await expect(
    page.getByRole('button', { name: 'Previous recipe' }),
  ).toBeDisabled();
  await expect(
    page.getByRole('button', { name: 'Next recipe' }),
  ).toBeDisabled();
  await expect(page.locator('.navigation-count')).toHaveText('1 / 1');
});
test('missing recipe and unknown route offer working recovery', async ({
  page,
}) => {
  await page.goto('./recipes/101');
  await expect(page).toHaveTitle('Apple Crumble — Pantry');
  await page.evaluate(() => {
    window.history.pushState(null, '', '/mp2/recipes/999');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  await expect(
    page.getByRole('heading', { name: 'Recipe not found' }),
  ).toBeVisible();
  await expect(page).toHaveTitle('Recipe not found — Pantry');
  await page
    .getByRole('link', { name: 'Explore recipes', exact: true })
    .last()
    .click();
  await expect(resultNames(page)).toHaveCount(5);
  await page.goto('./not-a-page');
  await expect(
    page.getByRole('heading', { name: 'Nothing cooking here' }),
  ).toBeVisible();
  await page
    .getByRole('link', { name: 'Explore recipes', exact: true })
    .last()
    .click();
  await expect(resultNames(page)).toHaveCount(5);
});
test('direct recipe outside discovery results is included in navigation', async ({
  page,
}) => {
  await page.route('**/lookup.php?i=999', (route) =>
    route.fulfill({
      json: {
        meals: [
          {
            idMeal: '999',
            strMeal: 'Zucchini Bake',
            strCategory: 'Vegetarian',
            strInstructions: 'Bake until cooked.',
          },
        ],
      },
    }),
  );
  await page.goto('./recipes/999');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Zucchini Bake',
  );
  await expect(page.locator('.navigation-count')).toHaveText('6 / 6');
  await expect(
    page.getByRole('link', { name: 'Previous recipe: Tomato Soup' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Next recipe: Apple Crumble' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Apple Crumble',
  );
});
