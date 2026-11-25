// Animation engine: turns play data into positions at any moment.
// Coordinates are in yards. x: 0–40 across the field (left → right).
// y: 0–110 down the field; offense attacks toward y = 0 (top of screen).
// Attacking end zone is y 0–20, playing field 20–90, own end zone 90–110.

export const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const lerp = (a, b, s) => [a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s];

// Point along a polyline at fraction s (0–1) of its total length.
export function polyPoint(pts, s) {
  if (pts.length === 1) return pts[0];
  const lens = pts.slice(1).map((p, i) => dist(pts[i], p));
  const total = lens.reduce((a, b) => a + b, 0) || 1;
  let target = s * total;
  for (let i = 0; i < lens.length; i++) {
    if (target <= lens[i] || i === lens.length - 1) return lerp(pts[i], pts[i + 1], lens[i] ? clamp(target / lens[i]) : 1);
    target -= lens[i];
  }
  return pts[pts.length - 1];
}

export const movePath = (from, m) => [from, ...(m.via || []), m.to];

export function moveAt(from, m, t) {
  const start = m.start ?? 0;
  const end = m.end ?? 1;
  return polyPoint(movePath(from, m), easeInOut(clamp((t - start) / (end - start || 1))));
}

const findMove = (step, id) => (step?.moves || []).find((mv) => mv.id === id);

// Does this player arrive still running (previous step's move ran to its end and this one starts right away)?
function continues(play, i, id) {
  const m = findMove(play.steps[i], id);
  const prev = findMove(play.steps[i - 1], id);
  return !!(m && prev && (prev.end ?? 1) >= 1 && (m.start ?? 0) <= 0);
}

// Positions and disc holder at the start of each step (plus the final state).
export function buildSnapshots(play) {
  let pos = Object.fromEntries(play.players.map((p) => [p.id, p.pos]));
  let holder = play.disc;
  const snaps = [{ pos, holder }];
  for (const step of play.steps) {
    pos = { ...pos };
    for (const m of step.moves || []) pos[m.id] = m.to;
    if (step.throw) holder = step.throw.to;
    snaps.push({ pos, holder });
  }
  return snaps;
}

export const STEP_SECONDS = 2.4; // default length of one step at 1x speed
const stepSecs = (play, k) => play.steps[k].duration ?? STEP_SECONDS;
// Seconds from the start of the play to fraction t of step k.
const secAt = (play, k, t) => {
  let s = 0;
  for (let j = 0; j < k; j++) s += stepSecs(play, j);
  return s + t * stepSecs(play, k);
};

const pathLen = (pts) => pts.slice(1).reduce((acc, p, i) => acc + dist(pts[i], p), 0);

// Smooth, non-overshooting curve through (time, distance) knots: zero speed at the ends,
// continuous speed in between (Fritsch–Carlson monotone cubic).
function monotoneCubic(T, D, x) {
  const n = T.length - 1;
  if (x <= T[0]) return D[0];
  if (x >= T[n]) return D[n];
  const h = [], d = [];
  for (let k = 0; k < n; k++) { h.push(T[k + 1] - T[k]); d.push((D[k + 1] - D[k]) / (h[k] || 1)); }
  const m = [0];
  for (let k = 1; k < n; k++) {
    m.push(d[k - 1] * d[k] <= 0 ? 0 : (3 * (h[k - 1] + h[k])) / ((2 * h[k] + h[k - 1]) / d[k - 1] + (h[k] + 2 * h[k - 1]) / d[k]));
  }
  m.push(0);
  for (let k = 0; k < n; k++) { // keep each segment from overshooting
    if (!d[k]) { m[k] = 0; m[k + 1] = 0; continue; }
    const a = m[k] / d[k], b = m[k + 1] / d[k], r = a * a + b * b;
    if (r > 9) { const t = 3 / Math.sqrt(r); m[k] = t * a * d[k]; m[k + 1] = t * b * d[k]; }
  }
  let k = 0;
  while (k < n - 1 && x > T[k + 1]) k++;
  const u = (x - T[k]) / (h[k] || 1), u2 = u * u, u3 = u2 * u;
  return (2 * u3 - 3 * u2 + 1) * D[k] + (u3 - 2 * u2 + u) * h[k] * m[k] + (-2 * u3 + 3 * u2) * D[k + 1] + (u3 - u2) * h[k] * m[k + 1];
}

