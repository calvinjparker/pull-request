// Section 2, lesson 5. Drafted from standard fundamentals; review before removing status: 'draft'.
const LANE = { x: 26.5, y: 44, w: 12.5, h: 18, label: 'Open lane', tone: 'open' };

const setup = {
  caption: 'C1 just cut under to the open side, but the throw didn’t come.',
  focus: ['C1'],
  zones: [LANE],
  moves: [],
  duration: 2.4,
};

export default {
  id: 'clearing',
  title: 'Clearing out',
  level: 'beginner',
  section: 'cutting',
  order: 5,
  status: 'draft',
  buildsOn: ['under-cut'],
  category: 'Offense',
  tags: ['cutting', 'clearing', 'space'],
  summary: 'If your cut doesn’t get the disc, get out of the space so the next cutter can use it.',
  view: [30, 66],
  disc: 'H1',
  players: [
    { id: 'H1', team: 'O', label: 'H1', pos: [20, 62] },
    { id: 'C1', team: 'O', label: 'C1', pos: [32.5, 53] },
    { id: 'C2', team: 'O', label: 'C2', pos: [16, 36] },
    { id: 'M', team: 'D', label: 'M', pos: [17.2, 59.4] },
  ],
  variants: [
    {
      id: 'clear',
      label: 'Clear out',
      tone: 'good',
      outcome: 'Result: the lane is empty, so C2 gets the disc.',
      steps: [
        setup,
        {
          caption: 'C1 clears out right away, jogging up and out of the lane.',
          focus: ['C1'],
          zones: [LANE],
          moves: [{ id: 'C1', via: [[35, 44]], to: [30, 34], kind: 'clear' }],
        },
        {
          caption: 'With the lane empty, C2 cuts into it and gets the disc.',
          focus: ['C2'],
          zones: [LANE],
          moves: [{ id: 'C2', to: [31.5, 53], kind: 'cut' }],
          throw: { from: 'H1', to: 'C2', kind: 'flick', at: 0.55 },
        },
      ],
    },
    {
      id: 'stay',
      label: 'Stay in the lane',
      tone: 'bad',
      outcome: 'Result: C1 and C2 are in each other’s way, so there’s no throw.',
      steps: [
        setup,
        {
          caption: 'C1 stays standing in the lane, waiting.',
          focus: ['C1'],
          zones: [LANE],
          moves: [],
        },
        {
          caption: 'C2 cuts into the same space. Now two players are crowding one lane, and their defenders can cover both.',
          focus: ['C2'],
          zones: [LANE],
          moves: [{ id: 'C2', to: [29.2, 47.2], kind: 'cut' }],
          lanes: [{ from: 'H1', to: 'C2', tone: 'blocked', at: 0.7, label: '' }],
        },
      ],
    },
  ],
  coaching: [
    'If you don’t get the disc, clear out right away.',
    'Clear away from the lane, toward where the next cutter isn’t going.',
    'Clearing is part of the cut; it’s how you give the space to a teammate.',
  ],
  mistakes: ['Standing in the lane you just used.', 'Clearing slowly, so the next cutter has to wait.'],
};
