import { useEffect, useMemo, useRef, useState } from 'react';
import { buildSnapshots, clamp, versionsOf, STEP_SECONDS } from '../engine.js';
import PlayCanvas from './PlayCanvas.jsx';

// Playing through runs steps back to back with no hold; a step can add one with `pause` (seconds).

export default function PlayViewer({ play: base }) {
  const versions = useMemo(() => versionsOf(base), [base]);
  const [vi, setVi] = useState(0);
  useEffect(() => setVi(0), [base]);
  const play = versions[Math.min(vi, versions.length - 1)];
  const isCompare = versions.some((v) => v.version && v.version.tone && v.version.tone !== 'neutral');
  const snaps = useMemo(() => buildSnapshots(play), [play]);
  const n = play.steps.length;
  const [mode, setMode] = useState('walk');
  const [time, setTime] = useState(0); // timeline position: step index + fraction
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const stopAt = useRef(n); // where playback should stop (end, or end of one step)
  const hold = useRef(0);

  useEffect(() => { setTime(0); setPlaying(false); }, [play]);

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    let raf;
    const tick = (now) => {
      // rAF timestamps can be slightly earlier than performance.now(), so never go backwards.
      const dt = Math.max(0, (now - last) / 1000) * speed;
      last = now;
      setTime((cur) => {
        if (hold.current > 0) { hold.current -= dt; return cur; }
        const i = Math.min(Math.floor(cur), n - 1);
        const dur = play.steps[i].duration ?? STEP_SECONDS;
        let next = Math.max(0, cur + dt / dur);
        const boundary = i + 1;
        if (next >= stopAt.current) { setPlaying(false); return stopAt.current; }
        if (next >= boundary && cur < boundary && play.steps[i].pause) { hold.current = play.steps[i].pause; next = boundary; }
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed, n, play]);

  const stepIndex = clamp(Math.floor(time) || 0, 0, n - 1);
  const t = clamp(time - stepIndex);
  const done = time >= n;

  const playAll = () => {
    if (playing) return setPlaying(false);
    if (done) setTime(0);
    stopAt.current = n; hold.current = 0; setMode('walk'); setPlaying(true);
  };
  const playStep = (i) => {
    setMode('walk'); setTime(i); stopAt.current = i + 1; hold.current = 0.25; setPlaying(true);
  };

  const step = play.steps[stepIndex];

  return (
    <div className="viewer">
      <div className="seg" role="tablist" aria-label="View">
        <button role="tab" aria-selected={mode === 'walk'} className={mode === 'walk' ? 'on' : ''} onClick={() => setMode('walk')}>
          <span className="seg-title">▶ Animated</span><span className="seg-sub">step by step</span>
        </button>
        <button role="tab" aria-selected={mode === 'overview'} className={mode === 'overview' ? 'on' : ''} onClick={() => { setMode('overview'); setPlaying(false); }}>
          <span className="seg-title">▦ Diagram</span><span className="seg-sub">whole play at once</span>
        </button>
      </div>

      <div className={`canvas-wrap mode-${mode}`}>
        <span className="mode-tag">{mode === 'walk' ? `Step ${stepIndex + 1} of ${n}` : 'Whole play · numbers = order'}</span>
        {play.version && (
          <span className={`version-tag tone-${play.version.tone || 'neutral'}`}>
            {play.version.tone === 'good' ? '✓ ' : play.version.tone === 'bad' ? '✗ ' : ''}{play.version.label}
          </span>
        )}
        <PlayCanvas play={play} snaps={snaps} mode={mode} stepIndex={stepIndex} t={t} />
      </div>

      {mode === 'walk' ? (
        <>
          <div className="caption" aria-live="polite">
            <span className="step-no">Step {stepIndex + 1} of {n}</span>
            <p>{step.caption}</p>
          </div>
          <input className="scrub" type="range" min={0} max={n} step={0.01} value={time}
            aria-label="Timeline" onChange={(e) => { setPlaying(false); setTime(Number(e.target.value)); }} />
          <div className="controls">
            <button className="icon" aria-label="Previous step" onClick={() => playStep(Math.max(0, (t < 0.05 ? stepIndex - 1 : stepIndex)))}>⏮</button>
            <button className="primary" onClick={playAll}>{playing ? '❚❚ Pause' : done ? '↺ Replay' : '▶ Play'}</button>
            <button className="icon" aria-label="Next step" onClick={() => playStep(Math.min(n - 1, done ? n - 1 : stepIndex + (t > 0.95 ? 1 : 0)))}>⏭</button>
            <button className="speed" onClick={() => setSpeed(speed === 1 ? 0.5 : speed === 0.5 ? 1.5 : 1)}>{speed}×</button>
          </div>
          <div className="dots">
            {play.steps.map((_, i) => (
              <button key={i} className={i === stepIndex ? 'on' : ''} aria-label={`Play step ${i + 1}`} onClick={() => playStep(i)}>{i + 1}</button>
            ))}
          </div>
        </>
      ) : (
        <ol className="step-list">
          {play.steps.map((s, i) => (
            <li key={i}><button onClick={() => playStep(i)}><span className="num">{i + 1}</span>{s.caption}</button></li>
          ))}
        </ol>
      )}

      {versions.length > 1 && (
        <div className="versions">
          <p className="versions-prompt">{isCompare ? 'Compare: the right way vs. the mistake' : base.variantsPrompt || 'Choose a version'}</p>
          <div className="version-tabs" role="tablist" aria-label="Versions">
            {versions.map((v, i) => {
              const tone = v.version.tone || 'neutral';
              return (
                <button key={v.version.id} role="tab" aria-selected={i === vi} className={`${i === vi ? 'on' : ''} tone-${tone}`}
                  onClick={() => { setVi(i); setMode('walk'); }}>
                  {tone !== 'neutral' && <span className="v-kicker">{tone === 'good' ? '✓ Do this' : '✗ Not this'}</span>}
                  <span className="v-label">{v.version.label}</span>
                </button>
              );
            })}
          </div>
          {play.version.outcome && <p className={`outcome tone-${play.version.tone || 'neutral'}`}>{play.version.outcome}</p>}
        </div>
      )}
    </div>
  );
}
