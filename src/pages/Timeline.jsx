import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Timeline() {
  const items = [
    {
      title: "Opening Ceremony",
      subtitle: "Auditorium",
      desc: "Inauguration and welcome address",
    },
    {
      title: "Technical Events",
      subtitle: "Labs & CC",
      desc: "Hackathons, coding contests, robotics",
    },
    {
      title: "Cultural Night",
      subtitle: "Main Stage",
      desc: "Dance, music, drama performances",
    },
    {
      title: "Closing Ceremony",
      subtitle: "Auditorium",
      desc: "Winners announcement and farewell",
    },
  ];

  const desktopFillRef = useRef(null);
  const mobileFillRef = useRef(null);

  /* Line Fill Animation */
  useEffect(() => {
    if (desktopFillRef.current) {
      gsap.to(desktopFillRef.current, {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: desktopFillRef.current.parentElement,
          start: "top 70%",
          end: "bottom 70%",
          scrub: true,
        },
      });
    }

    if (mobileFillRef.current) {
      gsap.to(mobileFillRef.current, {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: mobileFillRef.current.parentElement,
          start: "top 80%",
          end: "bottom 80%",
          scrub: true,
        },
      });
    }
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-black via-[#16060b] to-black px-0 pb-32 pt-36 text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-10 left-10 h-64 w-64 rounded-full bg-[#ff0030]/15 blur-[120px]" />
        <div className="absolute bottom-0 right-16 h-72 w-72 rounded-full bg-[#4100ff]/10 blur-[140px]" />
        <div className="absolute top-[12%] right-[12%] text-8xl font-black opacity-[0.06] select-none">
          TECHNIKA
        </div>
      </div>

      {/* Main container */}
      <div className="relative z-10 mx-auto w-full max-w-6xl rounded-[36px] border border-white/12 bg-black/55 p-10 shadow-[0_50px_180px_rgba(255,0,40,0.25)] backdrop-blur-xl">
        {/* Header */}
        <div className="mb-20">
          <span className="inline-flex mb-4 w-fit items-center rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.38em] text-white/70">
            Technika 2K25
          </span>
          <h1 className="text-4xl md:text-5xl font-semibold uppercase tracking-[0.22em]">
            Event Timeline
          </h1>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-1/2 hidden h-full w-0.5 -translate-x-1/2 border-l border-dashed border-white/20 md:block" />
          <div
            ref={desktopFillRef}
            className="absolute left-1/2 top-0 hidden w-0.5 -translate-x-1/2 bg-red-600 origin-top md:block"
            style={{ height: "0%" }}
          />
          <div className="absolute left-3 top-0 h-full w-0.5 border-l border-dashed border-white/30 md:hidden" />
          <div
            ref={mobileFillRef}
            className="absolute left-3 top-0 w-0.5 bg-red-600 origin-top md:hidden"
            style={{ height: "0%" }}
          />

          <div className="space-y-5">
            {items.map((item, index) => (
              <TimelineItem key={index} {...item} isLeft={index % 2 === 0} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/*Timeline Item */

function TimelineItem({ title, subtitle, desc, isLeft }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;

    gsap.fromTo(
      el,
      {
        opacity: 0,
        x: window.innerWidth < 768 ? 0 : isLeft ? -80 : 80,
        y: window.innerWidth < 768 ? 40 : 0,
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, [isLeft]);

  return (
    <div
      ref={cardRef}
      className={`relative flex w-full ${
        isLeft ? "md:justify-start md:pr-12" : "md:justify-end md:pl-12"
      } justify-start pl-10 md:pl-0`}
    >
      <div className="absolute left-1/2 top-8 hidden h-4 w-4 -translate-x-1/2 rounded-full bg-red-500 shadow-[0_0_20px_rgba(255,0,0,0.6)] md:block" />
      <div className="absolute left-3 top-7 h-3 w-3 -translate-x-1/2 rounded-full bg-red-500 shadow-[0_0_14px_rgba(255,0,0,0.6)] md:hidden" />

      <div className="absolute left-3 top-8 h-[1px] w-6 bg-white/30 md:hidden" />

      <EventBox title={title} subtitle={subtitle} desc={desc} />
    </div>
  );
}

function EventBox({ title, subtitle, desc }) {
  return (
    <div className="group relative w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 will-change-transform hover:-translate-y-1 hover:border-red-500/40 hover:bg-white/10 hover:shadow-[0_22px_80px_rgba(255,0,48,0.22)]">
      <div className="pointer-events-none absolute inset-[-70%] opacity-30 blur-2xl animate-[spin_10s_linear_infinite] bg-[conic-gradient(from_90deg,rgba(255,23,68,0.0),rgba(255,23,68,0.35),rgba(91,44,255,0.35),rgba(255,23,68,0.0))]" />

      <div className="pointer-events-none absolute inset-0 bg-black/20" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,0,48,0.22),_transparent_60%)]" />

      <div className="pointer-events-none absolute -top-20 right-0 h-48 w-48 rounded-full bg-[#ff0030]/10 blur-[120px] transition-all duration-500 group-hover:bg-[#ff0030]/30" />

      <div className="relative z-10">
        <h3 className="text-lg font-semibold uppercase tracking-wide">
          {title}
        </h3>

        {subtitle && (
          <p className="mt-1 text-xs uppercase tracking-[0.35em] text-white/60">
            {subtitle}
          </p>
        )}

        {desc && (
          <p className="mt-4 text-sm text-white/70 leading-relaxed">{desc}</p>
        )}
      </div>
    </div>
  );
}

export default Timeline;
