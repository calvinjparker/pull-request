// Section 1, lesson 1. Drafted from standard fundamentals; review before removing status: 'draft'.
export default {
  id: 'the-force',
  title: 'The force',
  level: 'beginner',
  section: 'field',
  order: 1,
  status: 'draft',
  category: 'Defense',
  tags: ['force', 'open side', 'break side', 'marking'],
  summary: 'The marker takes away one side of the field, so the whole defense knows which side the throw is going to.',
  view: [38, 68],
  overviewDefense: true,
  disc: 'H1',
  players: [
    { id: 'H1', team: 'O', label: 'H1', pos: [20, 62] },
    { id: 'C1', team: 'O', label: 'C1', pos: [20, 47] },
    { id: 'M', team: 'D', label: 'M', pos: [17.4, 59.6] },
    { id: 'D1', team: 'D', label: 'D', pos: [20, 43.4] },
  ],
  steps: [
    {
      caption: 'H1 has the disc. M, the marker, stands on one side of H1: here, H1’s backhand side. That takes away the backhand, so it’s called a flick (forehand) force.',
      focus: ['M'],
      moves: [],
      duration: 3.2,
    },
    {
      caption: 'The side M leaves free is the OPEN side. Throws there are easy.',
      focus: ['H1'],
      zones: [{ x: 23, y: 40, w: 16, h: 24, label: 'Open side', tone: 'open' }],
      moves: [],
      duration: 2.6,
    },
    {
      caption: 'The side M blocks is the BREAK side. Throws there have to get around M, so they’re harder.',
      focus: ['M'],
      zones: [{ x: 1, y: 40, w: 16, h: 24, label: 'Break side', tone: 'break' }],
      moves: [],
      duration: 2.6,
    },
    {
      caption: 'The whole defense plays the same force. Downfield, D sets up on the open side of C1, because that’s where the throw will go.',
      focus: ['D1'],
      zones: [{ x: 23, y: 40, w: 16, h: 24, label: 'Open side', tone: 'open' }],
      moves: [{ id: 'D1', via: [[23.6, 44.4]], to: [23.6, 48.6], kind: 'defense' }],
      duration: 3,
    },
  ],
  coaching: [
    'Your team calls the force before each point. Everyone plays the same one.',
    'Marker: take away the break side. Don’t try to stop everything.',
    'Downfield: position on the open side of your player, where the throw is headed.',
  ],
  mistakes: [
    'Downfield defender guarding the break side, which leaves the open side, where the throw is going, wide open.',
    'Marker drifting toward the middle, which opens up the break side.',
  ],
};
