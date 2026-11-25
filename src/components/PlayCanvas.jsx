import { frameAt, heldAt, movePath, throwGeometry } from '../engine.js';

const FIELD_W = 40;
const FIELD_L = 110;
const PAD = 3;

// First candidate point that is at least `gap` yards from every point in `avoid`.
function freeSpot(cands, avoid, gap = 3) {
  const clearance = (c) => Math.min(...avoid.map((a) => Math.hypot(a[0] - c[0], a[1] - c[1])), Infinity);
  for (const c of cands) if (clearance(c) >= gap) return c;
  return cands.reduce((best, c) => (clearance(c) > clearance(best) ? c : best), cands[0]); // most room available
}

const pathD = (pts) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ');
const curveD = (g) => `M${g.a[0]},${g.a[1]} Q${g.ctrl[0]},${g.ctrl[1]} ${g.b[0]},${g.b[1]}`;

function Field({ y0, y1 }) {
  const stripes = [];
  for (let y = 0; y < FIELD_L; y += 5) {
    if (y + 5 < y0 - PAD || y > y1 + PAD) continue;
    stripes.push(<rect key={y} x={0} y={y} width={FIELD_W} height={5} className={(y / 5) % 2 ? 'stripe-b' : 'stripe-a'} />);
  }
  return (
    <g className="field">
      <rect x={-PAD} y={y0 - PAD} width={FIELD_W + PAD * 2} height={y1 - y0 + PAD * 2} className="turf-edge" />
      {stripes}
      <rect x={0} y={0} width={FIELD_W} height={20} className="endzone" />
      <rect x={0} y={90} width={FIELD_W} height={20} className="endzone" />
      <rect x={0} y={0} width={FIELD_W} height={FIELD_L} className="line" />
      <line x1={0} x2={FIELD_W} y1={20} y2={20} className="line" />
      <line x1={0} x2={FIELD_W} y1={90} y2={90} className="line" />
      {[40, 70].map((y) => (
        <g key={y} className="brick"><line x1={19.4} x2={20.6} y1={y - 0.6} y2={y + 0.6} /><line x1={20.6} x2={19.4} y1={y - 0.6} y2={y + 0.6} /></g>
      ))}
      {y0 < 20 && <text x={20} y={10} className="ez-label">END ZONE</text>}
    </g>
  );
}

function Zone({ z }) {
  return (
    <g className={`zone zone-${z.tone || 'neutral'}`}>
      <rect x={z.x} y={z.y} width={z.w} height={z.h} rx={1} />
      {z.label && <text x={z.x + z.w / 2} y={z.y + 2.6}>{z.label}</text>}
    </g>
  );
}

function Player({ p, at, focus }) {
  const [x, y] = at;
  const off = p.team === 'O';
  return (
    <g className={`player ${off ? 'offense' : 'defense'} ${focus ? 'focus' : ''}`} transform={`translate(${x},${y})`}>
      {focus && <circle r={2.15} className="focus-ring" />}
      {off ? <circle r={1.5} className="body" /> : <path d="M0,-1.8 L1.7,1.2 L-1.7,1.2 Z" className="body" />}
      <text y={off ? 0.5 : 0.75} className="label">{p.label}</text>
    </g>
  );
}

function Disc({ disc }) {
  return (
    <g transform={`translate(${disc.pos[0]},${disc.pos[1]}) scale(${disc.scale})`} className="disc">
      {disc.inAir && <ellipse cy={0.9} rx={0.7} ry={0.25} className="disc-shadow" />}
      <circle r={0.75} />
    </g>
  );
}

function Badge({ at, n }) {
  return (
    <g className="badge" transform={`translate(${at[0]},${at[1]})`}>
      <circle r={1.05} />
      <text y={0.38}>{n}</text>
    </g>
  );
}

function Arrows() {
  const mk = (id, cls) => (
    <marker id={id} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" className={cls} />
    </marker>
  );
  return <defs>{mk('ah-cut', 'ah-cut')}{mk('ah-clear', 'ah-clear')}{mk('ah-throw', 'ah-throw')}{mk('ah-def', 'ah-def')}{mk('ah-lane-threat', 'ah-lane-threat')}{mk('ah-lane-open', 'ah-lane-open')}{mk('ah-lane-break', 'ah-lane-break')}</defs>;
}

const moveClass = (m) => `path path-${m.kind || 'cut'}`;
const markerFor = (m) => (m.kind === 'defense' ? 'url(#ah-def)' : m.kind === 'clear' ? 'url(#ah-clear)' : 'url(#ah-cut)');

// Paths for one step (used as ghost guides in walkthrough and as the diagram in overview).
function StepPaths({ play, snaps, i, number, showDefense, avoid = [] }) {
  const step = play.steps[i];
  const moves = (step.moves || []).filter((m) => showDefense || m.kind !== 'defense');
  const g = step.throw ? throwGeometry(play, snaps, i) : null;
  return (
    <g>
      {moves.map((m) => {
        const pts = movePath(snaps[i].pos[m.id], m);
        return <path key={m.id} d={pathD(pts)} className={moveClass(m)} markerEnd={markerFor(m)} />;
      })}
      {g && <path d={curveD(g)} className="path path-throw" markerEnd="url(#ah-throw)" />}
      {number != null && moves.filter((m) => (showDefense || m.kind !== 'defense') && (!step.focus || step.focus.includes(m.id))).map((m) => <Badge key={`b-${m.id}`} at={freeSpot([[1.8, 2.2], [-1.8, 2.2], [1.8, -2.2], [-1.8, -2.2], [2.8, 0], [-2.8, 0]].map(([dx, dy]) => [m.to[0] + dx, m.to[1] + dy]), avoid)} n={number} />)}
      {number != null && g && <Badge at={freeSpot([0.5, 0.35, 0.65, 0.25, 0.75].map((s) => [0, 1].map((k) => (1 - s) ** 2 * g.a[k] + 2 * (1 - s) * s * g.ctrl[k] + s ** 2 * g.b[k])), avoid)} n={number} />}
    </g>
  );
}

