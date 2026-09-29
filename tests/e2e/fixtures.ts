import { test as base, expect, type Page } from '@playwright/test';
export const meals = [
  {
    id: '101',
    name: 'Apple Crumble',
    category: 'Dessert',
    cuisine: 'British',
    count: 3,
  },
  {
    id: '102',
    name: 'Beef Stew',
    category: 'Beef',
    cuisine: 'Irish',
    count: 4,
  },
  {
    id: '103',
    name: 'Chickpea Salad',
    category: 'Vegetarian',
    cuisine: 'Greek',
    count: 2,
  },
  {
    id: '104',
    name: 'Lemon Chicken',
    category: 'Chicken',
    cuisine: 'French',
    count: 5,
  },
  {
    id: '105',
    name: 'Tomato Soup',
    category: 'Vegetarian',
    cuisine: 'Italian',
    count: 1,
  },
].map((m) => ({
  idMeal: m.id,
  strMeal: m.name,
  strCategory: m.category,
  strArea: m.cuisine,
  strMealThumb: `https://www.themealdb.com/images/media/meals/${m.id}.jpg`,
  strInstructions: `Prepare the ingredients for ${m.name}.\r\n\r\nCook gently, then serve.`,
  strTags: 'Homemade,Comfort',
  strSource: 'https://example.com/recipe',
  strYoutube: 'https://www.youtube.com/watch?v=test',
  ...Object.fromEntries(
    Array.from({ length: m.count }, (_, i) => [
      `strIngredient${i + 1}`,
      i === 0 ? 'Salt' : `Ingredient ${i + 1}`,
    ]),
  ),
  ...Object.fromEntries(
    Array.from({ length: m.count }, (_, i) => [
      `strMeasure${i + 1}`,
      `${i + 1} tsp`,
    ]),
  ),
}));
export async function mockApi(page: Page) {
  await page.route('https://fonts.googleapis.com/**', (route) => route.abort());
  await page.route('https://www.themealdb.com/images/**', (route) =>
    route.fulfill({
      contentType: 'image/svg+xml',
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500"><rect width="500" height="500" fill="#d5c9ad"/><circle cx="250" cy="250" r="180" fill="#f8f4e8"/><circle cx="250" cy="250" r="145" fill="#8a994f"/><circle cx="200" cy="180" r="42" fill="#b64e30"/><circle cx="300" cy="270" r="54" fill="#dfb85c"/></svg>',
    }),
  );
  await page.route('https://www.themealdb.com/api/**', async (route) => {
    const url = new URL(route.request().url());
    const results = url.pathname.endsWith('lookup.php')
      ? meals.filter((m) => m.idMeal === url.searchParams.get('i'))
      : meals.filter((m) =>
          m.strMeal
            .toLowerCase()
            .includes((url.searchParams.get('s') ?? '').toLowerCase()),
        );
    await route.fulfill({ json: { meals: results.length ? results : null } });
  });
}
export const test = base.extend<{ api: void }>({
  api: [
    async ({ page }, use) => {
      await mockApi(page);
      await use();
    },
    { auto: true },
  ],
});
export { expect };
export const resultNames = (page: Page) =>
  page.getByRole('list', { name: 'Recipes', exact: true }).locator('h3');
export async function openCollection(page: Page, query = '') {
  await page.goto(`./${query}`);
  await expect(resultNames(page)).toHaveCount(5);
}
