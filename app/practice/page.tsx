"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  subjects,
  DEFAULT_SUBJECT,
  getSubject,
  weeksOf,
  getStoredSubject,
  setStoredSubject,
} from "@/lib/subjects";

type Mode = "study" | "test" | "exam";

const MODES: { id: Mode; label: string; text: string }[] = [
  { id: "study", label: "Study", text: "Instant feedback after every answer." },
  { id: "test", label: "Test", text: "Answer all questions, then submit to see results." },
  { id: "exam", label: "Exam", text: "75 random questions from all weeks." },
];

export default function PracticePage() {
  const [subjectId, setSubjectId] = useState(DEFAULT_SUBJECT);
  const [mode, setMode] = useState<Mode>("study");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("subject");
    setSubjectId(p && getSubject(p) ? p : getStoredSubject());
  }, []);

  function pickSubject(id: string) {
    setSubjectId(id);
    setStoredSubject(id);
  }

  const subject = getSubject(subjectId) ?? subjects[0];
  const weeks = weeksOf(subject);
  const examSize = Math.min(75, subject.questions.length);

  return (
    <div>
      <h1 className="text-2xl font-bold">Practice</h1>

      <div className="mt-4 grid gap-3">
        {subjects.map((s) => (
          <button
            key={s.id}
            onClick={() => pickSubject(s.id)}
            className={`rounded-xl border p-4 text-left ${
              s.id === subject.id ? "border-sky-400 bg-slate-900" : "border-slate-800 bg-slate-900/50"
            }`}
          >
            <div className="font-semibold">
              {s.icon} {s.title}
            </div>
            <div className="text-sm text-slate-400">
              {s.subtitle} · {s.questions.length} questions
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`rounded-lg border px-3 py-2 text-sm font-medium ${
              mode === m.id ? "border-sky-500 bg-sky-500 text-white" : "border-slate-700 bg-slate-900"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-sm text-slate-400">{MODES.find((m) => m.id === mode)?.text}</p>

      {mode === "exam" ? (
        <Link
          href={`/exam?subject=${subject.id}`}
          className="mt-6 inline-block rounded-xl bg-sky-500 px-6 py-3 font-semibold text-white hover:bg-sky-400"
        >
          Start exam ({examSize} questions)
        </Link>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {weeks.map((w) => (
            <Link
              key={w}
              href={`/${mode}?subject=${subject.id}&week=${w}`}
              className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-center hover:border-sky-400"
            >
              <div className="font-semibold">Week {w}</div>
              <div className="text-xs text-slate-400">
                {subject.questions.filter((q) => q.week === w).length} questions
              </div>
            </Link>
          ))}
          <Link
            href={`/${mode}?subject=${subject.id}&week=all`}
            className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-center hover:border-sky-400"
          >
            <div className="font-semibold">All weeks</div>
            <div className="text-xs text-slate-400">{subject.questions.length} questions</div>
          </Link>
        </div>
      )}
    </div>
  );
}
