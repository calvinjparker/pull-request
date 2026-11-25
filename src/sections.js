// The beginner path: numbered sections, each a set of lessons that build on each other.
// A play joins a section with `level: 'beginner', section: '<id>', order: <n>`.
// Advanced plays have no section; they're grouped by `category` instead.
export const sections = [
  { id: 'field', number: 1, title: 'The basics of the field', blurb: 'How the defense sets up around the thrower, and why it matters to everyone.' },
  { id: 'cutting', number: 2, title: 'Cutting', blurb: 'Why we cut, and the basic moves for getting open.' },
  { id: 'vert', number: 3, title: 'Vertical stack', blurb: 'The standard offense: the setup, then how the disc moves through it, including continuations and breaks.' },
  { id: 'resets', number: 4, title: 'Resets', blurb: 'What to do when nothing is open upfield.' },
  { id: 'defense', number: 5, title: 'Defense basics', blurb: 'Guarding a cutter within the force.' },
];

export const getSection = (id) => sections.find((s) => s.id === id);
export const LEVELS = ['beginner', 'advanced'];
