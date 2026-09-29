import axios from 'axios';
import { parseResponse, type Recipe } from './recipes';
export const client = axios.create({
  baseURL: 'https://www.themealdb.com/api/json/v1/1/',
  timeout: 15000,
});
const cache = new Map<string, Recipe[]>();
export function clearRecipeCache() {
  cache.clear();
}
async function request(
  path: string,
  params: Record<string, string>,
  signal?: AbortSignal,
): Promise<Recipe[]> {
  const key = path + new URLSearchParams(params).toString();
  if (cache.has(key)) return cache.get(key)!;
  const response = await client.get(path, { params, signal });
  const recipes = parseResponse(response.data);
  if (cache.size >= 30) cache.delete(cache.keys().next().value!);
  cache.set(key, recipes);
  return recipes;
}
export function searchRecipes(query: string, signal?: AbortSignal) {
  return request('search.php', { s: query.trim() }, signal);
}
export async function lookupRecipe(id: string, signal?: AbortSignal) {
  if (!/^\d+$/.test(id)) return null;
  return (await request('lookup.php', { i: id }, signal))[0] ?? null;
}
export function errorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED')
      return 'The recipe service took too long to respond. Please try again.';
    return 'We couldn’t reach the recipe service. Check your connection and try again.';
  }
  return error instanceof Error
    ? error.message
    : 'Something went wrong. Please try again.';
}
