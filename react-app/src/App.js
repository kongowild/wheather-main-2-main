import './App.css';
import WeatherCard from './WeatherCard';
import Calendar from './Calendar';
import React, { useMemo, useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Headline from './components/Headline';
import NewsGrid from './components/NewsGrid';
import useArticles from './hooks/useArticles';
import useReadingList from './hooks/useReadingList';
import WatchGrid from './components/WatchGrid';
import useVideos from './hooks/useVideos';
import useGuardianVideos from './hooks/useGuardianVideos';
import useWatchList from './hooks/useWatchList';
import BlogSection from './components/BlogSection';
import { formatDate } from './utils/format';

const VIDEO_CHIPS = [
  { label: 'Breaking', query: 'breaking news' },
  { label: 'Tech', query: 'technology news' },
  { label: 'World', query: 'world news' },
  { label: 'Sports', query: 'sports news' },
];

function SavedList({ items, onRemove, empty, getMeta, getImage }) {
  if (items.length === 0) return <p className="empty-note">{empty}</p>;
  return (
    <div className="reading-items">
      {items.map((item) => (
        <a key={item.id} className="reading-card" href={item.url} target="_blank" rel="noreferrer">
          <span className="reading-thumb">
            {getImage(item) && <img src={getImage(item)} alt="" loading="lazy" />}
          </span>
          <span className="reading-body">
            <span className="reading-title">{item.title}</span>
            <span className="reading-meta">{getMeta(item)}</span>
          </span>
          <button
            className="icon-btn"
            type="button"
            onClick={(e) => { e.preventDefault(); onRemove(item.id); }}
            aria-label={`Remove ${item.title}`}
          >
            ✕
          </button>
        </a>
      ))}
    </div>
  );
}

function App() {
  const [topic, setTopic] = useState('technology');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState('home'); // 'home' | 'watch' | 'contact'
  const { items, status, error, page: currentPage, totalPages, goToPage } = useArticles({
    topic,
    query: searchQuery,
    pageSize: 12,
  });
  const { list, toggle, remove } = useReadingList();
  const videoSource = (process.env.REACT_APP_VIDEO_SOURCE || (typeof window !== 'undefined' ? window.VIDEO_SOURCE : '') || 'guardian').toLowerCase();
  const useYT = videoSource === 'youtube';
  const gv = useGuardianVideos({ topic, query: searchQuery, pageSize: 12, enabled: !useYT });
  const yt = useVideos({ topic, query: searchQuery, pageSize: 12, enabled: useYT });
  const videos = useYT ? yt.items : gv.items;
  const vStatus = useYT ? yt.status : gv.status;
  const vError = useYT ? yt.error : gv.error;
  const vLoadMore = useYT ? yt.loadMore : gv.loadMore;
  const { list: watchList, toggle: toggleWatch, remove: removeWatch } = useWatchList();
  const savedIds = useMemo(() => new Set(list.map((a) => a.id)), [list]);
  const watchIds = useMemo(() => new Set(watchList.map((v) => v.id)), [watchList]);
  const headlineItems = items.slice(0, 6);
  const moreItems = items.slice(6);

  const runSearch = (q) => {
    setSearchQuery(q);
  };

  return (
    <div className="site">
      <Header
        query={searchQuery}
        setQuery={setSearchQuery}
        onSearch={runSearch}
        currentPage={page}
        onNavigate={(newPage) => {
          setPage(newPage);
          setSearchQuery('');
        }}
      />

      {page === 'home' && (
        <Sidebar
          topic={topic}
          setTopic={(newTopic) => {
            setTopic(newTopic);
          }}
        />
      )}
      {page === 'watch' && (
        <nav className="topic-bar" aria-label="Video topics">
          {VIDEO_CHIPS.map((c) => (
            <button
              key={c.query}
              type="button"
              className={'topic' + (searchQuery === c.query ? ' active' : '')}
              aria-pressed={searchQuery === c.query}
              onClick={() => runSearch(searchQuery === c.query ? '' : c.query)}
            >
              {c.label}
            </button>
          ))}
          <span className="source-note">via {useYT ? 'YouTube' : 'The Guardian'}</span>
        </nav>
      )}

      <div className="layout">
        <main className="main-col">
          {page === 'home' && (
            <>
              {searchQuery && (
                <p className="search-note">
                  Results for <strong>“{searchQuery}”</strong>{' '}
                  <button type="button" className="text-btn" onClick={() => runSearch('')}>Clear</button>
                </p>
              )}
              <section className="block">
                <Headline articles={headlineItems} addToList={toggle} savedIds={savedIds} status={status} />
              </section>
              {(moreItems.length > 0 || totalPages > 1) && (
                <section className="block">
                  <h2 className="section-head">More stories</h2>
                  <NewsGrid
                    items={moreItems}
                    onSave={toggle}
                    savedIds={savedIds}
                    status={status}
                    error={error}
                    page={currentPage}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                  />
                </section>
              )}
            </>
          )}
          {page === 'watch' && (
            <section className="block">
              <h2 className="section-head">Latest videos</h2>
              <WatchGrid
                items={videos}
                onSave={toggleWatch}
                savedIds={watchIds}
                status={vStatus}
                error={vError}
                onLoadMore={vLoadMore}
              />
            </section>
          )}
          {page === 'contact' && (
            <section className="block page-content">
              <h2>Get in touch</h2>
              <p>
                Spotted a bug, have a story tip, or want to suggest a feature? The quickest way to reach me is
                through the links below. I read everything, even if replies take a day or two.
              </p>
              <div className="contact-links">
                <a href="https://github.com/kongowild/wheather" target="_blank" rel="noreferrer">GitHub</a>
                <a href="https://twitter.com/" target="_blank" rel="noreferrer">Twitter</a>
                <a href="https://instagram.com/" target="_blank" rel="noreferrer">Instagram</a>
                <a href="https://discord.com/" target="_blank" rel="noreferrer">Discord</a>
              </div>
            </section>
          )}
        </main>

        <aside className="side-col">
          <section className="panel panel-weather" aria-label="Weather">
            <WeatherCard />
          </section>

          <section className="panel panel-saved">
            {page === 'watch' ? (
              <>
                <h2 className="panel-title">Watch later</h2>
                <SavedList
                  items={watchList}
                  onRemove={removeWatch}
                  empty="Videos you save will show up here."
                  getImage={(v) => v.thumbnail}
                  getMeta={(v) => [v.channel, formatDate(v.publishedAt)].filter(Boolean).join(' · ')}
                />
              </>
            ) : (
              <>
                <h2 className="panel-title">Reading list</h2>
                <SavedList
                  items={list}
                  onRemove={remove}
                  empty="Tap Save on any story to read it later."
                  getImage={(a) => a.image}
                  getMeta={(a) => [a.sectionName, formatDate(a.date)].filter(Boolean).join(' · ')}
                />
              </>
            )}
          </section>

          <section className="panel panel-calendar" aria-label="Calendar">
            <Calendar />
          </section>

          <section className="panel panel-blog">
            <BlogSection />
          </section>

          <section className="panel panel-profile" aria-label="About the editor">
            <div className="profile-head">
              <div className="monogram" aria-hidden="true">K</div>
              <div>
                <div className="profile-name">kongowild</div>
                <div className="profile-handle">@kongowild · Editor, Bengaluru</div>
              </div>
            </div>
            <p className="profile-bio">Building delightful UIs and curating tech stories. Runs on filter coffee.</p>
            <div className="profile-stats">
              <span><strong>128</strong> following</span>
              <span><strong>3.2k</strong> followers</span>
              <span><strong>54</strong> lists</span>
            </div>
            <div className="profile-actions">
              <button className="btn" type="button">Follow</button>
              <button className="btn ghost" type="button">Message</button>
            </div>
          </section>
        </aside>
      </div>

      <footer className="site-footer">
        <div className="footer-brand">Kongowild <em>News</em></div>
        <div className="footer-links">
          <a href="https://instagram.com/" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://twitter.com/" target="_blank" rel="noreferrer">Twitter</a>
          <a href="https://discord.com/" target="_blank" rel="noreferrer">Discord</a>
          <a href="https://github.com/kongowild/wheather" target="_blank" rel="noreferrer">GitHub</a>
        </div>
        <div className="footer-copy">© {new Date().getFullYear()} Kongowild News. News from The Guardian, weather from OpenWeather.</div>
      </footer>
    </div>
  );
}

export default App;
