// Section 1, lesson 1. Drafted from standard fundamentals; review before removing status: 'draft'.
// Two versions: the force can go either way, and the open/break sides swap with it.

const OPEN = { label: 'Open side', tone: 'open' };
const BREAK = { label: 'Break side', tone: 'break' };
const right = { x: 23, y: 40, w: 16, h: 24 };
const left = { x: 1, y: 40, w: 16, h: 24 };

// Build the four steps for one force. The marker steps to the side it's taking away; D moves to the open side (x = dX).
function forceSteps({ name, blocked, open, markSide, openZone, breakZone, dX }) {
  return [
    {
      caption: `H1 has the disc. M, the marker, stands on H1’s ${markSide} side, taking away the ${blocked}. That’s a ${name} force: H1 is pushed to throw ${open}s.`,
      focus: ['M'],
      moves: [{ id: 'M', to: markSide === 'backhand' ? [17.4, 59.6] : [22.6, 59.6], kind: 'defense', end: 0.35 }],
      duration: 3.4,
    },
    {
      caption: 'The side M leaves free is the OPEN side. Throws there are easy.',
      focus: ['H1'],
      zones: [{ ...openZone, ...OPEN }],
      moves: [],
      duration: 2.6,
    },
    {
      caption: 'The side M blocks is the BREAK side. Throws there have to get around M, so they’re harder.',
      focus: ['M'],
      zones: [{ ...breakZone, ...BREAK }],
      moves: [],
      duration: 2.6,
    },
    {
      caption: 'The whole defense plays the same force. Downfield, D sets up on the open side of C1, because that’s where the throw will go.',
      focus: ['D1'],
      zones: [{ ...openZone, ...OPEN }],
      moves: [{ id: 'D1', via: [[dX, 44.4]], to: [dX, 48.6], kind: 'defense' }],
      duration: 3,
    },
  ];
}

export default {
  id: 'the-force',
  title: 'The force',
  level: 'beginner',
  section: 'field',
  order: 1,
  status: 'draft',
  category: 'Defense',
  tags: ['force', 'open side', 'break side', 'marking', 'flick force', 'backhand force'],
  summary: 'The marker takes away one side of the field, so the whole defense knows which side the throw is going to. The force can go either way.',
  view: [38, 68],
  overviewDefense: true,
  disc: 'H1',
  players: [
    { id: 'H1', team: 'O', label: 'H1', pos: [20, 62] },
    { id: 'C1', team: 'O', label: 'C1', pos: [20, 47] },
    { id: 'M', team: 'D', label: 'M', pos: [20, 58.6] },
    { id: 'D1', team: 'D', label: 'D', pos: [20, 43.4] },
  ],
  variants: [
    {
      id: 'flick',
      label: 'Flick force',
      outcome: 'Marker on the backhand side, so the open side is to H1’s flick side.',
      steps: forceSteps({ name: 'flick (forehand)', blocked: 'backhand', open: 'flick', markSide: 'backhand', openZone: right, breakZone: left, dX: 23.6 }),
    },
    {
      id: 'backhand',
      label: 'Backhand force',
      outcome: 'Marker on the flick side, so the open side is to H1’s backhand side.',
      steps: forceSteps({ name: 'backhand', blocked: 'flick', open: 'backhand', markSide: 'flick', openZone: left, breakZone: right, dX: 16.4 }),
    },
  ],
  coaching: [
    'The force can go either way. Your team calls it before each point, and everyone plays the same one.',
    'Open and break sides swap with the force, so check the call every point.',
    'Marker: take away the break side. Don’t try to stop everything.',
    'Downfield: position on the open side of your player, where the throw is headed.',
  ],
  mistakes: [
    'Playing last point’s force after the call changed.',
    'Downfield defender guarding the break side, which leaves the open side, where the throw is going, wide open.',
    'Marker drifting toward the middle, which opens up the break side.',
  ],
};