// Throwing lanes: possible throws that don't happen (an easy score, a blocked lane, a break option).
const LANE_TONES = { threat: 'Easy throw', blocked: 'Blocked', open: 'Open', break: 'Break' };
function Lane({ from, to, lane, avoid = [] }) {
  const dx = to[0] - from[0], dy = to[1] - from[1];
  const len = Math.hypot(dx, dy) || 1;
  const a = [from[0] + (dx / len) * 2, from[1] + (dy / len) * 2];
  const b = [to[0] - (dx / len) * 2.2, to[1] - (dy / len) * 2.2];
  const tone = lane.tone || 'threat';
  // Label (and the X on a blocked lane) sits just past the middle, clear of the thrower and mark.
  const f0 = lane.labelAt ?? (tone === 'blocked' ? 0.55 : tone === 'threat' ? 0.7 : 0.5);
  const at = (f) => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
  const fs = lane.labelAt != null ? [f0] : [f0, f0 + 0.1, f0 - 0.1, f0 + 0.2, f0 - 0.2, f0 + 0.3, f0 - 0.3, f0 + 0.35].filter((f) => f > 0.15 && f < 0.92);
  const mid = freeSpot(fs.map(at), avoid, 3.6);
  const label = lane.label ?? LANE_TONES[tone];
  const flip = lane.labelSide === 'left' ? -1 : lane.labelSide === 'right' ? 1 : dx < 0 ? -1 : 1;
  return (
    <g className={`lane lane-${tone}`}>
      <path d={`M${a[0]},${a[1]} L${b[0]},${b[1]}`} markerEnd={tone === 'blocked' ? undefined : `url(#ah-lane-${tone})`} />
      {tone === 'blocked' && (
        <g transform={`translate(${mid[0]},${mid[1]})`} className="lane-x"><circle r={1.5} /><path d="M-0.8,-0.8 L0.8,0.8 M0.8,-0.8 L-0.8,0.8" /></g>
      )}
      {label && (
        <text x={mid[0] + flip * (tone === 'blocked' ? 2.1 : 1.2)} y={mid[1] + 0.5} textAnchor={flip > 0 ? 'start' : 'end'}>{label}</text>
      )}
    </g>
  );
}

export default function PlayCanvas({ play, snaps, mode, stepIndex, t }) {
  const [y0, y1] = play.view || [25, 75];
  const vb = `${-PAD} ${y0 - PAD} ${FIELD_W + PAD * 2} ${y1 - y0 + PAD * 2}`;
  const overview = mode === 'overview';
  const frame = overview ? null : frameAt(play, snaps, stepIndex, t);
  const step = play.steps[stepIndex];
  const pos = overview ? snaps[0].pos : frame.pos;
  const focus = new Set(overview ? [] : step.focus || []);
  const zones = overview ? play.steps.flatMap((s) => s.zones || []) : step.zones || [];
  const endPt = (ref, p) => (Array.isArray(ref) ? ref : p[ref]);
  let lanes;
  if (overview) {
    // One lane per thrower→target, keeping the latest state, drawn at the end-of-step positions.
    const byKey = new Map();
    play.steps.forEach((s, i) => !s.overviewSkip && (s.lanes || []).forEach((l) => byKey.set(`${l.from}>${l.to}`, { l, p: snaps[i + 1].pos })));
    lanes = [...byKey.values()].map(({ l, p }) => ({ l, a: p[l.from], b: endPt(l.to, p) }));
  } else {
    lanes = (step.lanes || []).filter((l) => t >= (l.at ?? 0)).map((l) => ({ l, a: pos[l.from], b: endPt(l.to, pos) }));
  }
  const disc = overview ? { pos: heldAt(play, pos, play.disc), scale: 1 } : frame.disc;

  return (
    <svg className="canvas" viewBox={vb} role="img" aria-label={`${play.title} diagram`}>
      <Arrows />
      <Field y0={y0} y1={y1} />
      <g className={overview ? 'zones-faint' : ''}>{zones.map((z, k) => <Zone key={k} z={z} />)}</g>
      {overview
        ? play.steps.map((st, i) => (st.overviewSkip ? null
          : <StepPaths key={i} play={play} snaps={snaps} i={i} number={play.steps.length > 1 ? i + 1 : null} showDefense={play.overviewDefense} avoid={Object.values(pos)} />))
        : <g className="ghost"><StepPaths play={play} snaps={snaps} i={stepIndex} showDefense /></g>}
      {lanes.map(({ l, a, b }, k) => <Lane key={k} lane={l} from={a} to={b} avoid={Object.values(pos)} />)}
      {play.players.map((p) => <Player key={p.id} p={p} at={pos[p.id]} focus={focus.has(p.id)} />)}
      <Disc disc={disc} />
      <text x={FIELD_W + PAD - 0.6} y={y0 - PAD + 2.2} className="attack-label">ATTACK ↑</text>
    </svg>
  );
}