// A run that carries across steps is animated as ONE movement: the player still reaches each
// step's "to" exactly when that step ends, but speeds up and slows down smoothly instead of
// stopping dead at every step boundary.
function positionAt(play, snaps, i, id, t) {
  const m = findMove(play.steps[i], id);
  const from = snaps[i].pos[id];
  if (!m) return from;
  let a = i;
  while (continues(play, a, id)) a--;
  let b = i;
  while (b + 1 < play.steps.length && continues(play, b + 1, id)) b++;
  if (a === b) return moveAt(from, m, t);
  const pts = [snaps[a].pos[id]];
  const T = [secAt(play, a, findMove(play.steps[a], id).start ?? 0)];
  const D = [0];
  for (let k = a; k <= b; k++) {
    const mk = findMove(play.steps[k], id);
    const seg = [pts[pts.length - 1], ...(mk.via || []), mk.to];
    pts.push(...seg.slice(1));
    T.push(secAt(play, k, mk.end ?? 1));
    D.push(D[D.length - 1] + pathLen(seg));
  }
  const total = D[D.length - 1] || 1;
  return polyPoint(pts, monotoneCubic(T, D, secAt(play, i, t)) / total);
}

export const DISC_OFFSET = [1.1, -1.1];
const held = (p) => [p[0] + DISC_OFFSET[0], p[1] + DISC_OFFSET[1]];

const THROW_BEND = { flick: 0.12, backhand: -0.12, huck: 0.18, dump: -0.08, swing: 0.08 };

// Geometry of a throw: start, end and curve control point.
export function throwGeometry(play, snaps, i) {
  const th = play.steps[i].throw;
  const at = th.at ?? 0.5;
  const land = th.land ?? 1;
  const a = held(positionAt(play, snaps, i, th.from, at));
  const b = held(positionAt(play, snaps, i, th.to, land));
  const bend = th.bend ?? THROW_BEND[th.kind] ?? 0;
  const mid = lerp(a, b, 0.5);
  const len = dist(a, b);
  const nx = len ? -(b[1] - a[1]) / len : 0;
  const ny = len ? (b[0] - a[0]) / len : 0;
  const ctrl = [mid[0] + nx * len * bend, mid[1] + ny * len * bend];
  return { a, b, ctrl, at, land, kind: th.kind };
}

const bezier = (a, c, b, s) => [
  (1 - s) ** 2 * a[0] + 2 * (1 - s) * s * c[0] + s ** 2 * b[0],
  (1 - s) ** 2 * a[1] + 2 * (1 - s) * s * c[1] + s ** 2 * b[1],
];

// Full frame: every player's position, and the disc (position + scale for "height").
export function frameAt(play, snaps, i, t) {
  const pos = {};
  for (const p of play.players) pos[p.id] = positionAt(play, snaps, i, p.id, t);
  const step = play.steps[i];
  let disc = { pos: held(pos[snaps[i].holder]), scale: 1, inAir: false };
  if (step.throw) {
    const g = throwGeometry(play, snaps, i);
    if (t >= g.land) disc = { pos: held(pos[step.throw.to]), scale: 1, inAir: false };
    else if (t > g.at) {
      const s = (t - g.at) / (g.land - g.at);
      const lift = g.kind === 'huck' ? 0.9 : 0.35;
      disc = { pos: bezier(g.a, g.ctrl, g.b, s), scale: 1 + lift * Math.sin(Math.PI * s), inAir: true };
    }
  }
  return { pos, disc };
}

// A play can have switchable versions ("what if" comparisons). Each version shares the
// play's players and setup but has its own steps. Returns one playable object per version.
export function versionsOf(play) {
  if (!play.variants) return [play];
  return play.variants.map((v) => ({ ...play, steps: v.steps, version: v }));
}
