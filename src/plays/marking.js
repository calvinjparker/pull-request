// Section 1, lesson 2. Drafted from standard fundamentals; review before removing status: 'draft'.
// H1 never moves (pivot foot planted). Pivots are drawn as an arrow around H1.
const players = [
  { id: 'H1', team: 'O', label: 'H1', pos: [20, 62] },
  { id: 'C1', team: 'O', label: 'C1', pos: [24, 46] },
  { id: 'C2', team: 'O', label: 'C2', pos: [9.6, 50] },
  { id: 'M', team: 'D', label: 'M', pos: [16.8, 58.8] },
  { id: 'D2', team: 'D', label: 'D', pos: [14.2, 51.4] },
];

const setup = {
  caption: 'M sets up about an arm’s length from H1 (not touching), on the break side and slightly upfield, holding a flick force.',
  focus: ['M'],
  moves: [],
  duration: 2.8,
};

export default {
  id: 'marking',
  title: 'Marking',
  level: 'beginner',
  section: 'field',
  order: 2,
  status: 'draft',
  buildsOn: ['the-force'],
  category: 'Defense',
  tags: ['marking', 'force', 'footwork', 'pivot'],
  summary: 'Holding the force means moving your feet. When the thrower pivots to the break side, the marker slides with them.',
  view: [40, 68],
  overviewDefense: true,
  disc: 'H1',
  players,
  variants: [
    {
      id: 'move',
      label: 'Move your feet',
      tone: 'good',
      outcome: 'Result: the break side stays shut, so the throw goes to the open side.',
      steps: [
        setup,
        {
          caption: 'H1 keeps their pivot foot planted and pivots toward the break side to look for a backhand. M slides with the pivot and stays between H1 and the break side.',
          focus: ['M'],
          pivot: { id: 'H1', dir: 'left' },
          moves: [{ id: 'M', to: [16.2, 61.4], kind: 'defense', start: 0.15 }],
          lanes: [{ from: 'H1', to: 'C2', tone: 'blocked', at: 0.65, label: '' }],
        },
        {
          caption: 'H1 pivots back to the open side and M recovers to the normal mark. With the break side shut, H1 throws to C1 cutting on the open side.',
          focus: ['H1'],
          pivot: { id: 'H1', dir: 'right' },
          moves: [
            { id: 'M', to: [16.8, 58.8], kind: 'defense', end: 0.45 },
            { id: 'C1', to: [30, 53], kind: 'cut' },
          ],
          throw: { from: 'H1', to: 'C1', kind: 'flick', at: 0.55 },
        },
      ],
    },
    {
      id: 'flat-footed',
      label: 'Flat-footed',
      tone: 'bad',
      outcome: 'Result: H1 gets the backhand around the mark and breaks it.',
      steps: [
        setup,
        {
          caption: 'H1 pivots toward the break side. M stays planted and only reaches with their arms, so there’s room to get a backhand around them.',
          focus: ['M'],
          pivot: { id: 'H1', dir: 'left' },
          moves: [],
        },
        {
          caption: 'H1 throws the backhand around M to C2 on the break side, away from where the defense is set up.',
          focus: ['H1', 'C2'],
          moves: [{ id: 'C2', to: [8.4, 55], kind: 'cut' }],
          throw: { from: 'H1', to: 'C2', kind: 'backhand', at: 0.3, bend: -0.3 },
        },
      ],
    },
  ],
  coaching: [
    'Stay on the break side, about an arm’s length away. No touching, no wrapping around the thrower.',
    'Move your feet, not just your arms: when they pivot, you slide.',
    'Count the stall out loud. As the marker, you’re the one counting.',
    'Shown with a flick force; with a backhand force it’s the same, mirrored.',
  ],
  mistakes: [
    'Planting your feet and reaching, so the pivot gets around you.',
    'Drifting square in front of the thrower when you didn’t mean to, which opens the break. (Doing it on purpose is closing the mark, an advanced skill.)',
  ],
};
