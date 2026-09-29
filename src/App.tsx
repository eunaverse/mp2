import { useEffect } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { Icon } from './components/Icon';
import { Browse } from './pages/Browse';
import { Detail } from './pages/Detail';

function RouteEffects() {
  const location = useLocation();
  useEffect(() => {
    if (!location.pathname.startsWith('/recipes/'))
      document.title = 'Pantry — A little inspiration for dinner';
    if (location.hash)
      document.getElementById(location.hash.slice(1))?.scrollIntoView();
    else window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname, location.hash]);
  return null;
}
export default function App() {
  return (
    <>
      <RouteEffects />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Pantry home">
          <span className="brand-mark">
            <Icon kind="brand" />
          </span>
          pantry<span className="brand-dot">.</span>
        </Link>
        <nav aria-label="Main navigation">
          <NavLink to="/" end>
            Explore recipes
          </NavLink>
          <span className="nav-note">GOOD FOOD. GOOD MOOD.</span>
        </nav>
      </header>
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Browse />} />
          <Route path="/recipes/:id" element={<Detail />} />
          <Route
            path="*"
            element={
              <div className="status-panel">
                <h1>Nothing cooking here</h1>
                <p>That page doesn’t exist. Let’s find you a recipe.</p>
                <Link className="button primary" to="/">
                  Explore recipes
                </Link>
              </div>
            }
          />
        </Routes>
      </main>
      <footer className="site-footer">
        <Link className="brand footer-brand" to="/">
          pantry.
        </Link>
        <p>A little curiosity. A lot of flavor.</p>
        <a href="https://www.themealdb.com/" target="_blank" rel="noreferrer">
          Made with TheMealDB ↗
        </a>
      </footer>
    </>
  );
}
