import AxeBuilder from '@axe-core/playwright';
import { test, expect, openCollection, resultNames } from './fixtures';
test('gallery, list and details are accessible and fit the viewport', async ({
  page,
}, testInfo) => {
  await openCollection(page);
  for (const view of ['gallery', 'list', 'detail']) {
    if (view === 'list')
      await page.getByRole('button', { name: 'List', exact: true }).click();
    if (view === 'detail') {
      await page
        .getByRole('link', { name: 'View recipe: Lemon Chicken' })
        .click();
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(
        'Lemon Chicken',
      );
    }
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      )
      .toBe(true);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
    await page.screenshot({
      path: testInfo.outputPath(`${view}.png`),
      fullPage: true,
    });
  }
});
test('keyboard can skip navigation, search and open a recipe', async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== 'desktop',
    'Physical keyboard journey on desktop.',
  );
  await openCollection(page);
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Skip to content' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  await page.getByRole('searchbox').focus();
  await page.keyboard.type('Beef');
  await expect(resultNames(page)).toHaveText(['Beef Stew']);
  await page.getByRole('link', { name: 'View recipe: Beef Stew' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Beef Stew');
});
test('narrow phone retains search, sort and navigation controls', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await openCollection(page);
  await page.getByLabel('Sort by', { exact: true }).selectOption('ingredients');
  await page.getByLabel('Sort order').selectOption('desc');
  await expect(resultNames(page).first()).toHaveText('Lemon Chicken');
  await page.getByRole('link', { name: 'View recipe: Lemon Chicken' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Lemon Chicken',
  );
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    )
    .toBe(true);
  await page.getByRole('link', { name: 'Next recipe: Beef Stew' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Beef Stew');
});
