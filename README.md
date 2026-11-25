# Force of Habit

Repo: `calvinjparker/pull-request`.

A mobile-first web app for teaching ultimate frisbee plays with animated, easy-to-follow diagrams.
Each play has a **Walkthrough** (animated step by step, with captions) and an **Overview** (one static diagram, steps numbered).

- Static site: Vite + React, no backend. Deployed on Vercel from `main`.
- Installable on Android from Chrome ("Add to Home screen"), and works offline once opened.
- Every play has its own link: `/#/play/<id>`.

## Develop

```bash
npm install
npm run dev      # local dev server
npm run check    # validate all plays
npm run build    # runs check first, then builds to dist/
```

## Adding a play

Drop a new file in `src/plays/` (e.g. `src/plays/give-and-go.js`). It's picked up automatically; no registration needed.
`npm run check` (and every build, so every Vercel deploy) rejects a play with mistakes, such as a throw from someone who doesn't have the disc, or two players running through each other (any moving player passing within 3.1 yd of another). If it flags an overlap, add a `via` waypoint to route around.

### Levels and sections

- **Beginner** is a numbered path: sections (in `src/sections.js`) with lessons in order. Each lesson page shows its position ("Section 2 · Lesson 3"), any "Builds on" links, and Previous / Next lesson buttons.
- **Advanced** plays are grouped by `category` with no forced order.
- A section with no lessons yet shows "Coming soon".

### Versions (switchable buttons)

A play can have `variants` instead of `steps`. There are exactly two kinds, and they always look the same:

- **Right way vs mistake:** give one version `tone: 'good'` and one or more `tone: 'bad'`. The buttons read "✓ Do this" / "✗ Not this" under the heading "Compare: the right way vs. the mistake", with the right way first.
- **Valid options** (e.g. flick vs backhand force): no tone, plus a play-level `variantsPrompt` question such as "Which way is the force?".

Each version can have an `outcome` line shown under the buttons. The checker rejects mixing the two kinds.

### Coordinates

All positions are in **yards**. The field is drawn vertically, and the offense attacks **up** the screen.

```
x: 0 ──────────── 40   (left sideline → right sideline)
y: 0–20    attacking end zone (top)
y: 20–90   playing field (bricks at y 40 and 70)
y: 90–110  own end zone (bottom)
```

### Play format

```js
export default {
  id: 'under-cut',              // lowercase-with-dashes, used in the URL
  title: 'The under cut',
  level: 'beginner',            // 'beginner' (numbered path) or 'advanced' (grouped by category)
  section: 'vert',              // beginner only: a section id from src/sections.js
  order: 2,                     // position within its section (or within its category for advanced)
  buildsOn: ['the-force'],      // optional: earlier plays shown as "Builds on" links
  status: 'draft',              // optional: shows a Draft badge until reviewed; delete the line once approved
  category: 'Defense',          // topic; groups advanced plays on the home screen
  tags: ['cutting'],            // optional, searchable
  summary: 'One-line description.',
  view: [30, 70],               // optional: y range to show (default [25, 75])
  disc: 'H1',                   // who starts with the disc
  overviewDefense: true,        // optional: draw defenders' moves in the Overview (good for defense plays)

  players: [
    { id: 'H1', team: 'O', label: 'H1', pos: [20, 62] },   // team 'O' = offense (blue circle)
    { id: 'M',  team: 'D', label: 'M',  pos: [18, 60] },   // team 'D' = defense (red triangle)
  ],

  steps: [
    {
      caption: 'What happens in this step, in plain words.',
      focus: ['C1'],                                // optional: pulsing ring on key players (and only they get step numbers in the Overview)
      duration: 2.4,                                // optional: seconds at 1x speed
      pause: 0.6,                                   // optional: hold this long after the step when playing through (default: no hold)
      overviewSkip: true,                           // optional: leave this step out of the Overview diagram
      zones: [{ x: 23, y: 44, w: 15, h: 16, label: 'Open side', tone: 'open' }], // tone: open | break | neutral
      moves: [
        { id: 'C1', to: [31, 54], kind: 'cut' },              // kind: cut | jog | clear | defense
        { id: 'C2', to: [9, 47], via: [[23, 45]], kind: 'cut' }, // via = waypoints (plant / change direction)
        { id: 'D1', to: [28, 50], kind: 'defense', start: 0.2 }, // start/end = when in the step (0–1) the move runs
      ],
      pivot: { id: 'H1', dir: 'left' },               // optional: thrower pivots (planted foot) toward left/right; the thrower never moves
      lanes: [{ from: 'H1', to: 'C1', tone: 'blocked', at: 0.5 }],  // possible throws that DON'T happen: tone threat | blocked | open | break
                                                                 // optional label overrides the default text; labelSide: 'left' | 'right' and labelAt (0–1 along the lane) move it; label: '' hides it; "at" = when it appears in the step
      throw: { from: 'H1', to: 'C1', kind: 'flick', at: 0.45 },  // kind: flick | backhand | huck | dump | swing | hammer | scoober
                                                                 // at/land = release and catch time within the step (land defaults to 1)
    },
  ],

  coaching: ['Coaching point'],     // optional
  mistakes: ['Common mistake'],     // optional
};
```

The two plays in `src/plays/` now are **samples** to exercise the engine; replace them with real content.

Playback is continuous: a player who is still running at the end of one step and keeps moving at the start of the next carries straight through, with no stop. Players only ease to a stop when they actually stop.

## Project layout

```
src/engine.js               positions over time: easing, waypoints, throw arcs
src/validate.js             play checker (used by npm run check)
src/components/PlayCanvas   SVG field, players, disc, paths, zones
src/components/PlayViewer   walkthrough / overview, playback controls, timeline
src/plays/                  one file per play
public/                     icons, manifest, service worker
```
