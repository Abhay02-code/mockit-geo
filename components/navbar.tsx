import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold">
          🌍 MockIt
        </Link>
        <Link
          href="/practice"
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm hover:border-sky-400"
        >
          Practice
        </Link>
      </div>
    </header>
  );
}
