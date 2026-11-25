// Section 2, lesson 1. Drafted from standard fundamentals; review before removing status: 'draft'.
// D starts in a real defensive position: underneath C1 (between C1 and the disc) on the open side.
const players = [
  { id: 'H1', team: 'O', label: 'H1', pos: [20, 62] },
  { id: 'C1', team: 'O', label: 'C1', pos: [24, 45] },
  { id: 'M', team: 'D', label: 'M', pos: [17.2, 59.4] },
  { id: 'D1', team: 'D', label: 'D', pos: [24.4, 50.2] },
];

const setup = {
  caption: 'C1 is downfield. D is in good position: underneath C1 (between C1 and the disc) and on the open side, so the easy throw to C1 is taken away.',
  focus: ['D1'],
  moves: [],
  lanes: [{ from: 'H1', to: 'C1', tone: 'blocked', at: 0.3, label: '' }],
  duration: 3,
};

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
  summary: 'A defender in good position takes the throw away. Standing still lets them keep it that way; moving forces them to react, and that reaction is what gets you open.',
  view: [32, 66],
  overviewDefense: true,
  disc: 'H1',
  players,
  variants: [
    {
      id: 'cut',
      label: 'Make them react',
      tone: 'good',
      outcome: 'Result: D is pulled out of position, so C1 gets open and gets the disc.',
      steps: [
        setup,
        {
          caption: 'C1 runs hard deep. D has to turn and run with them, giving up their spot underneath.',
          focus: ['C1'],
          moves: [
            { id: 'C1', to: [24.4, 37.4], kind: 'cut' },
            { id: 'D1', via: [[29.4, 44.4]], to: [29.2, 36.2], kind: 'defense', start: 0.15 },
          ],
        },
        {
          caption: 'C1 stops and comes back toward the disc. D is still moving the other way, so C1 is open, and H1 throws.',
          focus: ['C1'],
          moves: [
            { id: 'C1', to: [31.5, 51], kind: 'cut' },
            { id: 'D1', via: [[29.6, 34.4]], to: [30, 42.6], kind: 'defense' },
          ],
          throw: { from: 'H1', to: 'C1', kind: 'flick', at: 0.55 },
        },
      ],
    },
    {
      id: 'stand',
      label: 'Stand still',
      tone: 'bad',
      outcome: 'Result: C1 stays covered, and there’s nothing to throw to.',
      steps: [
        setup,
        {
          caption: 'C1 waits for the disc to come to them. D doesn’t have to do anything: they stay underneath, the throw stays blocked, and the stall count keeps climbing.',
          focus: ['C1'],
          moves: [],
          lanes: [{ from: 'H1', to: 'C1', tone: 'blocked', label: '' }],
          duration: 3,
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
