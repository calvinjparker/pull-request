// Section 1, lesson 2. Drafted from standard fundamentals; review before removing status: 'draft'.
const players = [
  { id: 'H1', team: 'O', label: 'H1', pos: [20, 62] },
  { id: 'C1', team: 'O', label: 'C1', pos: [24, 47] },
  { id: 'C2', team: 'O', label: 'C2', pos: [10, 49] },
  { id: 'M', team: 'D', label: 'M', pos: [16.8, 58.8] },
  { id: 'D2', team: 'D', label: 'D', pos: [14.2, 50.4] },
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
  tags: ['marking', 'force', 'footwork'],
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
          caption: 'H1 pivots out toward the break side to look for a backhand. M slides with them and stays between H1 and the break side.',
          focus: ['M'],
          moves: [
            { id: 'H1', to: [16, 63], kind: 'jog' },
            { id: 'M', to: [13.6, 60], kind: 'defense' },
          ],
          lanes: [{ from: 'H1', to: 'C2', tone: 'blocked', at: 0.6, label: '' }],
        },
        {
          caption: 'H1 pivots back to the open side and M recovers to the normal mark. With the break side shut, H1 throws to C1 on the open side.',
          focus: ['H1'],
          moves: [
            { id: 'H1', to: [20, 62], kind: 'jog', end: 0.4 },
            { id: 'M', to: [16.8, 58.8], kind: 'defense', end: 0.45 },
            { id: 'C1', to: [30, 53], kind: 'cut' },
          ],
          throw: { from: 'H1', to: 'C1', kind: 'flick', at: 0.5 },
        },
      ],
    },
    {
      id: 'flat-footed',
      label: 'Flat-footed',
      tone: 'bad',
      outcome: 'Result: H1 gets around the mark and breaks it.',
      steps: [
        setup,
        {
          caption: 'H1 pivots out toward the break side. M stays planted and only reaches with their arms, so H1 gets outside the mark.',
          focus: ['M'],
          moves: [{ id: 'H1', to: [16, 63], kind: 'jog' }],
          lanes: [{ from: 'H1', to: 'C2', tone: 'break', label: 'Break open', at: 0.6 }],
        },
        {
          caption: 'H1 throws the backhand around M to C2 on the break side, away from where the defense is set up.',
          focus: ['H1', 'C2'],
          moves: [{ id: 'C2', to: [8, 55], kind: 'cut' }],
          throw: { from: 'H1', to: 'C2', kind: 'backhand', at: 0.3 },
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
