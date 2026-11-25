// Section 2, lesson 3. Drafted from standard fundamentals; review before removing status: 'draft'.
export default {
  id: 'deep-cut',
  title: 'The deep cut',
  level: 'beginner',
  section: 'cutting',
  order: 3,
  status: 'draft',
  buildsOn: ['under-cut'],
  category: 'Offense',
  tags: ['cutting', 'deep cut', 'huck'],
  summary: 'Pull your defender toward the disc, then go deep into the space behind them.',
  view: [16, 66],
  overviewDefense: true,
  disc: 'H1',
  players: [
    { id: 'H1', team: 'O', label: 'H1', pos: [20, 62] },
    { id: 'C1', team: 'O', label: 'C1', pos: [24, 44] },
    { id: 'M', team: 'D', label: 'M', pos: [17.2, 59.4] },
    { id: 'D1', team: 'D', label: 'D', pos: [27, 47.8] },
  ],
  steps: [
    {
      caption: 'C1 takes a few hard steps under, toward the disc. D comes with them to stop the under cut.',
      focus: ['C1'],
      moves: [
        { id: 'C1', to: [24.6, 49], kind: 'jog' },
        { id: 'D1', to: [27.6, 52.6], kind: 'defense', start: 0.1 },
      ],
    },
    {
      caption: 'C1 plants and goes deep into the space behind D. H1 throws into that space, and C1 runs onto it.',
      focus: ['C1'],
      zones: [{ x: 25, y: 18, w: 14, h: 16, label: 'Deep space', tone: 'open' }],
      moves: [
        { id: 'C1', to: [31, 23], kind: 'cut' },
        { id: 'D1', to: [28.4, 31], kind: 'defense', start: 0.25 },
      ],
      throw: { from: 'H1', to: 'C1', kind: 'huck', at: 0.4 },
      duration: 3.2,
    },
  ],
  coaching: [
    'Go deep when there’s space behind your defender.',
    'Sell the under first so the defender comes toward the disc.',
    'Look back early to find the disc, then attack it. Don’t wait for it to come down.',
  ],
  mistakes: ['Going deep when the defender is already behind you.', 'Turning to look too late and misjudging the disc.'],
};
