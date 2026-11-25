// Checks a play object and returns a list of problems (empty list = valid).
// Used by `npm run check` (and therefore every build) so a broken play never ships.

const KINDS = ['cut', 'jog', 'clear', 'defense'];
const THROWS = ['flick', 'backhand', 'huck', 'dump', 'swing', 'hammer', 'scoober'];
const isPt = (p) => Array.isArray(p) && p.length === 2 && p.every((v) => typeof v === 'number' && Number.isFinite(v));
const onField = (p) => p[0] >= -3 && p[0] <= 43 && p[1] >= 0 && p[1] <= 110;

export function validatePlay(play) {
  const errs = [];
  const e = (msg) => errs.push(`${play?.id || '(no id)'}: ${msg}`);
  if (!play || typeof play !== 'object') return ['play is not an object'];
  for (const k of ['id', 'title', 'category']) if (typeof play[k] !== 'string' || !play[k]) e(`missing "${k}"`);
  if (play.id && !/^[a-z0-9-]+$/.test(play.id)) e('id must be lowercase letters, numbers and dashes');
  if (play.view && !(isPt(play.view) && play.view[0] < play.view[1])) e('view must be [yStart, yEnd]');

  const ids = new Set();
  for (const p of play.players || []) {
    if (ids.has(p.id)) e(`duplicate player id ${p.id}`);
    ids.add(p.id);
    if (!['O', 'D'].includes(p.team)) e(`player ${p.id}: team must be "O" or "D"`);
    if (!isPt(p.pos) || !onField(p.pos)) e(`player ${p.id}: bad pos`);
  }
  if (!ids.size) e('no players');
  if (!ids.has(play.disc)) e(`disc holder "${play.disc}" is not a player`);
  if (play.variants) {
    if (play.steps) e('use either "steps" or "variants", not both');
    if (!Array.isArray(play.variants) || play.variants.length < 2) e('"variants" needs at least two versions');
    const vids = new Set();
    for (const v of play.variants || []) {
      if (!v.id || !v.label) e('each variant needs an id and a label');
      if (vids.has(v.id)) e(`duplicate variant id ${v.id}`);
      vids.add(v.id);
      if (v.tone && !['good', 'bad', 'neutral'].includes(v.tone)) e(`variant ${v.id}: tone must be good, bad or neutral`);
      checkSteps(v.steps, `variant ${v.id}, `);
    }
  } else {
    checkSteps(play.steps, '');
  }
  return errs;

  function checkSteps(steps, prefix) {
  if (!Array.isArray(steps) || !steps.length) return e(`${prefix}needs at least one step`);
  let holder = play.disc;
  steps.forEach((s, i) => {
    const at = `${prefix}step ${i + 1}`;
    if (!s.caption) e(`${at}: missing caption`);
    for (const m of s.moves || []) {
      if (!ids.has(m.id)) e(`${at}: move for unknown player ${m.id}`);
      if (!isPt(m.to) || !onField(m.to)) e(`${at}: move ${m.id} has bad "to"`);
      if (m.via && !m.via.every(isPt)) e(`${at}: move ${m.id} has bad "via"`);
      if (m.kind && !KINDS.includes(m.kind)) e(`${at}: move kind must be one of ${KINDS.join(', ')}`);
      if ((m.start ?? 0) >= (m.end ?? 1)) e(`${at}: move ${m.id} start must be before end`);
    }
    for (const id of s.focus || []) if (!ids.has(id)) e(`${at}: focus on unknown player ${id}`);
    for (const l of s.lanes || []) {
      if (!ids.has(l.from)) e(`${at}: lane from unknown player ${l.from}`);
      if (!(ids.has(l.to) || (isPt(l.to) && onField(l.to)))) e(`${at}: lane to must be a player id or [x, y]`);
      if (l.tone && !['threat', 'blocked', 'open', 'break'].includes(l.tone)) e(`${at}: lane tone must be threat, blocked, open or break`);
    }
    if (s.throw) {
      const th = s.throw;
      if (th.from !== holder) e(`${at}: throw from ${th.from}, but ${holder} has the disc`);
      if (!ids.has(th.to)) e(`${at}: throw to unknown player ${th.to}`);
      if (th.kind && !THROWS.includes(th.kind)) e(`${at}: throw kind must be one of ${THROWS.join(', ')}`);
      if ((th.at ?? 0.5) >= (th.land ?? 1)) e(`${at}: throw "at" must be before "land"`);
      holder = th.to;
    }
  });
  }
}

export function validateAll(plays) {
  const errs = plays.flatMap(validatePlay);
  const seen = new Set();
  for (const p of plays) {
    if (seen.has(p.id)) errs.push(`duplicate play id ${p.id}`);
    seen.add(p.id);
  }
  return errs;
}
