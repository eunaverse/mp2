import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useRecipe, useRecipes } from '../lib/hooks';
import { neighbors, readPreferences, selectRecipes } from '../lib/recipes';
import { RecipeImage } from '../components/RecipeImage';
import { Icon } from '../components/Icon';
import { ErrorState, Loading } from '../components/Status';
export function Detail() {
  const { id = '' } = useParams();
  const [params] = useSearchParams();
  const preferences = readPreferences(params);
  const [retry, setRetry] = useState(0);
  const recipeState = useRecipe(id, retry);
  const collection = useRecipes(preferences.query, retry);
  const recipe = recipeState.data;
  const selected = selectRecipes(collection.data, preferences);
  const navigation =
    recipe && !selected.some((r) => r.id === recipe.id)
      ? selectRecipes([...selected, recipe], { ...preferences, categories: [] })
      : selected;
  const { previous, next, index } = neighbors(navigation, id);
  const search = params.size ? `?${params}` : '';
  const back = `/${search}#collection`;
  useEffect(() => {
    if (recipe) {
      document.title = `${recipe.name} — Pantry`;
    } else if (!recipeState.loading) {
      document.title = recipeState.error
        ? 'Recipes unavailable — Pantry'
        : 'Recipe not found — Pantry';
    }
  }, [recipe, recipeState.error, recipeState.loading]);
  return (
    <article className="detail-page">
      <Link className="back-link" to={back}>
        ← Back to recipes
      </Link>
      {recipeState.loading ? (
        <Loading label="Opening your recipe…" />
      ) : recipeState.error ? (
        <ErrorState
          message={recipeState.error}
          onRetry={() => setRetry((n) => n + 1)}
        />
      ) : !recipe ? (
        <div className="status-panel">
          <h1>Recipe not found</h1>
          <p>This recipe may have moved. There’s plenty more to discover.</p>
          <Link className="button primary" to="/">
            Explore recipes
          </Link>
        </div>
      ) : (
        <>
          <header className="detail-hero">
            <div className="detail-image">
              <RecipeImage src={recipe.image} name={recipe.name} eager />
            </div>
            <div className="detail-intro">
              <p className="eyebrow">FROM THE PANTRY COLLECTION</p>
              <span className="detail-category">{recipe.category}</span>
              <h1>{recipe.name}</h1>
              <p className="detail-subtitle">
                A little adventure for your table.
              </p>
              <dl className="recipe-facts">
                <div>
                  <dt>Cuisine</dt>
                  <dd>{recipe.cuisine}</dd>
                </div>
                <div>
                  <dt>Ingredients</dt>
                  <dd>{recipe.ingredients.length}</dd>
                </div>
              </dl>
              {!!recipe.tags.length && (
                <div className="tags">
                  {recipe.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              )}
              <a className="hero-cta" href="#method">
                Let’s get cooking <Icon kind="arrow" />
              </a>
            </div>
          </header>
          <div className="recipe-content">
            <section
              className="ingredients"
              aria-labelledby="ingredients-title"
            >
              <p className="eyebrow">ON YOUR COUNTER</p>
              <h2 id="ingredients-title">Ingredients</h2>
              {recipe.ingredients.length ? (
                <ul>
                  {recipe.ingredients.map((ingredient, i) => (
                    <li key={`${ingredient.name}-${i}`}>
                      <span>{ingredient.name}</span>
                      <strong>{ingredient.measure || 'Not specified'}</strong>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No ingredients were provided for this recipe.</p>
              )}
              <p className="ingredient-note">
                Quantities are as provided by the recipe author.
              </p>
            </section>
            <section
              className="method"
              id="method"
              aria-labelledby="method-title"
            >
              <p className="eyebrow">BRING IT ALL TOGETHER</p>
              <h2 id="method-title">In the kitchen</h2>
              {recipe.instructions.length ? (
                <ol>
                  {recipe.instructions.map((step, i) => (
                    <li key={i}>
                      <span className="step-number" aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <p>{step}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p>No instructions were provided for this recipe.</p>
              )}
              <div className="source-links">
                {recipe.source && (
                  <a href={recipe.source} target="_blank" rel="noreferrer">
                    Original recipe ↗
                  </a>
                )}
                {recipe.video && (
                  <a href={recipe.video} target="_blank" rel="noreferrer">
                    Watch cooking video ↗
                  </a>
                )}
                <a
                  href="https://www.themealdb.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Recipe data: TheMealDB ↗
                </a>
              </div>
            </section>
          </div>
          <nav className="recipe-navigation" aria-label="Browse recipe details">
            {previous && !collection.loading && !collection.error ? (
              <Link
                aria-label={`Previous recipe: ${previous.name}`}
                to={`/recipes/${previous.id}${search}`}
              >
                <small>← PREVIOUS RECIPE</small>
                <span>{previous.name}</span>
              </Link>
            ) : (
              <button disabled>← Previous recipe</button>
            )}
            <span className="navigation-count">
              {collection.loading
                ? 'Loading collection…'
                : collection.error
                  ? 'Navigation unavailable'
                  : `${index + 1} / ${navigation.length}`}
            </span>
            {next && !collection.loading && !collection.error ? (
              <Link
                aria-label={`Next recipe: ${next.name}`}
                to={`/recipes/${next.id}${search}`}
              >
                <small>NEXT RECIPE →</small>
                <span>{next.name}</span>
              </Link>
            ) : (
              <button disabled>Next recipe →</button>
            )}
          </nav>
          {collection.error && (
            <div className="navigation-error" role="alert">
              <p>Your recipe is ready, but its collection couldn’t load.</p>
              <button className="button" onClick={() => setRetry((n) => n + 1)}>
                Retry collection
              </button>
            </div>
          )}
        </>
      )}
    </article>
  );
}
