// Every .js file in this folder (except this one) is a play and is picked up automatically.
const modules = import.meta.glob(['./*.js', '!./index.js'], { eager: true });

export const plays = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => (a.order ?? 99) - (b.order ?? 99) || a.title.localeCompare(b.title));

export const getPlay = (id) => plays.find((p) => p.id === id);
