import { frameAt, movePath, throwGeometry } from '../engine.js';

const FIELD_W = 40;
const FIELD_L = 110;
const PAD = 3;

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
      {focus && <circle r={2.6} className="focus-ring" />}
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
  return <defs>{mk('ah-cut', 'ah-cut')}{mk('ah-clear', 'ah-clear')}{mk('ah-throw', 'ah-throw')}{mk('ah-def', 'ah-def')}</defs>;
}

const moveClass = (m) => `path path-${m.kind || 'cut'}`;
const markerFor = (m) => (m.kind === 'defense' ? 'url(#ah-def)' : m.kind === 'clear' ? 'url(#ah-clear)' : 'url(#ah-cut)');

// Paths for one step (used as ghost guides in walkthrough and as the diagram in overview).
function StepPaths({ play, snaps, i, number, showDefense }) {
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
      {number != null && moves.filter((m) => m.kind !== 'defense').map((m) => <Badge key={`b-${m.id}`} at={m.to.map((v, k) => v + (k ? 2.2 : 1.8))} n={number} />)}
      {number != null && g && <Badge at={[0, 1].map((k) => 0.25 * g.a[k] + 0.5 * g.ctrl[k] + 0.25 * g.b[k])} n={number} />}
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
  const disc = overview ? { pos: [pos[play.disc][0] + 1.1, pos[play.disc][1] - 1.1], scale: 1 } : frame.disc;

  return (
    <svg className="canvas" viewBox={vb} role="img" aria-label={`${play.title} diagram`}>
      <Arrows />
      <Field y0={y0} y1={y1} />
      {zones.map((z, k) => <Zone key={k} z={z} />)}
      {overview
        ? play.steps.map((_, i) => <StepPaths key={i} play={play} snaps={snaps} i={i} number={play.steps.length > 1 ? i + 1 : null} />)
        : <g className="ghost"><StepPaths play={play} snaps={snaps} i={stepIndex} showDefense /></g>}
      {play.players.map((p) => <Player key={p.id} p={p} at={pos[p.id]} focus={focus.has(p.id)} />)}
      <Disc disc={disc} />
      <text x={FIELD_W + PAD - 0.6} y={y0 - PAD + 2.2} className="attack-label">ATTACK ↑</text>
    </svg>
  );
}
