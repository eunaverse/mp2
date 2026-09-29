export function Loading({
  label = 'Finding something delicious…',
}: {
  label?: string;
}) {
  return (
    <div className="status-panel" role="status">
      <span className="spinner" aria-hidden="true" />
      <h2>{label}</h2>
      <p>Fetching recipes from TheMealDB.</p>
    </div>
  );
}
export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="status-panel" role="alert">
      <span className="eyebrow">A little kitchen interruption</span>
      <h2>Recipes couldn’t load</h2>
      <p>{message}</p>
      <button className="button primary" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}
