// Shared first step: same setup in both versions.
const setup = {
  caption: 'H1 has the disc near the goal line, close to the sideline. M is marking a flick force, standing on the break side.',
  focus: ['M', 'H1'],
  moves: [],
  duration: 2.4,
};

const cutToCorner = [
  { id: 'C1', via: [[25.5, 17]], to: [36.5, 13.5], kind: 'cut' },
  { id: 'D1', to: [24.6, 20.8], kind: 'defense', start: 0.15 }, // trailing a step behind
];

export default {
  id: 'closing',
  title: 'Closing the mark',
  category: 'Defense',
  tags: ['marking', 'force', 'end zone', 'flat mark'],
  summary: 'An open-side cutter has beaten their defender to the corner. Keep the force and it’s an easy score; close to a flat mark and the throw is gone.',
  view: [6, 38],
  overviewDefense: true,
  disc: 'H1',
  players: [
    { id: 'H1', team: 'O', label: 'H1', pos: [32, 24] },
    { id: 'C1', team: 'O', label: 'C1', pos: [21, 28] },
    { id: 'M', team: 'D', label: 'M', pos: [29.3, 21.5] },
    { id: 'D1', team: 'D', label: 'D', pos: [17.6, 30.4] },
  ],
  variants: [
    {
      id: 'force',
      label: 'Keep the force',
      tone: 'bad',
      outcome: 'Result: easy upline throw, and they score.',
      steps: [
        setup,
        {
          caption: 'C1 cuts for the front corner of the end zone. D1 is trailing a step behind.',
          focus: ['C1'],
          moves: cutToCorner,
          lanes: [{ from: 'H1', to: 'C1', tone: 'threat', label: 'Easy throw', at: 0.55, labelSide: 'left' }],
        },
        {
          caption: 'M is still holding the force, so the upline flick to the corner is wide open. H1 throws it and C1 catches it before D1 can catch up. Score.',
          focus: ['H1', 'C1'],
          moves: [
            { id: 'C1', to: [37.4, 11.8], kind: 'jog' },
            { id: 'D1', via: [[28, 17.2]], to: [32.4, 15.6], kind: 'defense', start: 0.1 },
          ],
          throw: { from: 'H1', to: 'C1', kind: 'flick', at: 0.15, land: 0.85 },
        },
      ],
    },
    {
      id: 'close',
      label: 'Close (flat mark)',
      tone: 'good',
      outcome: 'Result: no easy throw, and the defender catches up.',
      steps: [
        setup,
        {
          caption: 'C1 cuts for the corner with D1 trailing. M sees it and closes: slides across to mark flat, square in front of H1, between H1 and the corner.',
          focus: ['M'],
          moves: [...cutToCorner, { id: 'M', via: [[31.4, 20.1]], to: [33.5, 20.8], kind: 'defense', start: 0.35, end: 0.75 }],
          lanes: [{ from: 'H1', to: 'C1', tone: 'blocked', at: 0.7, label: '' }],
        },
        {
          caption: 'H1 can’t get the upline throw past M. That buys time, and D1 catches up to C1 in the corner. The only throws left go around M, which is much harder.',
          focus: ['D1'],
          moves: [
            { id: 'C1', to: [37.4, 11.8], kind: 'jog' },
            { id: 'D1', via: [[28.4, 17.4]], to: [34.4, 15.4], kind: 'defense' },
          ],
        },
      ],
    },
  ],
  coaching: [
    'Close when an open-side cutter has beaten their defender and the upline throw is an easy score.',
    'Mark flat: square to the thrower, directly between them and the open receiver.',
    'You’re giving up a harder break throw to take away an easy score.',
    'Go back to the normal force once the cutter is covered again.',
  ],
  mistakes: [
    'Holding the force while the cutter is wide open in the corner.',
    'Closing when nobody has been beaten, which gives up a free break.',
  ],
};
