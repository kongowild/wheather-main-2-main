import { useCallback, useEffect, useMemo, useRef, useState, useDeferredValue } from 'react';
import { debounce } from 'lodash';

const API = 'https://content.guardianapis.com/search';

// Debounce function
const debouncedFetch = (func, delay) => {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

export default function useArticles({ topic = 'technology', query = '', pageSize = 12 } = {}) {
  const apiKey = process.env.REACT_APP_GUARDIAN_API_KEY || (typeof window !== 'undefined' ? window.GUARDIAN_API_KEY : undefined);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const abortRef = useRef();
  
  // Debounce the query to prevent too many API calls
  const debouncedQuery = useMemo(
    () => debounce((q) => {
      setPage(1);
      setItems([]);
      fetchPage(1, q);
    }, 500),
    [topic, pageSize]
  );

  const section = useMemo(() => {
    // map topic to guardian section
    const map = {
      technology: 'technology',
      sports: 'sport',
      lifestyle: 'lifeandstyle',
      science: 'science',
      world: 'world',
    };
    return map[String(topic).toLowerCase()] || undefined;
  }, [topic]);

  const fetchPage = useCallback(async (pageNum, searchQuery = query) => {
    if (!apiKey) {
      setStatus('error');
      setError(new Error('Missing Guardian API key'));
      return;
    }
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      setStatus('loading');
      setError(null);
      const params = new URLSearchParams({
        'api-key': apiKey,
        'order-by': 'newest',
        'page-size': String(pageSize),
        'page': String(pageNum),
        'show-fields': 'thumbnail,trailText,byline,headline',
        'q': searchQuery || '',
      });
      if (section) params.set('section', section);
      const url = `${API}?${params.toString()}`;
      const res = await fetch(url, { signal: ctrl.signal });
      if (!res.ok) throw new Error(`Guardian error (${res.status})`);
      const json = await res.json();
      const response = json?.response;
      const results = response?.results || [];
      setTotalPages(response?.pages || 1);
      
      const mapped = results.map(r => ({
        id: r.id,
        title: r.fields?.headline || r.webTitle,
        excerpt: r.fields?.trailText || '',
        byline: r.fields?.byline || '',
        image: r.fields?.thumbnail || '',
        sectionName: r.sectionName,
        date: r.webPublicationDate,
        url: r.webUrl,
      }));
      setItems(mapped);
      setStatus('success');
    } catch (e) {
      if (e.name === 'AbortError') return;
      setStatus('error');
      setError(e);
    }
  }, [apiKey, page, pageSize, query, section]);

  // Handle query changes with debounce
  useEffect(() => {
    debouncedQuery(query);
    return () => debouncedQuery.cancel();
  }, [query, debouncedQuery]);

  // Handle topic changes
  useEffect(() => {
    setPage(1);
    setItems([]);
    fetchPage(1, query);
  }, [topic, pageSize]);

  const goToPage = useCallback((pageNum) => {
    setPage(pageNum);
    fetchPage(pageNum, query);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchPage, query]);

  return { 
    items, 
    status, 
    error, 
    page, 
    totalPages,
    goToPage 
  };
}
