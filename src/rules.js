// League rules: what happens after each call. Transcribed as written from
// "Ultimate Frisbee League - Updated Rules Table". Edit here when the league updates its rules.
// Each outcome is split by when the call happened: before the throw, on a completed throw, or on an incomplete throw.
// null = doesn't apply.

export const rulesSource = 'Ultimate Frisbee League – Updated Rules Table';

export const calls = [
  {
    id: 'defensive-foul',
    name: 'Defensive foul (on catcher)',
    caller: 'Offense',
    uncontested: {
      pre: 'Disc stays with offense at spot of foul',
      completed: 'Play continues',
      incomplete: 'Fouled player gets disc at spot of foul (goal line if in end zone)',
    },
    contested: {
      pre: 'Disc stays with offense, stall count continues',
      completed: 'Play continues',
      incomplete: 'Disc returns to thrower; stall count ≥5 goes to 5, otherwise resumes',
    },
  },
  {
    id: 'offensive-foul-thrower',
    name: 'Offensive foul (thrower)',
    caller: 'Defense',
    uncontested: {
      pre: 'Turnover to defense',
      completed: 'Turnover at throwing position',
      incomplete: 'Turnover stands, stall reset to 0',
    },
    contested: {
      pre: 'Disc stays with offense',
      completed: 'Disc goes back to thrower, stall −1',
      incomplete: 'Disc returns to thrower; stall count ≥5 goes to 5, otherwise resumes',
    },
  },
  {
    id: 'offensive-foul-catcher',
    name: 'Offensive foul (catcher)',
    caller: 'Defense',
    uncontested: {
      pre: 'Turnover to defense',
      completed: 'Disc returns to thrower',
      incomplete: 'Turnover stands',
    },
    contested: {
      pre: 'Disc stays with offense',
      completed: 'Disc stays with receiver',
      incomplete: 'Disc returns to thrower, stall −1',
    },
  },
  {
    id: 'strip',
    name: 'Strip',
    caller: 'Offense',
    note: 'Only applies to caught discs.',
    uncontested: {
      pre: null,
      completed: 'Offense keeps disc where strip occurred, stall reset to 1',
      incomplete: null,
    },
    contested: {
      pre: null,
      completed: 'Disc returns to thrower; stall count ≥5 goes to 5, otherwise resumes',
      incomplete: null,
    },
  },
  {
    id: 'pick',
    name: 'Pick',
    caller: 'Defense',
    uncontested: {
      pre: 'Play stops, defender catches up, stall resumes',
      completed: 'If unrelated to the pick, play continues; if the picked player is involved, disc returns to thrower',
      incomplete: 'Turnover at spot where disc lands',
    },
    contested: {
      pre: 'Disc returns to thrower; stall count ≥5 goes to 5, otherwise resumes',
      completed: 'Play continues',
      incomplete: 'Turnover stands',
    },
  },
  {
    id: 'double-team',
    name: 'Double team',
    caller: 'Any player (thrower enforces)',
    uncontested: {
      pre: 'Defense must correct, stall resumes at last number −1',
      completed: 'Play continues',
      incomplete: 'Turnover stands',
    },
    contested: {
      pre: 'Rarely contested, should be corrected',
      completed: 'Play continues',
      incomplete: 'Turnover stands',
    },
  },
  {
    id: 'travel',
    name: 'Travel',
    caller: 'Defense',
    uncontested: {
      pre: 'Return to proper pivot (turnover if contested)',
      completed: 'Disc returns to thrower',
      incomplete: 'Turnover stands',
    },
    contested: {
      pre: 'Disc returns to thrower; stall count ≥5 goes to 5, otherwise resumes',
      completed: 'Disc goes back to thrower',
      incomplete: 'Turnover stands',
    },
  },
  {
    id: 'fast-count',
    name: 'Fast count',
    caller: 'Offense',
    uncontested: {
      pre: 'Defense must correct and reset stall',
      completed: 'Disc stays with receiver',
      incomplete: 'Turnover stands',
    },
    contested: {
      pre: 'Disc stays with offense, stall −1',
      completed: 'Disc stays with receiver',
      incomplete: 'Turnover stands',
    },
  },
  {
    id: 'delay-of-game',
    name: 'Delay of game',
    caller: 'Defense',
    uncontested: {
      pre: 'Defense may begin stall at 1 if offense is slow',
      completed: null,
      incomplete: null,
    },
    contested: {
      pre: 'Not typically contested',
      completed: null,
      incomplete: null,
    },
  },
  {
    id: 'out-of-bounds',
    name: 'Out of bounds',
    caller: 'Objective call (best perspective)',
    uncontested: {
      pre: null,
      completed: 'Turnover at spot where disc went out',
      incomplete: 'Turnover at spot where disc went out',
    },
    contested: {
      pre: null,
      completed: 'Can’t be contested; rely on best perspective',
      incomplete: 'Can’t be contested; rely on best perspective',
    },
  },
  {
    id: 'foot-block',
    name: 'Foot block',
    caller: 'Offense',
    note: 'Not permitted in this league.',
    uncontested: {
      pre: 'Considered a foul, not permitted',
      completed: 'Considered a foul, not permitted',
      incomplete: 'Considered a foul, disc returns to thrower',
    },
    contested: {
      pre: 'Not permitted in this league',
      completed: 'Not permitted in this league',
      incomplete: 'Not permitted in this league',
    },
  },
];

export const WHEN = [
  { key: 'pre', label: 'Before the throw' },
  { key: 'completed', label: 'Completed throw' },
  { key: 'incomplete', label: 'Incomplete throw' },
];
