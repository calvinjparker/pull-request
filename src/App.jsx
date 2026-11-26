import { useEffect, useMemo, useState } from 'react';
import { plays, getPlay, lessonsIn, advancedPlays, lessonPosition, neighbours } from './plays/index.js';
import { sections } from './sections.js';
import { calls, WHEN, rulesSource } from './rules.js';
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

const searchText = (p) => [p.title, p.summary, p.category, ...(p.tags || [])].join(' ').toLowerCase();
const stepsLabel = (p) => (p.variants ? `${p.variants.length} versions to compare` : `${p.steps.length} steps`);

function Card({ p, number }) {
  return (
    <a href={`#/play/${p.id}`} className="card">
      <span className="card-head">
        {number != null && <span className="lesson-num">{number}</span>}
        <strong>{p.title}</strong>
        {p.status === 'draft' && <span className="draft-chip">Draft</span>}
      </span>
      {p.summary && <span>{p.summary}</span>}
      <small>{stepsLabel(p)}</small>
    </a>
  );
}

function PlayList({ level }) {
  const [q, setQ] = useState('');
  const needle = q.trim().toLowerCase();

  let body;
  if (needle) {
    const hits = plays.filter((p) => searchText(p).includes(needle));
    body = hits.length ? <ul className="cards">{hits.map((p) => <li key={p.id}><Card p={p} /></li>)}</ul>
      : <p className="empty">No plays match “{q}”.</p>;
  } else if (level === 'beginner') {
    body = sections.map((s) => {
      const items = lessonsIn(s.id);
      return (
        <section key={s.id} className="path-section">
          <h2><span className="sec-num">{s.number}</span>{s.title}</h2>
          <p className="sec-blurb">{s.blurb}</p>
          {items.length ? (
            <ul className="cards">{items.map((p, i) => <li key={p.id}><Card p={p} number={`${s.number}.${i + 1}`} /></li>)}</ul>
          ) : <p className="soon">Coming soon</p>}
        </section>
      );
    });
  } else {
    const g = {};
    for (const p of advancedPlays) (g[p.category] ||= []).push(p);
    body = Object.entries(g).map(([cat, items]) => (
      <section key={cat}>
        <h2>{cat}</h2>
        <ul className="cards">{items.map((p) => <li key={p.id}><Card p={p} /></li>)}</ul>
      </section>
    ));
  }

  return (
    <main className="list">
      <TopTabs current={level} />
      <input className="search" type="search" placeholder="Search all plays" value={q} onChange={(e) => setQ(e.target.value)} />
      {body}
    </main>
  );
}

function TopTabs({ current }) {
  const tab = (id, href, label) => (
    <a role="tab" aria-selected={current === id} className={current === id ? 'on' : ''} href={href}>{label}</a>
  );
  return (
    <div className="level-tabs" role="tablist" aria-label="Section">
      {tab('beginner', '#/', 'Beginner')}
      {tab('advanced', '#/advanced', 'Advanced')}
      {tab('rules', '#/rules', 'Rules')}
    </div>
  );
}

