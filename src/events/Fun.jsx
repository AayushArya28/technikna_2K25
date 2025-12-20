import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventForm from "../components/EventForm.jsx";
import RulebookModal from "../components/RulebookModal.jsx";
import { getEventId, getEventKeyById } from "../lib/eventIds.js";
import { useEntitlements } from "../context/useEntitlements.jsx";
import { usePopup } from "../context/usePopup.jsx";

const splitDescMeta = (desc) => {
  const raw = String(desc || "").trim();
  if (!raw) return { text: "", venue: "", date: "" };

  let text = raw;
  let venue = "";
  let date = "";

  const venueSplit = text.split(/\s*Venue:\s*/i);
  if (venueSplit.length > 1) {
    text = venueSplit[0].trim().replace(/[\s.]+$/g, "");
    const afterVenue = venueSplit.slice(1).join("Venue:").trim();
    const dateSplit = afterVenue.split(/\s*Date:\s*/i);
    venue = dateSplit[0].trim().replace(/[\s.]+$/g, "");
    if (dateSplit.length > 1) {
      date = dateSplit.slice(1).join("Date:").trim().replace(/[\s.]+$/g, "");
    }
  } else {
    const dateSplit = text.split(/\s*Date:\s*/i);
    if (dateSplit.length > 1) {
      text = dateSplit[0].trim().replace(/[\s.]+$/g, "");
      date = dateSplit.slice(1).join("Date:").trim().replace(/[\s.]+$/g, "");
    }
  }

  return { text, venue, date };
};

const events = [
  {
    key: "escape_room",
    title: "Escape Room",
    desc: "Battle against time as you and your clan attempt to break free from the enemy fortress. Navigate hidden traps, cryptic symbols, and riddles. Team size: 3–4. Time limit: 25 minutes. Up to 3 hints allowed (each hint adds 4 minutes). No forceful damage to props/locks. Venue: As per schedule.",
    img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
    participation: "Team (3–4 participants)",
    allowedModes: ["group"],
    groupMinTotal: 3,
    groupMaxTotal: 4,
    rulebookText:
      "RULEBOOK\n\nOBJECTIVE\nEscape the themed room by solving puzzles and completing challenges within the given time limit.\n\nDURATION\n25 minutes (time penalty of +4 minutes per hint, up to 3 hints).\n\nRULES\n1. Team size: 3–4 participants.\n2. No forceful damage to props, locks, or room items.\n3. No food or snacks allowed inside.\n4. Hints: Up to 3 hints are allowed; each hint adds 4 minutes to the final time.\n5. Do not reveal puzzles/solutions to other participants.\n\nJUDGING CRITERIA\n• Fastest successful escape time (including hint penalties).\n• Rule compliance and fair play.\n\nNOTE\nOrganizers’ and judges’ decision will be final.",
  },
];

export default function Fun() {
  const [active, setActive] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [rulebookOpen, setRulebookOpen] = useState(false);
  const [rulebookTitle, setRulebookTitle] = useState("");
  const [rulebookText, setRulebookText] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sliderRef = useRef(null);
  const cardRef = useRef(null);
  const popup = usePopup();
  const { loading: entitlementsLoading, canAccessEvents } = useEntitlements();

  const openRulebook = (event) => {
    const pdf = event?.rulebookPdf;
    if (typeof pdf === "string" && pdf.trim()) {
      window.open(pdf, "_blank", "noopener,noreferrer");
      return;
    }

    const text = event?.rulebookText;
    if (typeof text === "string" && text.trim()) {
      setRulebookTitle(String(event?.title || "Event"));
      setRulebookText(text);
      setRulebookOpen(true);
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

  const next = () => setActive((prev) => (prev + 1) % events.length);
  const prev = () => setActive((prev) => (prev === 0 ? events.length - 1 : prev - 1));

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
        FUN EVENTS
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
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <h2 className="text-3xl text-white font-bold mb-3">{events[active].title}</h2>

            {(() => {
              const meta = splitDescMeta(events?.[active]?.desc);
              return (
                <>
                  <p className="text-white mb-4">{meta.text}</p>
                  {(meta.venue || meta.date) && (
                    <div className="mb-8 flex flex-col gap-1 text-sm text-white/70 sm:flex-row sm:items-baseline sm:justify-between">
                      {meta.venue ? (
                        <div>
                          <span className="text-white/70">Venue:</span>{" "}
                          <span className="text-white/85">{meta.venue}</span>
                        </div>
                      ) : (
                        <div />
                      )}
                      {meta.date && (
                        <div className="sm:text-right">
                          <span className="text-white/70">Date:</span>{" "}
                          <span className="text-white/85">{meta.date}</span>
                        </div>
                      )}
                    </div>
                  )}
                </>
              );
            })()}

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
              <li>• Certificates & Cash Prizes</li>
              <li>• On-Spot Evaluation</li>
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
        eventCategory="Fun"
        allowedModes={events?.[active]?.allowedModes}
        groupMinTotal={events?.[active]?.groupMinTotal}
        groupMaxTotal={events?.[active]?.groupMaxTotal}
      />

      <RulebookModal
        open={rulebookOpen}
        title={rulebookTitle}
        content={rulebookText}
        onClose={() => setRulebookOpen(false)}
      />
    </div>
  );
}
