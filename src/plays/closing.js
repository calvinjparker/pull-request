export default {
  id: 'closing',
  title: 'Closing the mark',
  category: 'Defense',
  tags: ['marking', 'force', 'end zone', 'flat mark'],
  summary: 'When an open-side cutter beats their defender into the end zone, the marker switches to a flat mark to take away the easy upline throw.',
  view: [6, 42],
  overviewDefense: true, // show defenders' movement in the Overview diagram
  disc: 'H1',
  players: [
    { id: 'H1', team: 'O', label: 'H1', pos: [26, 33] },
    { id: 'H2', team: 'O', label: 'H2', pos: [19, 38] },
    { id: 'C1', team: 'O', label: 'C1', pos: [30, 24] },
    { id: 'C2', team: 'O', label: 'C2', pos: [14, 22] },
    { id: 'M', team: 'D', label: 'M', pos: [24, 30.8] },
    { id: 'D1', team: 'D', label: 'D', pos: [32.4, 26.4] },
    { id: 'D2', team: 'D', label: 'D', pos: [17, 24.6] },
  ],
  steps: [
    {
      caption: 'Normal mark: M holds the force, taking away the break side. The open side is where the offense is supposed to throw, and downfield defenders cover it.',
      focus: ['M'],
      zones: [
        { x: 28, y: 14, w: 11, h: 17, label: 'Open side', tone: 'open' },
        { x: 1, y: 14, w: 22, h: 17, label: 'Break side', tone: 'break' },
      ],
      moves: [],
      duration: 2.8,
    },
    {
      caption: 'C1 beats their defender into the end zone on the open side. If M keeps the normal force, H1 has an easy upline throw for the score.',
      focus: ['C1'],
      moves: [
        { id: 'C1', via: [[31, 22.5]], to: [33, 11], kind: 'cut' },
        { id: 'D1', to: [36, 17.5], kind: 'defense', start: 0.3 },
      ],
      lanes: [{ from: 'H1', to: 'C1', tone: 'threat', label: 'Easy score', at: 0.55 }],
      duration: 2.6,
    },
    {
      caption: 'M closes: steps across to mark flat, square in front of H1 and directly between H1 and C1. The upline throw is gone.',
      focus: ['M'],
      moves: [
        { id: 'M', to: [26.9, 30.1], kind: 'defense', end: 0.5 },
        { id: 'D1', to: [36, 14.5], kind: 'defense' },
      ],
      lanes: [{ from: 'H1', to: 'C1', tone: 'blocked', at: 0.5 }],
      duration: 2.6,
    },
    {
      caption: 'The trade-off: H1 can now throw around M to the break side. That throw is harder and slower, which gives D1 time to recover and D2 a chance to make a play.',
      focus: ['H1'],
      moves: [
        { id: 'D1', to: [35.6, 12.6], kind: 'defense' },
        { id: 'D2', to: [17.5, 22.2], kind: 'defense' },
      ],
      lanes: [
        { from: 'H1', to: 'C1', tone: 'blocked', labelSide: 'left' },
        { from: 'H1', to: 'C2', tone: 'break', label: 'Break (harder)' },
      ],
      duration: 3,
    },
    {
      caption: 'Once C1 is covered again, M goes back to the normal force.',
      focus: ['M'],
      moves: [{ id: 'M', to: [24, 30.8], kind: 'defense' }],
      duration: 2,
      overviewSkip: true,
    },
  ],
  coaching: [
    'Close when an open-side cutter has clearly beaten their defender and the upline throw is an easy score.',
    'Mark flat: square to the thrower, directly between them and the open receiver.',
    'You’re trading an easy completion for a harder break throw.',
    'Go back to the normal force once the threat is covered.',
  ],
  mistakes: [
    'Holding the normal force while the open-side cutter is wide open for the score.',
    'Closing when nobody has beaten their defender, which gives up a free break.',
  ],
};
