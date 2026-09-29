import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useRecipes } from '../lib/hooks';
import { readPreferences, selectRecipes } from '../lib/recipes';
import { RecipeImage } from '../components/RecipeImage';
import { RecipeCard } from '../components/RecipeCard';
import { Icon } from '../components/Icon';
import { ErrorState, Loading } from '../components/Status';
export function Browse() {
  const [params, setParams] = useSearchParams();
  const preferences = readPreferences(params);
  const [retry, setRetry] = useState(0);
  const collection = useRecipes(preferences.query, retry);
  const recipes = selectRecipes(collection.data, preferences);
  const categories = [
    ...new Set([
      ...collection.data.map((r) => r.category),
      ...preferences.categories,
    ]),
  ].sort();
  const featured =
    collection.data.find((r) => r.name.toLowerCase() === 'sushi') ??
    collection.data.find((r) => !!r.image);
  const search = params.size ? `?${params}` : '';
  // Read the latest browser URL: rapid interactions can precede a Router render.
  function update(key: string, value: string) {
    const next = new URLSearchParams(window.location.search);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: key === 'q', preventScrollReset: true });
  }
  function toggleCategory(category: string) {
    const next = new URLSearchParams(window.location.search);
    next.delete('category');
    const currentCategories = readPreferences(
      new URLSearchParams(window.location.search),
    ).categories;
    const chosen = currentCategories.includes(category)
      ? currentCategories.filter((c) => c !== category)
      : [...currentCategories, category];
    chosen.forEach((c) => next.append('category', c));
    setParams(next, { preventScrollReset: true });
  }
  function reset() {
    const next = new URLSearchParams();
    if (preferences.view === 'list') next.set('view', 'list');
    setParams(next);
  }
  return (
    <>
      <section className="hero" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="tiny-line" /> GOOD FOOD, EVERY DAY
          </p>
          <h1 id="home-title">
            A little inspiration
            <br />
            for <em>dinner.</em>
          </h1>
          <p className="hero-description">
            Something familiar. Something new.
            <br />
            Find a recipe that feels just right.
          </p>
          <a className="hero-cta" href="#collection">
            Find your next favorite <Icon kind="arrow" />
          </a>
          <span className="hero-footnote">
            Recipes from kitchens around the world
          </span>
        </div>
        <div className="hero-art">
          <div className="hero-image">
            {featured ? (
              <RecipeImage src={featured.image} name={featured.name} eager />
            ) : (
              <div className="hero-placeholder" aria-hidden="true">
                Good things
                <br />
                <em>are cooking.</em>
              </div>
            )}
          </div>
          <span className="hero-stamp" aria-hidden="true">
            A WORLD
            <br />
            OF FLAVOR<span>✳</span>
          </span>
          {featured && (
            <Link
              className="feature-label"
              to={`/recipes/${featured.id}${search}`}
            >
              <span>
                <small>A LITTLE INSPIRATION</small>
                <strong>{featured.name}</strong>
              </span>
              <Icon kind="arrow" />
            </Link>
          )}
        </div>
      </section>
      <section
        id="collection"
        className="collection"
        aria-labelledby="collection-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE RECIPE COLLECTION</p>
            <h2 id="collection-title">What sounds good?</h2>
          </div>
          <p>Follow your appetite.</p>
        </div>
        <div className="search-row">
          <div className="search-field">
            <Icon kind="search" />
            <label className="sr-only" htmlFor="recipe-search">
              Search recipes
            </label>
            <input
              id="recipe-search"
              type="search"
              placeholder="Search recipes by name…"
              value={preferences.query}
              onChange={(e) => update('q', e.target.value)}
            />
            {preferences.query && (
              <button
                className="clear-search"
                aria-label="Clear search"
                onClick={() => update('q', '')}
              >
                ×
              </button>
            )}
          </div>
          <div className="view-toggle" role="group" aria-label="Recipe view">
            <button
              aria-pressed={preferences.view === 'gallery'}
              onClick={() => update('view', 'gallery')}
            >
              <Icon kind="grid" />
              <span>Gallery</span>
            </button>
            <button
              aria-pressed={preferences.view === 'list'}
              onClick={() => update('view', 'list')}
            >
              <Icon kind="list" />
              <span>List</span>
            </button>
          </div>
        </div>
        <fieldset className="category-filters">
          <legend>
            Filter by category <span>· select one or more</span>
          </legend>
          <div className="filter-options">
            <button
              aria-pressed={!preferences.categories.length}
              onClick={() => {
                const next = new URLSearchParams(window.location.search);
                next.delete('category');
                setParams(next);
              }}
            >
              All recipes
            </button>
            {categories.map((category) => (
              <button
                key={category}
                aria-pressed={preferences.categories.includes(category)}
                onClick={() => toggleCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="results-toolbar">
          <p role="status" aria-live="polite" className="result-count">
            {collection.loading ? (
              'Searching recipes…'
            ) : collection.error ? (
              'Recipes unavailable'
            ) : (
              <>
                <strong>{recipes.length}</strong>{' '}
                {recipes.length === 1 ? 'recipe' : 'recipes'}
                {preferences.query.trim()
                  ? ` for “${preferences.query.trim()}”`
                  : ' to explore'}
              </>
            )}
          </p>
          <div className="sort-controls">
            <label htmlFor="sort">Sort by</label>
            <select
              id="sort"
              value={preferences.sort}
              onChange={(e) => update('sort', e.target.value)}
            >
              <option value="name">Recipe name</option>
              <option value="category">Category</option>
              <option value="cuisine">Cuisine</option>
              <option value="ingredients">Ingredient count</option>
            </select>
            <label className="sr-only" htmlFor="order">
              Sort order
            </label>
            <select
              id="order"
              value={preferences.direction}
              onChange={(e) => update('order', e.target.value)}
            >
              <option value="asc">Ascending ↑</option>
              <option value="desc">Descending ↓</option>
            </select>
          </div>
        </div>
        {collection.loading ? (
          <Loading />
        ) : collection.error ? (
          <ErrorState
            message={collection.error}
            onRetry={() => setRetry((n) => n + 1)}
          />
        ) : recipes.length ? (
          <>
            <ul
              className={`recipe-results ${preferences.view}`}
              aria-label="Recipes"
            >
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} search={search} />
              ))}
            </ul>
            <p className="collection-note">
              {preferences.query.trim()
                ? 'Search results from TheMealDB. Category filters apply to these results.'
                : 'A selection to get you inspired. Search by name to discover more recipes.'}
            </p>
          </>
        ) : (
          <div className="status-panel">
            <span className="eyebrow">Something else on the menu?</span>
            <h2>No recipes found</h2>
            <p>Try another recipe name or clear your category filters.</p>
            <button className="button primary" onClick={reset}>
              Reset search and filters
            </button>
          </div>
        )}
      </section>
    </>
  );
}
