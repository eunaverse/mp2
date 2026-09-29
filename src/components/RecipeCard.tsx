import { Link } from 'react-router-dom';
import type { Recipe } from '../lib/recipes';
import { RecipeImage } from './RecipeImage';
import { Icon } from './Icon';
export function RecipeCard({
  recipe,
  search,
}: {
  recipe: Recipe;
  search: string;
}) {
  return (
    <li className="recipe-card">
      <Link
        className="recipe-link"
        to={`/recipes/${recipe.id}${search}`}
        aria-label={`View recipe: ${recipe.name}`}
      >
        <div className="card-image">
          <RecipeImage src={recipe.image} name={recipe.name} />
          <span className="card-arrow">
            <Icon kind="arrow" />
          </span>
        </div>
        <div className="card-body">
          <span className="eyebrow card-category">{recipe.category}</span>
          <h3>{recipe.name}</h3>
          <div className="card-meta">
            <span>
              {recipe.cuisine === 'Not specified'
                ? 'Cuisine not specified'
                : recipe.cuisine}
            </span>
            <span>
              {recipe.ingredients.length}{' '}
              {recipe.ingredients.length === 1 ? 'ingredient' : 'ingredients'}
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
}
