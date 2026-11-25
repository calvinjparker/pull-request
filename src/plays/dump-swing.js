// SAMPLE play — placeholder content to exercise the engine. Replace or edit freely.
export default {
  id: 'dump-swing',
  title: 'Dump and swing',
  category: 'Fundamentals',
  tags: ['handling', 'reset'],
  summary: 'Trapped on the sideline with the stall climbing: reset to the dump, then swing to the open field.',
  view: [32, 72],
  disc: 'H1',
  players: [
    { id: 'H1', team: 'O', label: 'H1', pos: [35, 56] },
    { id: 'H2', team: 'O', label: 'H2', pos: [29, 59] },
    { id: 'H3', team: 'O', label: 'H3', pos: [14, 62] },
    { id: 'C1', team: 'O', label: 'C1', pos: [24, 42] },
    { id: 'C2', team: 'O', label: 'C2', pos: [24, 37] },
    { id: 'M', team: 'D', label: 'M', pos: [33, 53.6] },
  ],
  steps: [
    {
      caption: 'Stall count climbing and nothing open upfield. H2, the dump, fakes upfield.',
      focus: ['H2'],
      moves: [{ id: 'H2', to: [29.5, 54.5], kind: 'jog' }],
      duration: 1.6,
    },
    {
      caption: 'H2 cuts back behind H1, away from the marker. H1 throws the dump.',
      focus: ['H2', 'H1'],
      moves: [{ id: 'H2', to: [27, 65], kind: 'cut' }],
      throw: { from: 'H1', to: 'H2', kind: 'dump', at: 0.55 },
    },
    {
      caption: 'H3 moves into space in the middle. H2 swings the disc across the field.',
      focus: ['H3', 'H2'],
      moves: [{ id: 'H3', to: [16, 56], kind: 'cut' }],
      throw: { from: 'H2', to: 'H3', kind: 'swing', at: 0.4 },
    },
    {
      caption: 'The disc is on the far side where the defense isn’t set. C1 attacks the new space.',
      focus: ['C1', 'H3'],
      zones: [{ x: 2, y: 38, w: 16, h: 14, label: 'New space', tone: 'open' }],
      moves: [{ id: 'C1', via: [[23, 45]], to: [9, 47], kind: 'cut' }],
      throw: { from: 'H3', to: 'C1', kind: 'backhand', at: 0.5 },
    },
  ],
  coaching: [
    'Dump: start upfield of the thrower, then cut back behind, not into the marker.',
    'Swing fast, before the defense resets.',
  ],
  mistakes: ['Waiting until stall 9 to look for the dump.'],
};
