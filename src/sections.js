// The beginner path: numbered sections, each a set of lessons that build on each other.
// A play joins a section with `level: 'beginner', section: '<id>', order: <n>`.
// Advanced plays have no section; they're grouped by `category` instead.
export const sections = [
  { id: 'field', number: 1, title: 'The basics of the field', blurb: 'How the defense sets up around the thrower, and why it matters to everyone.' },
  { id: 'vert', number: 2, title: 'Vertical stack', blurb: 'The standard offense: where to stand, how to cut, and how to get out of the way.' },
  { id: 'flow', number: 3, title: 'Keeping the disc moving', blurb: 'Continuations and resets, so the offense never gets stuck.' },
  { id: 'break', number: 4, title: 'Breaking the mark', blurb: 'Getting the disc to the side the defense is taking away.' },
  { id: 'defense', number: 5, title: 'Defense basics', blurb: 'Guarding a cutter within the force.' },
];

export const getSection = (id) => sections.find((s) => s.id === id);
export const LEVELS = ['beginner', 'advanced'];
