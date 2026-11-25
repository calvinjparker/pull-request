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
`npm run check` (and every build, so every Vercel deploy) rejects a play with mistakes, such as a throw from someone who doesn't have the disc.

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
  category: 'Fundamentals',     // groups plays on the home screen
  tags: ['cutting'],            // optional, searchable
  summary: 'One-line description.',
  order: 1,                     // optional sort order within the list
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
      overviewSkip: true,                           // optional: leave this step out of the Overview diagram
      zones: [{ x: 23, y: 44, w: 15, h: 16, label: 'Open side', tone: 'open' }], // tone: open | break | neutral
      moves: [
        { id: 'C1', to: [31, 54], kind: 'cut' },              // kind: cut | jog | clear | defense
        { id: 'C2', to: [9, 47], via: [[23, 45]], kind: 'cut' }, // via = waypoints (plant / change direction)
        { id: 'D1', to: [28, 50], kind: 'defense', start: 0.2 }, // start/end = when in the step (0–1) the move runs
      ],
      lanes: [{ from: 'H1', to: 'C1', tone: 'blocked', at: 0.5 }],  // possible throws that DON'T happen: tone threat | blocked | open | break
                                                                 // optional label overrides the default text; labelSide: 'left' | 'right' moves it; "at" = when it appears in the step
      throw: { from: 'H1', to: 'C1', kind: 'flick', at: 0.45 },  // kind: flick | backhand | huck | dump | swing | hammer | scoober
                                                                 // at/land = release and catch time within the step (land defaults to 1)
    },
  ],

  coaching: ['Coaching point'],     // optional
  mistakes: ['Common mistake'],     // optional
};
```

The two plays in `src/plays/` now are **samples** to exercise the engine; replace them with real content.

## Project layout

```
src/engine.js               positions over time: easing, waypoints, throw arcs
src/validate.js             play checker (used by npm run check)
src/components/PlayCanvas   SVG field, players, disc, paths, zones
src/components/PlayViewer   walkthrough / overview, playback controls, timeline
src/plays/                  one file per play
public/                     icons, manifest, service worker
```