// League rules: one card per call. Toggle between what happens if the call is accepted or contested.
function RulesPage() {
  const [mode, setMode] = useState('uncontested');
  const [q, setQ] = useState('');
  const needle = q.trim().toLowerCase();
  const shown = calls.filter((c) => !needle || [c.name, c.caller, c.note].join(' ').toLowerCase().includes(needle));
  return (
    <main className="list rules">
      <TopTabs current="rules" />
      <p className="rules-intro">What happens after each call, by when it happened. From the league’s <em>{rulesSource}</em>.</p>
      <div className="seg rules-seg" role="tablist" aria-label="Call outcome">
        <button role="tab" aria-selected={mode === 'uncontested'} className={mode === 'uncontested' ? 'on' : ''} onClick={() => setMode('uncontested')}>
          <span className="seg-title">Accepted</span><span className="seg-sub">call not contested</span>
        </button>
        <button role="tab" aria-selected={mode === 'contested'} className={mode === 'contested' ? 'on' : ''} onClick={() => setMode('contested')}>
          <span className="seg-title">Contested</span><span className="seg-sub">other team disagrees</span>
        </button>
      </div>
      <input className="search" type="search" placeholder="Search calls (e.g. pick, travel)" value={q} onChange={(e) => setQ(e.target.value)} />
      {shown.length === 0 && <p className="empty">No calls match “{q}”.</p>}
      <ul className="cards">
        {shown.map((c) => (
          <li key={c.id} id={`rule-${c.id}`} className="rule-card">
            <div className="rule-head">
              <strong>{c.name}</strong>
              <span className="caller">Called by: {c.caller}</span>
            </div>
            {c.note && <p className="rule-note">{c.note}</p>}
            <dl>
              {WHEN.map((w) => {
                const v = c[mode][w.key];
                return (
                  <div key={w.key} className={v ? '' : 'na'}>
                    <dt>{w.label}</dt>
                    <dd>{v || 'Doesn’t apply'}</dd>
                  </div>
                );
              })}
            </dl>
          </li>
        ))}
      </ul>
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
  const pos = lessonPosition(play);
  const { prev, next } = neighbours(play);
  const builds = (play.buildsOn || []).map(getPlay).filter(Boolean);
  const backHref = play.level === 'beginner' ? '#/' : '#/advanced';
  const num = (p) => { const q = lessonPosition(p); return q ? `${q.section.number}.${q.lesson} ` : ''; };
  return (
    <main className="detail">
      <div className="detail-head">
        <a href={backHref} className="back">← {play.level === 'beginner' ? 'Beginner' : 'Advanced'}</a>
        <button className="share" onClick={share}>{copied ? 'Link copied' : 'Share'}</button>
      </div>
      {pos ? <p className="eyebrow">Section {pos.section.number}: {pos.section.title} · Lesson {pos.lesson}</p>
        : <p className="eyebrow">Advanced · {play.category}</p>}
      <h1>{play.title}</h1>
      {play.status === 'draft' && <p className="draft-note">Draft: still being reviewed, details may change.</p>}
      {play.summary && <p className="summary">{play.summary}</p>}
      {builds.length > 0 && (
        <p className="builds">Builds on: {builds.map((b, i) => <span key={b.id}>{i ? ', ' : ''}<a href={`#/play/${b.id}`}>{num(b)}{b.title}</a></span>)}</p>
      )}
      <PlayViewer play={play} />
      {play.coaching?.length > 0 && (
        <section className="notes"><h3>Coaching points</h3><ul>{play.coaching.map((c, i) => <li key={i}>{c}</li>)}</ul></section>
      )}
      {play.mistakes?.length > 0 && (
        <section className="notes warn"><h3>Common mistakes</h3><ul>{play.mistakes.map((c, i) => <li key={i}>{c}</li>)}</ul></section>
      )}
      {(prev || next) && (
        <nav className="lesson-nav">
          {prev ? <a href={`#/play/${prev.id}`} className="prev"><small>Previous</small>{num(prev)}{prev.title}</a> : <span />}
          {next ? <a href={`#/play/${next.id}`} className="next"><small>Next lesson</small>{num(next)}{next.title} →</a> : <span />}
        </nav>
      )}
      <Legend />
    </main>
  );
}

export default function App() {
  const route = useRoute();
  const m = route.match(/^play\/([a-z0-9-]+)/);
  const play = m && getPlay(m[1]);
  useEffect(() => { document.title = play ? `${play.title} · Force of Habit` : route.startsWith('rules') ? 'Rules · Force of Habit' : 'Force of Habit'; }, [play, route]);
  return (
    <div className="app">
      <header className="top"><a href="#/" className="brand"><img src="/icon.svg" alt="" />Force of Habit</a></header>
      {m && !play ? <main className="list"><p className="empty">That play doesn’t exist. <a href="#/">See all plays</a></p></main>
        : play ? <PlayPage play={play} /> : route.startsWith('rules') ? <RulesPage />
        : <PlayList level={route.startsWith('advanced') ? 'advanced' : 'beginner'} />}
    </div>
  );
}
