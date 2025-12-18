import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventForm from "../components/EventForm.jsx";
import { getEventId, getEventKeyById } from "../lib/eventIds.js";

const events = [
  {
    key: "solo_saga",
    title: "Solo Saga",
    desc: "Step into the spotlight with Solo Saga, a solo dance competition celebrating individual talent and expression. Participants perform solo routines showcasing creativity, rhythm, technique, and stage presence. It is not just about dance steps, but about confidence, emotion, and connecting with the audience. Judges evaluate creativity, expression, synchronization with music, and overall impact. Venue: BIT Auditorium.",
    img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80",
  },
  {
    key: "exuberance",
    title: "Exuberance",
    desc: "Celebrate teamwork and creativity with Exuberance, a group dance competition where teams deliver high-energy and synchronized performances. This event focuses on coordination, chemistry, storytelling, and stage presence. Judges assess precision, creativity, expressions, synchronization, and the ability to engage the audience as a team. Venue: BIT Auditorium.",
    img: "https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&w=800&q=80",
  },
  {
    key: "synced_showdown",
    title: "Synced Showdown",
    desc: "Synced Showdown is a duo dance competition where two performers come together to create a perfectly coordinated routine. The event tests synchronization, chemistry, creativity, and storytelling through movement. Precision, expression, and teamwork play a vital role in delivering a performance that captivates both judges and audience. Venue: BIT Auditorium.",
    img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80",
  },
  {
    key: "raag_unreleased",
    title: "Raag Unreleased",
    desc: "Express your musical talent in Raag Unreleased, a solo singing competition where participants showcase their vocal range, creativity, and emotional expression. It is not just about hitting the right notes, but about interpretation, voice modulation, and connecting with the audience. Judges evaluate pitch, tone, presentation, and overall impact. Venue: BIT Auditorium.",
    img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
  },
  {
    key: "fusion_fiesta",
    title: "Fusion Fiesta",
    desc: "Fusion Fiesta is a group singing competition that celebrates harmony and teamwork. Participants blend voices to create powerful and memorable musical performances. The event focuses on coordination, creativity, harmonization, and stage presence. Judges evaluate voice blending, synchronization, originality, and audience engagement. Venue: BIT Auditorium.",
    img: "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=800&q=80",
  },
  {
    key: "musical_marvel",
    title: "Musical Marvel",
    desc: "Musical Marvel is an instrumental performance event where participants can perform solo or in groups. The focus is on musical expression, technique, timing, and originality. It is not just about playing notes, but about storytelling through music and captivating the audience with skill and creativity. Judges evaluate technique, expression, and overall impact. Venue: BIT Auditorium.",
    img: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=800&q=80",
  },
  {
    key: "ekanki",
    title: "Ekanki",
    desc: "Ekanki is a solo drama competition where participants bring stories and characters to life on stage. The event emphasizes expression, dialogue delivery, body language, timing, and emotional connection with the audience. Judges look for creativity, characterization, and the ability to leave a lasting impact through performance. Venue: BIT Auditorium.",
    img: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80",
  },
  {
    key: "matargasthi",
    title: "Matargasthi",
    desc: "Matargasthi is a stage and mime competition where participants convey stories without words using gestures, expressions, and body language. The event focuses on originality, coordination, creativity, and emotional storytelling purely through movement. Judges evaluate expression, synchronization, and audience engagement. Venue: BIT Auditorium.",
    img: "https://images.unsplash.com/photo-1547841243-eacb14453c6d?auto=format&fit=crop&w=800&q=80",
  },
  {
    key: "hulchul",
    title: "Hulchul",
    desc: "Hulchul is a Nukkad Natak (street play) competition where participants perform socially relevant and thought-provoking skits. The event emphasizes message delivery, creativity, expression, teamwork, and audience interaction. Judges evaluate content, clarity of message, performance, and overall impact. Venue: Faculty Parking Area.",
    img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
  },
  {
    key: "poetry",
    title: "Poetry",
    desc: "Poetry is a literary event where participants express thoughts, emotions, and creativity through original or interpreted poems. The focus is on content, rhythm, emotion, voice modulation, and delivery. Judges evaluate originality, expression, clarity, and the ability to captivate the audience. Venue: BIT Auditorium.",
    img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
  },
  {
    key: "kavi_sammelan",
    title: "Kavi Sammelan",
    desc: "Kavi Sammelan is a gathering of poets presenting original compositions with wit, emotion, and creativity. Participants connect with the audience through rhythm, diction, humor, and impactful delivery. Judges evaluate originality, presentation, clarity, and audience engagement. Venue: Conference Hall.",
    img: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80",
  },
  {
    key: "debate",
    title: "Vaad-Vivaad (Debate)",
    desc: "Vaad-Vivaad is a structured debate competition where participants showcase reasoning, persuasion, and critical thinking. The event focuses on clarity of ideas, logical arguments, counterpoints, confidence, and delivery. Judges evaluate content, coherence, confidence, and overall impact. Venue: Conference Hall.",
    img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
  },
  {
    key: "fashion_insta",
    title: "Fashion Insta",
    desc: "Fashion Insta is a fashion showcase where participants walk the runway displaying themed outfits or original designs with confidence and style. The event emphasizes creativity, attitude, presentation, and stage presence. Judges evaluate styling, originality, confidence, and overall impact. Venue: BIT Auditorium.",
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
  },
];

