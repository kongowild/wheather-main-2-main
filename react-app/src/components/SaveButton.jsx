import React from 'react';

export default function SaveButton({ saved, onClick, label = 'Save', savedLabel = 'Saved' }) {
  return (
    <button
      type="button"
      className={'save-btn' + (saved ? ' is-saved' : '')}
      aria-pressed={!!saved}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.();
      }}
    >
      <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true">
        <path
          d="M1 1h10v12l-5-3.2L1 13z"
          fill={saved ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
      {saved ? savedLabel : label}
    </button>
  );
}
