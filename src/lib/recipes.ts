export interface Ingredient {
  name: string;
  measure: string;
}
export interface Recipe {
  id: string;
  name: string;
  category: string;
  cuisine: string;
  image: string;
  instructions: string[];
  ingredients: Ingredient[];
  tags: string[];
  source: string;
  video: string;
}
export type SortKey = 'name' | 'category' | 'cuisine' | 'ingredients';
export type Direction = 'asc' | 'desc';
export interface Preferences {
  query: string;
  categories: string[];
  sort: SortKey;
  direction: Direction;
  view: 'gallery' | 'list';
}
const clean = (value: unknown) =>
  typeof value === 'string' ? value.trim() : '';
export function safeUrl(value: unknown): string {
  try {
    const url = new URL(clean(value));
    return url.protocol === 'https:' ? url.href : '';
  } catch {
    return '';
  }
}
export function normalizeRecipe(raw: Record<string, unknown>): Recipe {
  const ingredients: Ingredient[] = [];
  for (let i = 1; i <= 20; i++) {
    const name = clean(raw[`strIngredient${i}`]);
    if (name) ingredients.push({ name, measure: clean(raw[`strMeasure${i}`]) });
  }
  return {
    id: clean(raw.idMeal),
    name: clean(raw.strMeal),
    category: clean(raw.strCategory) || 'Uncategorized',
    cuisine: clean(raw.strArea) || 'Not specified',
    image: safeUrl(raw.strMealThumb),
    ingredients,
    instructions: clean(raw.strInstructions)
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean),
    tags: clean(raw.strTags)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    source: safeUrl(raw.strSource),
    video: safeUrl(raw.strYoutube),
  };
}
export function parseResponse(data: unknown): Recipe[] {
  if (!data || typeof data !== 'object' || !('meals' in data))
    throw new Error('Unexpected recipe response. Please try again.');
  const meals = (data as { meals: unknown }).meals;
  if (meals === null) return [];
  if (!Array.isArray(meals))
    throw new Error('Unexpected recipe response. Please try again.');
  return meals
    .filter((m): m is Record<string, unknown> => !!m && typeof m === 'object')
    .map(normalizeRecipe)
    .filter((m) => m.id && m.name);
}
export function readPreferences(params: URLSearchParams): Preferences {
  const sort = params.get('sort');
  return {
    query: params.get('q') ?? '',
    categories: [...new Set(params.getAll('category'))],
    sort:
      sort === 'category' || sort === 'cuisine' || sort === 'ingredients'
        ? sort
        : 'name',
    direction: params.get('order') === 'desc' ? 'desc' : 'asc',
    view: params.get('view') === 'list' ? 'list' : 'gallery',
  };
}
export function selectRecipes(
  recipes: Recipe[],
  preferences: Preferences,
): Recipe[] {
  const collator = new Intl.Collator('en', {
    sensitivity: 'base',
    numeric: true,
  });
  return recipes
    .filter(
      (r) =>
        !preferences.categories.length ||
        preferences.categories.includes(r.category),
    )
    .sort((a, b) => {
      const comparison =
        preferences.sort === 'ingredients'
          ? a.ingredients.length - b.ingredients.length
          : collator.compare(a[preferences.sort], b[preferences.sort]);
      return (
        (comparison ||
          collator.compare(a.name, b.name) ||
          collator.compare(a.id, b.id)) *
        (preferences.direction === 'asc' ? 1 : -1)
      );
    });
}
export function neighbors(
  recipes: Recipe[],
  id: string,
): { previous?: Recipe; next?: Recipe; index: number } {
  const index = recipes.findIndex((r) => r.id === id);
  if (index === -1 || recipes.length < 2) return { index };
  return {
    previous: recipes[(index - 1 + recipes.length) % recipes.length],
    next: recipes[(index + 1) % recipes.length],
    index,
  };
}
