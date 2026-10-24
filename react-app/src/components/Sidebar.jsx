import React from 'react';

const TOPICS = [
  { key: 'technology', label: 'Technology' },
  { key: 'world', label: 'World' },
  { key: 'sports', label: 'Sports' },
  { key: 'science', label: 'Science' },
  { key: 'lifestyle', label: 'Lifestyle' },
];

export default function Sidebar({ topic, setTopic }) {
  return (
    <nav className="topic-bar" aria-label="Topics">
      {TOPICS.map((t) => (
        <button
          key={t.key}
          type="button"
          className={'topic' + (topic === t.key ? ' active' : '')}
          onClick={() => setTopic(t.key)}
          aria-pressed={topic === t.key}
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
}
