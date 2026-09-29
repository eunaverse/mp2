import { test, expect, resultNames, openCollection } from './fixtures';
test('gallery renders API images; multiple categories use OR and reset', async ({
  page,
}) => {
  await openCollection(page);
  await expect(resultNames(page)).toHaveText([
    'Apple Crumble',
    'Beef Stew',
    'Chickpea Salad',
    'Lemon Chicken',
    'Tomato Soup',
  ]);
  const images = page
    .getByRole('list', { name: 'Recipes', exact: true })
    .getByRole('img');
  await expect(images).toHaveCount(5);
  await expect(images.first()).toHaveAttribute('src', /101\.jpg$/);
  await images.first().scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      images.first().evaluate((img: HTMLImageElement) => img.naturalWidth),
    )
    .toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Vegetarian', exact: true }).click();
  await expect(resultNames(page)).toHaveText(['Chickpea Salad', 'Tomato Soup']);
  await page.getByRole('button', { name: 'Dessert', exact: true }).click();
  await expect(resultNames(page)).toHaveText([
    'Apple Crumble',
    'Chickpea Salad',
    'Tomato Soup',
  ]);
  await page.getByRole('button', { name: 'Vegetarian', exact: true }).click();
  await expect(resultNames(page)).toHaveText(['Apple Crumble']);
  await page.getByRole('button', { name: 'All recipes', exact: true }).click();
  await expect(resultNames(page)).toHaveCount(5);
});
test('list search filters while typing, encodes queries, clears and resets empty results', async ({
  page,
}) => {
  await openCollection(page, '?view=list');
  await expect(
    page.getByRole('button', { name: 'List', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('searchbox', { name: 'Search recipes' }).fill('ch');
  await expect(resultNames(page)).toHaveText([
    'Chickpea Salad',
    'Lemon Chicken',
  ]);
  await page.getByRole('searchbox').fill('chickpea');
  await expect(resultNames(page)).toHaveText(['Chickpea Salad']);
  await page.getByRole('button', { name: 'Clear search', exact: true }).click();
  await expect(resultNames(page)).toHaveCount(5);
  await page.getByRole('searchbox').fill('rice & beans');
  await expect(
    page.getByRole('heading', { name: 'No recipes found' }),
  ).toBeVisible();
  await expect(page).toHaveURL(/q=rice\+%26\+beans/);
  await page.getByRole('button', { name: 'Reset search and filters' }).click();
  await expect(resultNames(page)).toHaveCount(5);
  await expect(page.getByRole('searchbox')).toHaveValue('');
});
test('all four sort properties work in both directions', async ({ page }) => {
  await openCollection(page, '?view=list');
  const orders = {
    name: [
      'Apple Crumble',
      'Beef Stew',
      'Chickpea Salad',
      'Lemon Chicken',
      'Tomato Soup',
    ],
    category: [
      'Beef Stew',
      'Lemon Chicken',
      'Apple Crumble',
      'Chickpea Salad',
      'Tomato Soup',
    ],
    cuisine: [
      'Apple Crumble',
      'Lemon Chicken',
      'Chickpea Salad',
      'Beef Stew',
      'Tomato Soup',
    ],
    ingredients: [
      'Tomato Soup',
      'Chickpea Salad',
      'Apple Crumble',
      'Beef Stew',
      'Lemon Chicken',
    ],
  };
  for (const [key, expected] of Object.entries(orders)) {
    await page.getByLabel('Sort by', { exact: true }).selectOption(key);
    await page.getByLabel('Sort order').selectOption('asc');
    await expect(resultNames(page)).toHaveText(expected);
    await page.getByLabel('Sort order').selectOption('desc');
    await expect(resultNames(page)).toHaveText([...expected].reverse());
  }
});
test('list/gallery toggles retain filters, query, ordering and browser history', async ({
  page,
}) => {
  await openCollection(page);
  await page.getByRole('button', { name: 'Vegetarian', exact: true }).click();
  await page.getByLabel('Sort order').selectOption('desc');
  await page.getByRole('button', { name: 'List', exact: true }).click();
  await expect(resultNames(page)).toHaveText(['Tomato Soup', 'Chickpea Salad']);
  await page.reload();
  await expect(resultNames(page)).toHaveText(['Tomato Soup', 'Chickpea Salad']);
  await expect(
    page.getByRole('button', { name: 'List', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Gallery', exact: true }).click();
  await expect(resultNames(page)).toHaveText(['Tomato Soup', 'Chickpea Salad']);
  await page.goBack();
  await expect(
    page.getByRole('button', { name: 'List', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
});
