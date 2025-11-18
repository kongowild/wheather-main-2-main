import React, { useState, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import Pagination from './Pagination';

// Lazy loaded image component with error handling
const LazyImage = ({ src, alt, className }) => {
  const [imageError, setImageError] = useState(false);
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
  });

  const handleError = useCallback(() => {
    setImageError(true);
  }, []);

  if (imageError) {
    return (
      <div className={`${className} image-placeholder`}>
        <span>Image not available</span>
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      {inView && (
        <img
          src={src}
          alt={alt}
          onError={handleError}
          loading="lazy"
        />
      )}
      <style jsx>{`
        .image-placeholder {
          background: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          font-size: 0.9em;
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default function NewsGrid({ 
  items = [], 
  onSave, 
  status, 
  error, 
  page = 1, 
  totalPages = 1, 
  onPageChange 
}) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
  });

  if (status === 'loading' && items.length === 0) {
    return <div className="news-grid-loading">Loading news…</div>;
  }
  if (status === 'error') {
    return <div className="news-grid-error">{error?.message || 'Failed to load news'}</div>;
  }
  if (items.length === 0) {
    return (
      <div className="news-grid-empty">
        <div className="muted">No articles to show yet.</div>
        <div>Try a different topic on the left or use the search above.</div>
      </div>
    );
  }

  return (
    <div className="news-grid-wrap">
      <div className="news-grid-list">
        {items.map((a) => (
          <a 
            key={a.id} 
            className="news-card" 
            href={a.url} 
            target="_blank" 
            rel="noopener noreferrer"
            ref={ref}
          >
            {a.image && (
              <LazyImage 
                src={a.image} 
                alt={a.title || 'News thumbnail'} 
                className="news-img"
              />
            )}
            <div className="news-body">
              {a.sectionName && <div className="news-badge">{a.sectionName}</div>}
              <h3 className="news-title">{a.title}</h3>
              <div className="news-meta">
                {a.date && new Date(a.date).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
              {onSave && (
                <button 
                  className="btn small" 
                  type="button" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onSave(a);
                  }}
                >
                  Read Later
                </button>
              )}
            </div>
          </a>
        ))}
      </div>
      
      <div className="news-grid-actions">
        {status === 'loading' && items.length > 0 && (
          <div className="loading-indicator">Loading...</div>
        )}
        
        {status === 'error' && (
          <div className="error-message">
            {error?.message || 'Failed to load news. Please try again.'}
          </div>
        )}
        
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </div>
  );
}

// Add some responsive styles
const styles = `
  .news-grid-wrap {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background: #121212;
    color: #e0e0e0;
  }
  
  .news-grid-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .news-card {
    display: flex;
    flex-direction: column;
    border: 1px solid #333;
    border-radius: 8px;
    overflow: hidden;
    text-decoration: none;
    color: #e0e0e0;
    transition: transform 0.2s, box-shadow 0.2s;
    background: #1e1e1e;
    height: 100%;
  }
  
  .news-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    border-color: #444;
  }
  
  .news-img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  .news-body {
    padding: 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #1e1e1e;
  }
  
  .news-badge {
    display: inline-block;
    background: rgba(98, 0, 238, 0.2);
    color: #bb86fc;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.75em;
    font-weight: 600;
    margin-bottom: 12px;
    align-self: flex-start;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .news-title {
    font-size: 1.2em;
    margin: 8px 0 12px;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    color: #ffffff;
    font-weight: 500;
  }
  
  .news-meta {
    color: #9e9e9e;
    font-size: 0.85em;
    margin-top: auto;
    padding-top: 16px;
    border-top: 1px solid #333;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .news-grid-actions {
    display: flex;
    justify-content: center;
    margin: 40px 0 20px;
  }
  
  .loading-indicator {
    text-align: center;
    padding: 30px;
    color: #9e9e9e;
    font-size: 1.1em;
  }
  
  .error-message {
    text-align: center;
    padding: 30px;
    color: #cf6679;
    background: rgba(207, 102, 121, 0.1);
    border-radius: 8px;
    margin: 20px 0;
    border: 1px solid rgba(207, 102, 121, 0.3);
  }
  
  @media (max-width: 768px) {
    .news-grid-wrap {
      padding: 15px;
    }
    
    .news-grid-list {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }
    
    .news-img {
      height: 180px;
    }
    
    .news-body {
      padding: 16px;
    }
    
    .news-title {
      font-size: 1.1em;
    }
  }
  
  @media (max-width: 480px) {
    .news-grid-list {
      grid-template-columns: 1fr;
    }
  }
`;

// Add global styles
try {
  if (typeof document !== 'undefined') {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
  }
} catch (e) {
  console.warn('Failed to add styles', e);
}
