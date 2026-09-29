import { useEffect, useState } from 'react';
import { errorMessage, lookupRecipe, searchRecipes } from './api';
import type { Recipe } from './recipes';
interface LoadState<T> {
  key: string;
  data: T;
  loading: boolean;
  error: string;
}
export function useRecipes(query: string, retry: number) {
  const key = query.trim();
  const [state, setState] = useState<LoadState<Recipe[]>>({
    key,
    data: [],
    loading: true,
    error: '',
  });
  useEffect(() => {
    const controller = new AbortController();
    setState({ key, data: [], loading: true, error: '' });
    const timer = window.setTimeout(
      () => {
        searchRecipes(key, controller.signal)
          .then((data) => {
            if (!controller.signal.aborted)
              setState({ key, data, loading: false, error: '' });
          })
          .catch((error) => {
            if (!controller.signal.aborted)
              setState({
                key,
                data: [],
                loading: false,
                error: errorMessage(error),
              });
          });
      },
      key ? 250 : 0,
    );
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [key, retry]);
  return state.key === key
    ? state
    : { key, data: [], loading: true, error: '' };
}
export function useRecipe(id: string, retry: number) {
  const [state, setState] = useState<LoadState<Recipe | null>>({
    key: id,
    data: null,
    loading: true,
    error: '',
  });
  useEffect(() => {
    const controller = new AbortController();
    setState({ key: id, data: null, loading: true, error: '' });
    lookupRecipe(id, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted)
          setState({ key: id, data, loading: false, error: '' });
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setState({
            key: id,
            data: null,
            loading: false,
            error: errorMessage(error),
          });
      });
    return () => controller.abort();
  }, [id, retry]);
  return state.key === id
    ? state
    : { key: id, data: null, loading: true, error: '' };
}
