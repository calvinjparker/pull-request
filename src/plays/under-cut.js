// SAMPLE play — placeholder content to exercise the engine. Replace or edit freely.
export default {
  id: 'under-cut',
  title: 'The under cut',
  level: 'beginner',
  section: 'vert',
  order: 2,
  status: 'draft',
  category: 'Fundamentals',
  tags: ['cutting', 'vertical stack'],
  summary: 'Sell deep, plant hard, and come back toward the disc on the open side.',
  view: [30, 70],
  disc: 'H1',
  players: [
    { id: 'H1', team: 'O', label: 'H1', pos: [20, 62] },
    { id: 'H2', team: 'O', label: 'H2', pos: [13, 66] },
    { id: 'C1', team: 'O', label: 'C1', pos: [20, 50] },
    { id: 'C2', team: 'O', label: 'C2', pos: [20, 46] },
    { id: 'C3', team: 'O', label: 'C3', pos: [20, 42] },
    { id: 'C4', team: 'O', label: 'C4', pos: [20, 38] },
    { id: 'M', team: 'D', label: 'M', pos: [17.8, 59.9] },
    { id: 'D1', team: 'D', label: 'D', pos: [23.5, 48] },
  ],
  steps: [
    {
      caption: 'C1 jogs deep a few steps to sell a deep cut. Their defender backs up to stay with them.',
      focus: ['C1'],
      moves: [
        { id: 'C1', to: [24.2, 46.8], kind: 'jog' },
        { id: 'D1', to: [26.5, 43.5], kind: 'defense', start: 0.1 },
      ],
    },
    {
      caption: 'C1 plants hard and cuts back under toward the disc on the open side. H1 throws the flick.',
      focus: ['C1', 'H1'],
      zones: [{ x: 23, y: 44, w: 15, h: 16, label: 'Open side', tone: 'open' }],
      moves: [
        { id: 'C1', to: [31, 54], kind: 'cut' },
        { id: 'D1', to: [29, 50.5], kind: 'defense', start: 0.2 },
      ],
      throw: { from: 'H1', to: 'C1', kind: 'flick', at: 0.45 },
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