export default function Cultural() {
  const [active, setActive] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sliderRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const keyParam = searchParams.get("eventKey");
    const idParam = searchParams.get("eventId");
    const resolvedKey = keyParam || getEventKeyById(idParam);
    if (!resolvedKey) return;

    const idx = events.findIndex((e) => e.key === resolvedKey);
    if (idx >= 0 && idx !== active) setActive(idx);
  }, [active, searchParams]);

  // ✅ AUTO CENTER ACTIVE CARD (Fixes slider issue)
  useEffect(() => {
    if (!sliderRef.current || !cardRef.current) return;

    const slider = sliderRef.current;
    const activeCard = slider.children[active];

    const sliderWidth = slider.offsetWidth;
    const cardWidth = activeCard.offsetWidth;
    const cardLeft = activeCard.offsetLeft;

    const scrollPosition = cardLeft - sliderWidth / 2 + cardWidth / 2;

    slider.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });
  }, [active]);

  const next = () => {
    setActive((prev) => (prev + 1) % events.length);
  };

  const prev = () => {
    setActive((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  return (
    <div
      className="min-h-screen text-white px-6 py-12 overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('./images/events.png')",
      }}
    >
      {/* Heading */}
      <button
        onClick={() => navigate("/events")}
        className="fixed 
        top-24 left-4        
        sm:top-6 sm:left-6  
        lg:top-20 lg:left-20
        z-50 
        flex items-center gap-2 
        hover:bg-black 
        text-white 
        px-3 py-2 sm:px-4 sm:py-2 
        rounded-lg 
        transition shadow-md
        text-sm sm:text-base"
      >
        ← Back
      </button>
      <h1 className="text-4xl font-bold mt-20 text-center text-white-500 mb-16">
        CULTURAL EVENTS
      </h1>

      <div className="mt-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-black/80 rounded-3xl p-8">
        {/* LEFT IMAGE */}
        <div className="rounded-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            <Motion.img
              key={events[active].img}
              src={events[active].img}
              alt={events[active].title}
              className="w-full h-[260px] object-cover"
              initial={{ opacity: 0.4, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              loading="lazy"
              decoding="async"
            />
          </AnimatePresence>
        </div>

        {/* RIGHT DETAILS */}
        <AnimatePresence mode="wait">
          <Motion.div
            key={events[active].title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <h2 className="text-3xl text-white font-bold mb-3">
              {events[active].title}
            </h2>

            <p className="text-white mb-10">{events[active].desc}</p>

            <ul className="text-sm text-white/80 space-y-2 mb-8">
              <li>➤ Solo & Team Participation</li>
              <li>➤ Certificates & Cash Prizes</li>
              <li>➤ On-Spot Evaluation</li>
            </ul>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => setFormOpen(true)}
                className="bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-lg text-white font-bold"
              >
                Register Now
              </button>

              <div className="flex items-center justify-between gap-6 w-full sm:w-auto">
                <div className="flex items-end gap-2 text-white/60">
                  <span className="text-xl font-semibold text-white">
                    {String(active + 1).padStart(2, "0")}
                  </span>
                  <span className="text-xs uppercase tracking-[0.3em]">
                    / {String(events.length).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={prev}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 backdrop-blur transition hover:bg-white hover:text-black"
                    aria-label="Previous event"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={next}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-red-500/70 bg-red-600/90 backdrop-blur transition hover:bg-red-500"
                    aria-label="Next event"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </Motion.div>
        </AnimatePresence>
      </div>
      <div className="relative flex justify-center max-w-7xl mx-auto mb-24">
        {/* SLIDER TRACK */}
        <div
          ref={sliderRef}
          className="flex gap-6 px-6 sm:px-10 lg:px-20 overflow-hidden items-center h-[300px] scroll-smooth"
        >
          {events.map((event, index) => {
            const isActive = index === active;

            return (
              <div
                key={index}
                ref={isActive ? cardRef : null}
                onClick={() => setActive(index)}
                className={`relative cursor-pointer transition-all duration-300 rounded-xl overflow-hidden flex-shrink-0
                ${
                  isActive
                    ? "scale-110 z-20 shadow-[0_0_35px_#ff0000]"
                    : "scale-90 opacity-50"
                }
                w-[170px] h-[240px]`}
              >
                <img
                  src={event.img}
                  alt={event.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />

                {/* TEXT */}
                <div className="absolute bottom-0 w-full p-2 bg-black/40">
                  <h2 className="text-s font-bold text-white">{event.title}</h2>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <EventForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        eventId={getEventId(events?.[active]?.key)}
        eventTitle={events?.[active]?.title}
        eventCategory="Cultural"
      />
    </div>
  );
}
