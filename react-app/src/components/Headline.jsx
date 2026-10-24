import React from 'react';
import SaveButton from './SaveButton';
import { formatDate, plainText } from '../utils/format';

export default function Headline({ articles = [], addToList, savedIds, status }) {
  if (status === 'loading' && articles.length === 0) {
    return (
      <div className="lead" aria-busy="true">
        <div>
          <div className="skel lead-img" />
          <div className="skel skel-line wide" />
          <div className="skel skel-line" />
        </div>
        <div>
          {[0, 1, 2, 3].map((i) => <div key={i} className="skel skel-line" />)}
        </div>
      </div>
    );
  }
  if (articles.length === 0) {
    return (
      <p className="empty-note">
        {status === 'error' ? "Couldn't load today's stories. Try again in a moment." : 'No stories for this topic yet.'}
      </p>
    );
  }

  const [lead, ...others] = articles;
  const excerpt = plainText(lead.excerpt);

  return (
    <div className="lead">
      <article className="lead-story">
        <a className="lead-link" href={lead.url} target="_blank" rel="noreferrer">
          {lead.image && <img className="lead-img" src={lead.image} alt="" />}
          {lead.sectionName && <span className="kicker">{lead.sectionName}</span>}
          <h2 className="lead-title">{lead.title}</h2>
          {excerpt && <p className="lead-excerpt">{excerpt}</p>}
        </a>
        <div className="story-foot">
          <time dateTime={lead.date}>{formatDate(lead.date)}</time>
          <SaveButton saved={savedIds?.has(lead.id)} onClick={() => addToList?.(lead)} />
        </div>
      </article>

      {others.length > 0 && (
        <ol className="top-list">
          {others.map((a, i) => (
            <li key={a.id}>
              <span className="top-num">{i + 2}</span>
              <div>
                <a className="top-link" href={a.url} target="_blank" rel="noreferrer">
                  {a.sectionName && <span className="kicker">{a.sectionName}</span>}
                  <h3 className="top-title">{a.title}</h3>
                </a>
                <div className="story-foot">
                  <time dateTime={a.date}>{formatDate(a.date)}</time>
                  <SaveButton saved={savedIds?.has(a.id)} onClick={() => addToList?.(a)} />
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
