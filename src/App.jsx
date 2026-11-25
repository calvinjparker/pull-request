import { useEffect, useMemo, useState } from 'react';
import { plays, getPlay } from './plays/index.js';
import PlayViewer from './components/PlayViewer.jsx';
import Legend from './components/Legend.jsx';

// Hash routing (#/play/<id>) keeps every play shareable as a plain link on static hosting.
function useRoute() {
  const read = () => window.location.hash.replace(/^#\/?/, '');
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const on = () => { setRoute(read()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

function PlayList() {
  const [q, setQ] = useState('');
  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const hits = plays.filter((p) => !needle || [p.title, p.summary, ...(p.tags || [])].join(' ').toLowerCase().includes(needle));
    const g = {};
    for (const p of hits) (g[p.category] ||= []).push(p);
    return Object.entries(g);
  }, [q]);

  return (
    <main className="list">
      <input className="search" type="search" placeholder="Search plays" value={q} onChange={(e) => setQ(e.target.value)} />
      {groups.length === 0 && <p className="empty">No plays match “{q}”.</p>}
      {groups.map(([cat, items]) => (
        <section key={cat}>
          <h2>{cat}</h2>
          <ul>
            {items.map((p) => (
              <li key={p.id}>
                <a href={`#/play/${p.id}`} className="card">
                  <strong>{p.title}</strong>
                  {p.summary && <span>{p.summary}</span>}
                  <small>{p.steps.length} steps{p.tags?.length ? ` · ${p.tags.join(' · ')}` : ''}</small>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}

function PlayPage({ play }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: play.title, url }); } catch { /* cancelled */ }
    } else {
      try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* ignore */ }
    }
  };
  return (
    <main className="detail">
      <div className="detail-head">
        <a href="#/" className="back">← Plays</a>
        <button className="share" onClick={share}>{copied ? 'Link copied' : 'Share'}</button>
      </div>
      <h1>{play.title}</h1>
      {play.summary && <p className="summary">{play.summary}</p>}
      <PlayViewer play={play} />
      {play.coaching?.length > 0 && (
        <section className="notes"><h3>Coaching points</h3><ul>{play.coaching.map((c, i) => <li key={i}>{c}</li>)}</ul></section>
      )}
      {play.mistakes?.length > 0 && (
        <section className="notes warn"><h3>Common mistakes</h3><ul>{play.mistakes.map((c, i) => <li key={i}>{c}</li>)}</ul></section>
      )}
      <Legend />
    </main>
  );
}

export default function App() {
  const route = useRoute();
  const m = route.match(/^play\/([a-z0-9-]+)/);
  const play = m && getPlay(m[1]);
  useEffect(() => { document.title = play ? `${play.title} · Force of Habit` : 'Force of Habit'; }, [play]);
  return (
    <div className="app">
      <header className="top"><a href="#/" className="brand"><img src="/icon.svg" alt="" />Force of Habit</a></header>
      {m && !play ? <main className="list"><p className="empty">That play doesn’t exist. <a href="#/">See all plays</a></p></main>
        : play ? <PlayPage play={play} /> : <PlayList />}
    </div>
  );
}
