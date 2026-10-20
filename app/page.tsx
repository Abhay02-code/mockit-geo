import Link from "next/link";
import { subjects } from "@/lib/subjects";

export default function Home() {
  const total = subjects.reduce((n, s) => n + s.questions.length, 0);
  return (
    <div className="py-10 text-center">
      <div className="text-6xl">🌍</div>
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">MockIt</h1>
      <p className="mx-auto mt-3 max-w-md text-slate-400">
        A modern, mobile-friendly practice exam app for Conservation Geography.
        Weeks 0 to 12, {total} questions.
      </p>
      <div className="mx-auto mt-8 grid max-w-md gap-3 text-left text-sm text-slate-300">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <b>Study mode</b> – instant feedback as you answer each question
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <b>Test mode</b> – answer everything, then submit to see results
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <b>Exam mode</b> – random questions from all weeks
        </div>
      </div>
      <Link
        href="/practice"
        className="mt-8 inline-block rounded-xl bg-sky-500 px-6 py-3 font-semibold text-white hover:bg-sky-400"
      >
        Start practicing
      </Link>
    </div>
  );
}
