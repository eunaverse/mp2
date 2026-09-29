export function Icon({
  kind,
}: {
  kind: 'search' | 'grid' | 'list' | 'arrow' | 'brand';
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {kind === 'search' && (
        <>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m16 16 4.5 4.5" />
        </>
      )}
      {kind === 'grid' && (
        <>
          <rect x="3" y="3" width="6" height="6" rx="1" />
          <rect x="15" y="3" width="6" height="6" rx="1" />
          <rect x="3" y="15" width="6" height="6" rx="1" />
          <rect x="15" y="15" width="6" height="6" rx="1" />
        </>
      )}
      {kind === 'list' && (
        <>
          <path d="M9 5h12M9 12h12M9 19h12M3 5h1M3 12h1M3 19h1" />
        </>
      )}
      {kind === 'arrow' && <path d="M4 12h16m-6-6 6 6-6 6" />}
      {kind === 'brand' && (
        <>
          <path d="M5 3v6q0 4 4 4V3m-2 0v6m0 4v8M19 3q-7 8-4 11h4V3v18" />
        </>
      )}
    </svg>
  );
}
