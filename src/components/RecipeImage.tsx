import { useState } from 'react';
export function RecipeImage({
  src,
  name,
  eager = false,
}: {
  src: string;
  name: string;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState('');
  return src && failed !== src ? (
    <img
      src={src}
      alt={name}
      loading={eager ? 'eager' : 'lazy'}
      onError={() => setFailed(src)}
    />
  ) : (
    <div
      className="image-fallback"
      role="img"
      aria-label={`${name} — image unavailable`}
    >
      <span aria-hidden="true">♧</span>
      <span>Made to be tasted.</span>
      <small>Image unavailable</small>
    </div>
  );
}
