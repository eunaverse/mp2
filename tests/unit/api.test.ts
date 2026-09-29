import { beforeEach, expect, it, vi } from 'vitest';
import {
  client,
  clearRecipeCache,
  searchRecipes,
  lookupRecipe,
} from '../../src/lib/api';
beforeEach(() => {
  clearRecipeCache();
  vi.restoreAllMocks();
});
it('uses Axios search with trimmed query, signal and reusable successful cache', async () => {
  const get = vi
    .spyOn(client, 'get')
    .mockResolvedValue({ data: { meals: [{ idMeal: '1', strMeal: 'Soup' }] } });
  const signal = new AbortController().signal;
  expect(await searchRecipes(' soup ', signal)).toHaveLength(1);
  await searchRecipes('soup');
  expect(get).toHaveBeenCalledTimes(1);
  expect(get).toHaveBeenCalledWith('search.php', {
    params: { s: 'soup' },
    signal,
  });
});
it('does not cache failures and permits retry', async () => {
  const get = vi
    .spyOn(client, 'get')
    .mockRejectedValueOnce(new Error('Offline'))
    .mockResolvedValueOnce({ data: { meals: null } });
  await expect(searchRecipes('a')).rejects.toThrow('Offline');
  expect(await searchRecipes('a')).toEqual([]);
  expect(get).toHaveBeenCalledTimes(2);
});
it('loads direct recipe IDs and rejects invalid IDs without requests', async () => {
  const get = vi.spyOn(client, 'get').mockResolvedValue({
    data: { meals: [{ idMeal: '123', strMeal: 'Soup' }] },
  });
  expect(await lookupRecipe('../bad')).toBeNull();
  expect(get).not.toHaveBeenCalled();
  expect((await lookupRecipe('123'))?.name).toBe('Soup');
  expect(get).toHaveBeenCalledWith('lookup.php', {
    params: { i: '123' },
    signal: undefined,
  });
});
