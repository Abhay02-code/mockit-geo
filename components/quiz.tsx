"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DEFAULT_SUBJECT, getSubject } from "@/lib/subjects";
import { prepare, shuffle, type Prepared } from "@/lib/utils";

export type Mode = "study" | "test" | "exam";

const EXAM_SIZE = 75;
const MODE_NAME: Record<Mode, string> = { study: "Study", test: "Test", exam: "Exam" };
const letter = (i: number) => String.fromCharCode(65 + i);

export default function Quiz({ mode }: { mode: Mode }) {
  const [items, setItems] = useState<Prepared[] | null>(null);
  const [label, setLabel] = useState("");
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function begin() {
    const params = new URLSearchParams(window.location.search);
    const subject = getSubject(params.get("subject") || DEFAULT_SUBJECT);
    if (!subject) {
      setError("Subject not found.");
      return;
    }
    const weekParam = params.get("week");
    let pool = subject.questions;
    let name = "All weeks";
    if (mode === "exam") {
      pool = shuffle(pool).slice(0, EXAM_SIZE);
      name = "Random questions";
    } else if (weekParam && weekParam !== "all") {
      const w = Number(weekParam);
      pool = pool.filter((q) => q.week === w);
      name = `Week ${w}`;
    }
    if (pool.length === 0) {
      setError("No questions found for this selection.");
      return;
    }
    setItems(shuffle(pool).map(prepare));
    setLabel(`${subject.title} · ${name}`);
    setIdx(0);
    setDone(false);
    setError("");
    window.scrollTo(0, 0);
  }

  useEffect(() => {
    begin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function pick(qi: number, oi: number) {
    setItems((prev) => (prev ? prev.map((q, i) => (i === qi ? { ...q, pick: oi } : q)) : prev));
  }

  if (error) {
    return (
      <div className="py-10 text-center">
        <p className="text-slate-300">{error}</p>
        <Link href="/practice" className="mt-4 inline-block text-sky-400 underline">
          Back to practice
        </Link>
      </div>
    );
  }
  if (!items) return <p className="py-10 text-center text-slate-400">Loading…</p>;

  const header = (
    <div className="mb-4 flex items-center justify-between text-sm">
      <Link href="/practice" className="text-slate-400 hover:text-white">
        ← Back
      </Link>
      <span className="rounded-full border border-slate-700 px-3 py-0.5 text-slate-300">
        {MODE_NAME[mode]} · {label}
      </span>
    </div>
  );

  /* ---------- results ---------- */
  if (done) {
    const correct = items.filter((q) => q.pick === q.answer).length;
    const pct = Math.round((correct / items.length) * 100);
    return (
      <div>
        {header}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="text-slate-400">Your score</div>
          <div className="mt-1 text-4xl font-bold">
            {correct} / {items.length} <span className="text-2xl text-slate-400">({pct}%)</span>
          </div>
          {pct === 100 && <div className="mt-2 text-emerald-400">🎉 Perfect score!</div>}
          <div className="mt-4 flex gap-3">
            <button
              onClick={begin}
              className="rounded-xl bg-sky-500 px-5 py-2.5 font-semibold text-white hover:bg-sky-400"
            >
              Retry
            </button>
            <Link
              href="/practice"
              className="rounded-xl border border-slate-700 px-5 py-2.5 hover:border-sky-400"
            >
              Home
            </Link>
          </div>
        </div>

        <h2 className="mb-3 mt-8 text-lg font-semibold">Review</h2>
        {items.map((q, qi) => (
          <div key={q.id} className="mb-4 rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <div className="mb-2 text-xs text-slate-400">
              Q{qi + 1} · Week {q.week}
            </div>
            <p className="mb-3 font-semibold">{q.question}</p>
            {q.options.map((o, oi) => (
              <div
                key={oi}
                className={`mb-2 rounded-lg border px-3 py-2 text-sm ${
                  oi === q.answer
                    ? "border-emerald-500 bg-emerald-950 text-emerald-300"
                    : oi === q.pick
                    ? "border-red-500 bg-red-950 text-red-300"
                    : "border-slate-700"
                }`}
              >
                {letter(oi)}. {o}
                {oi === q.answer ? "  ✓" : oi === q.pick ? "  ✗ (your answer)" : ""}
              </div>
            ))}
            {q.pick === null && <p className="text-sm text-red-400">Not answered</p>}
            {q.explanation && <p className="mt-2 text-sm text-slate-400">{q.explanation}</p>}
          </div>
        ))}
      </div>
    );
  }

  /* ---------- study mode: one question at a time ---------- */
  if (mode === "study") {
    const q = items[idx];
    const answered = q.pick !== null;
    const last = idx === items.length - 1;
    return (
      <div>
        {header}
        <div className="mb-2 flex justify-between text-sm text-slate-400">
          <span>
            Question {idx + 1} of {items.length}
          </span>
          <span>Week {q.week}</span>
        </div>
        <div className="mb-5 h-1.5 overflow-hidden rounded bg-slate-800">
          <div
            className="h-full bg-sky-500"
            style={{ width: `${((idx + (answered ? 1 : 0)) / items.length) * 100}%` }}
          />
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <p className="mb-4 text-lg font-semibold">{q.question}</p>
          {q.options.map((o, oi) => {
            let cls = "border-slate-700 hover:border-sky-400";
            if (answered) {
              if (oi === q.answer) cls = "border-emerald-500 bg-emerald-950 text-emerald-300";
              else if (oi === q.pick) cls = "border-red-500 bg-red-950 text-red-300";
              else cls = "border-slate-800 text-slate-500";
            }
            return (
              <button
                key={oi}
                disabled={answered}
                onClick={() => pick(idx, oi)}
                className={`mb-2 block w-full rounded-lg border px-4 py-3 text-left ${cls}`}
              >
                {letter(oi)}. {o}
              </button>
            );
          })}
          {answered && (
            <p className={`mt-2 font-semibold ${q.pick === q.answer ? "text-emerald-400" : "text-red-400"}`}>
              {q.pick === q.answer ? "Correct!" : `Incorrect – correct answer: ${q.options[q.answer]}`}
            </p>
          )}
          {answered && q.explanation && <p className="mt-2 text-sm text-slate-400">{q.explanation}</p>}
        </div>
        <div className="mt-4 flex justify-between">
          <button
            disabled={idx === 0}
            onClick={() => setIdx(idx - 1)}
            className="rounded-xl border border-slate-700 px-5 py-2.5 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            disabled={!answered}
            onClick={() => (last ? setDone(true) : setIdx(idx + 1))}
            className="rounded-xl bg-sky-500 px-5 py-2.5 font-semibold text-white disabled:opacity-40"
          >
            {last ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    );
  }

  /* ---------- test / exam mode: all questions, submit at end ---------- */
  const answeredCount = items.filter((q) => q.pick !== null).length;
  function submit() {
    const left = items!.length - answeredCount;
    if (left === 0 || window.confirm(`${left} question(s) unanswered. Submit anyway?`)) {
      setDone(true);
      window.scrollTo(0, 0);
    }
  }
  return (
    <div>
      {header}
      {items.map((q, qi) => (
        <div key={q.id} className="mb-4 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <div className="mb-2 text-xs text-slate-400">
            Q{qi + 1} · Week {q.week}
          </div>
          <p className="mb-3 font-semibold">{q.question}</p>
          {q.options.map((o, oi) => (
            <button
              key={oi}
              onClick={() => pick(qi, oi)}
              className={`mb-2 block w-full rounded-lg border px-4 py-3 text-left ${
                q.pick === oi ? "border-sky-400 bg-sky-950" : "border-slate-700 hover:border-sky-400"
              }`}
            >
              {letter(oi)}. {o}
            </button>
          ))}
        </div>
      ))}
      <div className="sticky bottom-0 -mx-4 flex items-center justify-between border-t border-slate-800 bg-slate-950/95 px-4 py-3">
        <span className="text-sm text-slate-400">
          {answeredCount} / {items.length} answered
        </span>
        <button
          onClick={submit}
          className="rounded-xl bg-sky-500 px-6 py-2.5 font-semibold text-white hover:bg-sky-400"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
