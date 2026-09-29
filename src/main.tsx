import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles.css';
// GitHub Pages sends unknown paths to 404.html, which redirects using an external script.
const restored = new URLSearchParams(window.location.search).get('__route');
if (
  restored?.startsWith(import.meta.env.BASE_URL) &&
  !restored.startsWith('//')
) {
  window.history.replaceState(null, '', restored);
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
