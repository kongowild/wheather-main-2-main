import React from 'react';

const PAGES = [
  { key: 'home', label: 'Home' },
  { key: 'watch', label: 'Watch' },
  { key: 'contact', label: 'Contact' },
];

export default function Header({ query, setQuery, onSearch, currentPage = 'home', onNavigate }) {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const showSearch = currentPage === 'home' || currentPage === 'watch';
  const placeholder = currentPage === 'watch' ? 'Search videos' : 'Search stories';

  return (
    <header className="masthead">
      <div className="masthead-top">
        <span className="masthead-date">{today}</span>
        {showSearch && (
          <form className="search" role="search" onSubmit={(e) => { e.preventDefault(); onSearch?.(query); }}>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              aria-label={placeholder}
            />
            <button type="submit" aria-label="Search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </form>
        )}
      </div>
      <div className="masthead-brand">
        <a href="/" className="brand" onClick={(e) => { e.preventDefault(); onNavigate?.('home'); }}>
          Kongowild <em>News</em>
        </a>
      </div>
      <nav className="masthead-nav" aria-label="Main">
        {PAGES.map((p) => (
          <button
            key={p.key}
            type="button"
            className={'nav-link' + (currentPage === p.key ? ' active' : '')}
            aria-current={currentPage === p.key ? 'page' : undefined}
            onClick={() => onNavigate?.(p.key)}
          >
            {p.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
