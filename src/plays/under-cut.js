// Section 2, lesson 2. Drafted from standard fundamentals; review before removing status: 'draft'.
export default {
  id: 'under-cut',
  title: 'The under cut',
  level: 'beginner',
  section: 'cutting',
  order: 2,
  status: 'draft',
  buildsOn: ['why-cut'],
  category: 'Offense',
  tags: ['cutting', 'under cut'],
  summary: 'Sell deep, plant hard, and come back toward the disc on the open side.',
  view: [34, 66],
  overviewDefense: true,
  disc: 'H1',
  players: [
    { id: 'H1', team: 'O', label: 'H1', pos: [20, 62] },
    { id: 'C1', team: 'O', label: 'C1', pos: [24, 46] },
    { id: 'M', team: 'D', label: 'M', pos: [17.2, 59.4] },
    { id: 'D1', team: 'D', label: 'D', pos: [28.8, 49] },
  ],
  steps: [
    {
      caption: 'C1 jogs a few steps deep to sell a deep cut. D backs up to stay with them.',
      focus: ['C1'],
      moves: [
        { id: 'C1', to: [24.6, 40.6], kind: 'jog' },
        { id: 'D1', to: [28.8, 38.6], kind: 'defense', start: 0.1 },
      ],
    },
    {
      caption: 'C1 plants hard and cuts under, back toward the disc on the open side. H1 throws the flick.',
      focus: ['C1'],
      zones: [{ x: 29.5, y: 44, w: 9.5, h: 18, label: 'Open side', tone: 'open' }],
      moves: [
        { id: 'C1', to: [33, 54], kind: 'cut' },
        { id: 'D1', to: [27.2, 49.4], kind: 'defense', start: 0.2 },
      ],
      throw: { from: 'H1', to: 'C1', kind: 'flick', at: 0.5 },
    },
    {
      caption: 'C1 catches, turns and looks upfield right away.',
      focus: ['C1'],
      moves: [],
      duration: 1.6,
    },
  ],
  coaching: [
    'Make the fake believable so the defender commits.',
    'Plant and change direction sharply; no rounded cuts.',
    'Cut on an angle toward the disc, not flat across the field.',
  ],
  mistakes: ['Drifting cut with no change of speed.', 'Cutting before the thrower is ready.'],
};
