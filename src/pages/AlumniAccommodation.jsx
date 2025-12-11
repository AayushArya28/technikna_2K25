import React from "react";

export default function AlumniAccommodation() {
  return (
    <main className="min-h-screen bg-black text-white pt-28 pb-20 px-6 md:px-12 lg:px-20">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-white/60">Alumni stay</p>
          <h1 className="text-4xl font-bold sm:text-5xl">Alumni Accommodation</h1>
          <p className="max-w-3xl text-lg text-white/70">
            We will help you book a convenient stay and coordinate campus access so you can
            enjoy Technika without logistics friction.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/40">
            <h2 className="text-2xl font-semibold">Included support</h2>
            <ul className="mt-4 space-y-2 text-white/75">
              <li>• Curated hotel/hostel suggestions</li>
              <li>• Clear check-in/check-out guidance</li>
              <li>• Directions and campus entry help</li>
              <li>• Single-point contact during stay</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/30 via-green-500/20 to-teal-500/25 p-6 shadow-lg shadow-black/40">
            <h2 className="text-2xl font-semibold">Request alumni stay</h2>
            <p className="mt-3 text-white/80">
              Share your travel dates and preferences. We will reply with available options and
              next steps to secure your stay.
            </p>
            <button className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-black transition hover:-translate-y-[1px] hover:bg-white/90">
              Submit stay request
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
