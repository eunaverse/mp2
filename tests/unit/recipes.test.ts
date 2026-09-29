import { describe, it, expect } from 'vitest';
import {
  normalizeRecipe,
  parseResponse,
  readPreferences,
  selectRecipes,
  neighbors,
  safeUrl,
} from '../../src/lib/recipes';
const recipe = (id: string, name: string, category: string, count = 1) => ({
  ...normalizeRecipe({ idMeal: id, strMeal: name, strCategory: category }),
  ingredients: Array.from({ length: count }, () => ({
    name: 'Salt',
    measure: '1 tsp',
  })),
});
const recipes = [
  recipe('3', 'Tart', 'Dessert', 3),
  recipe('1', 'Beans', 'Vegetarian', 1),
  recipe('2', 'Apple cake', 'Dessert', 2),
];
const preferences = readPreferences(new URLSearchParams());
describe('API normalization', () => {
  it('pairs all 20 ingredient slots, skips blanks and handles missing metadata', () => {
    const r = normalizeRecipe({
      idMeal: '1',
      strMeal: ' Soup ',
      strIngredient1: ' Beans ',
      strMeasure1: ' 2 cups ',
      strIngredient2: ' ',
      strIngredient20: 'Salt',
      strInstructions: 'First.\r\n\r\nSecond.',
      strTags: 'Soup, ,Easy',
      strArea: null,
    });
    expect(r.ingredients).toEqual([
      { name: 'Beans', measure: '2 cups' },
      { name: 'Salt', measure: '' },
    ]);
    expect(r.instructions).toEqual(['First.', 'Second.']);
    expect(r.tags).toEqual(['Soup', 'Easy']);
    expect(r.cuisine).toBe('Not specified');
  });
  it('distinguishes no matches from malformed data', () => {
    expect(parseResponse({ meals: null })).toEqual([]);
    expect(() => parseResponse({ error: 'unavailable' })).toThrow();
    expect(() => parseResponse({ meals: {} })).toThrow();
    expect(
      parseResponse({ meals: [null, {}, { idMeal: '1', strMeal: 'Soup' }] }),
    ).toHaveLength(1);
  });
  it('rejects unsafe external URLs', () => {
    expect(safeUrl('javascript:alert(1)')).toBe('');
    expect(safeUrl('http://example.com')).toBe('');
    expect(safeUrl('https://example.com')).toBe('https://example.com/');
  });
});
describe('collection behavior', () => {
  it('sorts names and ingredient counts both ways without mutating input', () => {
    expect(selectRecipes(recipes, preferences).map((r) => r.id)).toEqual([
      '2',
      '1',
      '3',
    ]);
    expect(
      selectRecipes(recipes, { ...preferences, direction: 'desc' }).map(
        (r) => r.id,
      ),
    ).toEqual(['3', '1', '2']);
    expect(
      selectRecipes(recipes, { ...preferences, sort: 'ingredients' }).map(
        (r) => r.id,
      ),
    ).toEqual(['1', '2', '3']);
    expect(
      selectRecipes(recipes, {
        ...preferences,
        sort: 'ingredients',
        direction: 'desc',
      }).map((r) => r.id),
    ).toEqual(['3', '2', '1']);
    expect(recipes.map((r) => r.id)).toEqual(['3', '1', '2']);
  });
  it('combines categories with OR and handles empty and unknown filters', () => {
    expect(
      selectRecipes(recipes, { ...preferences, categories: ['Dessert'] }),
    ).toHaveLength(2);
    expect(
      selectRecipes(recipes, {
        ...preferences,
        categories: ['Dessert', 'Vegetarian'],
      }),
    ).toHaveLength(3);
    expect(
      selectRecipes(recipes, { ...preferences, categories: ['Seafood'] }),
    ).toEqual([]);
  });
  it('wraps at both boundaries and disables missing/single results', () => {
    expect(neighbors(recipes, '3').previous?.id).toBe('2');
    expect(neighbors(recipes, '2').next?.id).toBe('3');
    expect(neighbors([], '1')).toEqual({ index: -1 });
    expect(neighbors([recipes[0]], '3')).toEqual({ index: 0 });
    expect(neighbors(recipes, '99')).toEqual({ index: -1 });
  });
  it('validates URL parameters', () => {
    expect(
      readPreferences(
        new URLSearchParams(
          'sort=bad&order=bad&view=bad&category=Beef&category=Beef',
        ),
      ),
    ).toEqual({ ...preferences, categories: ['Beef'] });
  });
});
