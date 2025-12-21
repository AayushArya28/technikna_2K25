import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventForm from "../components/EventForm.jsx";
import { getEventId, getEventKeyById } from "../lib/eventIds.js";
import { useEntitlements } from "../context/useEntitlements.jsx";
import { usePopup } from "../context/usePopup.jsx";

const RULEBOOK_PDF_URL = "/rulebooks/technika-event-brochure.pdf";

const events = [
  {
    key: "bgmi",
    title: "BGMI",
    desc: "Online event — Battle it out in BGMI with your squad. Bring strategy, coordination, and clutch plays to the lobby. Venue: As per schedule.",
    img: "https://i.ibb.co/TDFZ0Ynh/bgmi.png",
    participation: "Team (2–4 participants)",
    fee: "₹249 per team",
    allowedModes: ["group"],
    groupMinTotal: 2,
    groupMaxTotal: 4,
  },
  {
    key: "valorant",
    title: "Valorant",
    desc: "Online event — Compete in Valorant with your team and dominate the bracket with crisp aim and smart utility. Venue: As per schedule.",
    img: "https://i.ibb.co/XxsNk7TB/valo.png",
    participation: "Team (2–5 participants)",
    fee: "₹249 per team",
    allowedModes: ["group"],
    groupMinTotal: 2,
    groupMaxTotal: 5,
  },
  {
    key: "fifa",
    title: "FIFA",
    desc: "Offline event — FIFA matches. On-site registration. Venue: As per schedule.",
    img: "https://i.ibb.co/FkdFRmMS/fifa.png",
    participation: "On-Spot (Solo)",
    fee: "On-spot",
    allowedModes: ["solo"],
    onSiteRegistration: true,
  },
  {
    key: "tekken",
    title: "Tekken",
    desc: "Offline event — Tekken matches. On-site registration. Venue: As per schedule.",
    img: "https://i.ibb.co/6cXDVn7L/tekken.png",
    participation: "On-Spot (Solo)",
    fee: "On-spot",
    allowedModes: ["solo"],
    onSiteRegistration: true,
  },
];

export default function Esports() {
  const [active, setActive] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sliderRef = useRef(null);
  const cardRef = useRef(null);
  const popup = usePopup();
  const { loading: entitlementsLoading, canAccessEvents } = useEntitlements();

  const openRulebook = () => {
    if (typeof RULEBOOK_PDF_URL === "string" && RULEBOOK_PDF_URL.trim()) {
      window.open(RULEBOOK_PDF_URL, "_blank", "noopener,noreferrer");
      return;
    }
    popup.info("Rulebook coming soon.");
  };

  useEffect(() => {
    if (entitlementsLoading) return;
    if (canAccessEvents) return;

    popup.info("Alumni Pass users can access only the Alumni section.");
    navigate("/alumni", { replace: true });
  }, [canAccessEvents, entitlementsLoading, navigate, popup]);

  useEffect(() => {
    const keyParam = searchParams.get("eventKey");
    const idParam = searchParams.get("eventId");
    const resolvedKey = keyParam || getEventKeyById(idParam);
    if (!resolvedKey) return;

    const idx = events.findIndex((e) => e.key === resolvedKey);
    if (idx >= 0 && idx !== active) setActive(idx);
  }, [active, searchParams]);

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
        ESPORTS EVENTS
      </h1>

      <div className="mt-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-black/80 rounded-3xl p-8">
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

        <AnimatePresence mode="wait">
          <Motion.div
            key={events[active].title}
            className="h-full flex flex-col"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <h2 className="text-3xl text-white font-bold mb-3">{events[active].title}</h2>

            <div className="flex-1 overflow-y-auto pr-2">

            <p className="text-white mb-10">{events[active].desc}</p>

            <div className="mb-6">
              <button
                type="button"
                onClick={() => openRulebook(events?.[active])}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white hover:bg-white/20 transition text-sm"
              >
                Rulebook
              </button>
            </div>

            <ul className="text-sm text-white/80 space-y-2 mb-8">
              <li>• {events?.[active]?.participation || "Solo & Team Participation"}</li>
              {!!events?.[active]?.fee && <li>• Fee: {events[active].fee}</li>}
              <li>• Certificates & Cash Prizes</li>
              <li>• On-Spot Evaluation</li>
            </ul>

            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              {events?.[active]?.onSiteRegistration ? (
                <div className="px-6 py-3 rounded-lg border border-white/20 bg-white/10 text-white font-bold">
                  On-site registration
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setFormOpen(true)}
                  className="bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-lg text-white font-bold"
                >
                  Register Now
                </button>
              )}

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
        <div
          ref={sliderRef}
          className="flex gap-6 px-6 sm:px-10 lg:px-20 overflow-hidden items-center h-[300px] scroll-smooth"
        >
          {events.map((event, index) => {
            const isActive = index === active;

            return (
              <div
                key={event.key}
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
        eventCategory="Esports"
        allowedModes={events?.[active]?.allowedModes}
        groupMinTotal={events?.[active]?.groupMinTotal}
        groupMaxTotal={events?.[active]?.groupMaxTotal}
      />
    </div>
  );
}
