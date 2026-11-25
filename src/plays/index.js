import { sections } from '../sections.js';

// Every .js file in this folder (except this one) is a play and is picked up automatically.
const modules = import.meta.glob(['./*.js', '!./index.js'], { eager: true });

export const plays = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => (a.order ?? 99) - (b.order ?? 99) || a.title.localeCompare(b.title));

export const getPlay = (id) => plays.find((p) => p.id === id);

export const lessonsIn = (sectionId) => plays.filter((p) => p.level === 'beginner' && p.section === sectionId);

// The beginner path in order: section 1 lessons, then section 2, ...
export const beginnerPath = sections.flatMap((s) => lessonsIn(s.id));

export const advancedPlays = plays.filter((p) => p.level !== 'beginner');

// "Section 2 · Lesson 3" position of a beginner play, or null.
export function lessonPosition(play) {
  if (play.level !== 'beginner') return null;
  const section = sections.find((s) => s.id === play.section);
  const lesson = lessonsIn(play.section).indexOf(play) + 1;
  return section ? { section, lesson } : null;
}

export function neighbours(play) {
  const i = beginnerPath.indexOf(play);
  if (i < 0) return {};
  return { prev: beginnerPath[i - 1], next: beginnerPath[i + 1] };
}
