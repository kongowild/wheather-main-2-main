import React from 'react';
import SaveButton from './SaveButton';
import { formatDate } from '../utils/format';

export default function WatchGrid({ items = [], onSave, savedIds, status, error, onLoadMore }) {
  if (status === 'loading' && items.length === 0) {
    return (
      <div className="story-grid" aria-busy="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="story-card">
            <div className="story-thumb video-thumb skel" />
            <div className="skel skel-line wide" />
            <div className="skel skel-line" />
          </div>
        ))}
      </div>
    );
  }
  if (status === 'error') {
    return <p className="empty-note">{error?.message || "Couldn't load videos."}</p>;
  }
  if (items.length === 0) {
    return <p className="empty-note">No videos yet. Try a search above.</p>;
  }
  return (
    <>
      <div className="story-grid video-grid">
        {items.map((v) => (
          <article key={v.id} className="story-card">
            <a className="story-card-link" href={v.url} target="_blank" rel="noreferrer">
              <div className="story-thumb video-thumb">
                {v.thumbnail ? <img src={v.thumbnail} alt="" loading="lazy" /> : <div className="thumb-fallback">Video</div>}
                <span className="play-badge" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 12 12"><path d="M3 1.5v9l7.5-4.5z" fill="currentColor" /></svg>
                </span>
              </div>
              {v.channel && <span className="kicker">{v.channel}</span>}
              <h3 className="story-title">{v.title}</h3>
            </a>
            <div className="story-foot">
              <time dateTime={v.publishedAt}>{formatDate(v.publishedAt)}</time>
              <SaveButton
                saved={savedIds?.has(v.id)}
                onClick={() => onSave?.(v)}
                label="Watch later"
                savedLabel="In watch later"
              />
            </div>
          </article>
        ))}
      </div>
      <div className="grid-actions">
        {status === 'loading' && <span className="empty-note">Loading…</span>}
        {onLoadMore && status !== 'loading' && (
          <button className="btn ghost" type="button" onClick={onLoadMore}>Load more</button>
        )}
      </div>
    </>
  );
}
