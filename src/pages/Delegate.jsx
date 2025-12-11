import React from "react";

export default function Delegate() {
  return (
    <main className="min-h-screen bg-black text-white pt-28 pb-20 px-6 md:px-12 lg:px-20">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-white/60">Delegates</p>
          <h1 className="text-4xl font-bold sm:text-5xl">Delegate Program</h1>
          <p className="max-w-3xl text-lg text-white/70">
            Explore everything delegates get access to—priority seating, exclusive meetups,
            and guided experiences throughout Technika. Register early to secure your spot.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/40">
            <h2 className="text-2xl font-semibold">What you get</h2>
            <ul className="mt-4 space-y-2 text-white/75">
              <li>• Priority entry to featured events</li>
              <li>• Curated sessions with speakers</li>
              <li>• Delegate lounge access</li>
              <li>• Dedicated support desk</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/30 via-fuchsia-500/20 to-blue-500/25 p-6 shadow-lg shadow-black/40">
            <h2 className="text-2xl font-semibold">How to join</h2>
            <ol className="mt-4 space-y-2 text-white/80">
              <li>1. Review delegate benefits and pricing.</li>
              <li>2. Complete the registration form.</li>
              <li>3. Watch for a confirmation email with your pass.</li>
            </ol>
            <button className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-black transition hover:-translate-y-[1px] hover:bg-white/90">
              Start delegate registration
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
