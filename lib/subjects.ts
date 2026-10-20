import type { Subject } from "./types";
import { geoQuestions } from "./questions/geo";

// To add another subject: create lib/questions/<id>.ts and add an entry here.
export const subjects: Subject[] = [
  {
    id: "geo",
    title: "Conservation Geography",
    subtitle: "Weeks 0-12 practice questions",
    icon: "🌍",
    questions: geoQuestions,
  },
];

export const DEFAULT_SUBJECT = "geo";
const STORAGE_KEY = "mockit.subject";

export function getSubject(id: string | null | undefined): Subject | undefined {
  return subjects.find((s) => s.id === id);
}

export function weeksOf(subject: Subject): number[] {
  return [...new Set(subject.questions.map((q) => q.week))].sort((a, b) => a - b);
}

export function getStoredSubject(): string {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v && getSubject(v)) return v;
  } catch {}
  return DEFAULT_SUBJECT;
}

export function setStoredSubject(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {}
}
