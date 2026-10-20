import type { Question } from "./types";

export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface Prepared {
  id: string;
  week: number;
  question: string;
  options: string[];
  answer: number; // index of the correct option after shuffling
  explanation: string;
  pick: number | null;
}

export function prepare(q: Question): Prepared {
  const tagged = q.options.map((text, i) => ({ text, correct: i === q.correctAnswer }));
  const ordered = q.noShuffle ? tagged : shuffle(tagged);
  return {
    id: q.id,
    week: q.week,
    question: q.question,
    options: ordered.map((o) => o.text),
    answer: ordered.findIndex((o) => o.correct),
    explanation: q.explanation,
    pick: null,
  };
}
