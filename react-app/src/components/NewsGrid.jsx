import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Pagination from './Pagination';
import SaveButton from './SaveButton';
import { formatDate } from '../utils/format';

function LazyImage({ src, alt }) {
  const [failed, setFailed] = useState(false);
  const [ref, inView] = useInView({ triggerOnce: true, rootMargin: '200px 0px' });

  if (!src || failed) return <div className="thumb-fallback">Kongowild</div>;
  return (
    <div ref={ref} className="thumb-inner">
      {inView && <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />}
    </div>
  );
}

export default function NewsGrid({
  items = [],
  onSave,
  savedIds,
  status,
  error,
  page = 1,
  totalPages = 1,
  onPageChange,
}) {
  if (status === 'loading' && items.length === 0) {
    return (
      <div className="story-grid" aria-busy="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="story-card">
            <div className="story-thumb skel" />
            <div className="skel skel-line wide" />
            <div className="skel skel-line" />
          </div>
        ))}
      </div>
    );
  }
  if (status === 'error') {
    return <p className="empty-note">{error?.message || "Couldn't load stories."}</p>;
  }
  if (items.length === 0) {
    return <p className="empty-note">Nothing here yet. Try another topic or search.</p>;
  }

  return (
    <>
      <div className="story-grid">
        {items.map((a) => (
          <article key={a.id} className="story-card">
            <a className="story-card-link" href={a.url} target="_blank" rel="noopener noreferrer">
              <div className="story-thumb">
                <LazyImage src={a.image} alt="" />
              </div>
              {a.sectionName && <span className="kicker">{a.sectionName}</span>}
              <h3 className="story-title">{a.title}</h3>
            </a>
            <div className="story-foot">
              <time dateTime={a.date}>{formatDate(a.date)}</time>
              {onSave && <SaveButton saved={savedIds?.has(a.id)} onClick={() => onSave(a)} />}
            </div>
          </article>
        ))}
      </div>
      {status === 'loading' && <p className="empty-note">Loading…</p>}
      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </>
  );
}
