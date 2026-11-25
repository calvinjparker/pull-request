// Section 2, lesson 1. Drafted from standard fundamentals; review before removing status: 'draft'.
const players = [
  { id: 'H1', team: 'O', label: 'H1', pos: [20, 62] },
  { id: 'C1', team: 'O', label: 'C1', pos: [24, 46] },
  { id: 'M', team: 'D', label: 'M', pos: [17.2, 59.4] },
  { id: 'D1', team: 'D', label: 'D', pos: [24.8, 41.4] },
];

export default {
  id: 'why-cut',
  title: 'Why we cut',
  level: 'beginner',
  section: 'cutting',
  order: 1,
  status: 'draft',
  buildsOn: ['the-force'],
  category: 'Offense',
  tags: ['cutting', 'getting open', 'separation'],
  summary: 'Standing still lets your defender take the throw away. Moving with purpose forces them to react, and that reaction is what gets you open.',
  view: [36, 66],
  overviewDefense: true,
  disc: 'H1',
  players,
  variants: [
    {
      id: 'cut',
      label: 'Cut to get open',
      tone: 'good',
      outcome: 'Result: C1 gets a step on D and gets the disc.',
      steps: [
        {
          caption: 'C1 is downfield with D right behind them. H1 has the disc with a flick force on.',
          focus: ['C1'],
          moves: [],
          duration: 2.2,
        },
        {
          caption: 'C1 sprints into open space toward the disc on the open side. D has to react, so they end up a step behind, and H1 throws the flick.',
          focus: ['C1'],
          moves: [
            { id: 'C1', to: [31.5, 53], kind: 'cut' },
            { id: 'D1', to: [27.6, 46.6], kind: 'defense', start: 0.2 },
          ],
          throw: { from: 'H1', to: 'C1', kind: 'flick', at: 0.55 },
          duration: 2.8,
        },
      ],
    },
    {
      id: 'stand',
      label: 'Stand still',
      tone: 'bad',
      outcome: 'Result: C1 stays covered, and there’s nothing to throw to.',
      steps: [
        {
          caption: 'C1 is downfield with D right behind them. H1 has the disc with a flick force on.',
          focus: ['C1'],
          moves: [],
          duration: 2.2,
        },
        {
          caption: 'C1 waits for the disc to come to them. D simply steps in front, between C1 and H1, and takes the throw away.',
          focus: ['D1'],
          moves: [{ id: 'D1', via: [[29.4, 44.6], [27.4, 50.4]], to: [22.6, 51.2], kind: 'defense' }],
          lanes: [{ from: 'H1', to: 'C1', tone: 'blocked', at: 0.7, label: '' }],
          duration: 2.8,
        },
      ],
    },
  ],
  coaching: [
    'You get open by making your defender react, not by waiting.',
    'Move with purpose: every cut is going somewhere for a reason.',
    'Cut toward space, not toward where other players already are.',
  ],
  mistakes: ['Standing still and waiting for the disc to come to you.'],
};
