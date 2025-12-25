import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventForm from "../components/EventForm.jsx";
import { getEventId, getEventKeyById } from "../lib/eventIds.js";
import { useEntitlements } from "../context/useEntitlements.jsx";
import { usePopup } from "../context/usePopup.jsx";

const RULEBOOK_PDF_URL = "/rulebooks/cultural-rulebook.pdf";

const cleanPdfExtract = (text) =>
  String(text || "")
    .replace(/Æ/g, "'")
    .replace(/û/g, "–")
    .replace(/ò/g, "•")
    .trim();

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

const CULTURAL_RULEBOOK_TEXT_RAW = {
  solo_saga:
    "Rulebook\n\nSOLO SAGA (SOLO DANCE) \nOBJECTIVE \nA solo dance competition highlighting creativity, rhythm, and expression. \nRULES \n1. Time limit: 4 minutes including setup. \n2. All dance forms are allowed. \n3. Props allowed except items involving fire, water, glass, or powders.\n\n4. Music to be submitted in .mp3 format via pendrive at registration. \n5. Vulgarity or obscenity will lead to disqualification. \nJUDGING CRITERIA \nò Creativity and Choreography û 30% \nò Technique and Rhythm û 25% \nò Expression and Presentation û 25% \nò Stage Presence û 10% \nò Overall Impact û 10% \nNOTE: If the number of participants is fewer than three, only the first prize will be awarded.",
  exuberance:
    "Rulebook\n\nEXUBERANCE (GROUP DANCE) \nOBJECTIVE \nA high-energy team competition celebrating coordination, creativity, and storytelling \nthrough dance.\n\nRULES \n1. Team Size: 5û16 members (3û14 on stage). \n2. Time limit: 3û4 minutes. \n3. Props allowed except hazardous materials. \n4. Vulgarity, fire, or fluid use will lead to disqualification. \nJUDGING CRITERIA \nò Synchronization û 25% \nò Choreography and Creativity û 30% \nò Stage Utilization û 20% \nò Expression and Presentation û 15% \nò Costume and Theme û 10% \nNOTE: If the number of participants is fewer than three, only the first prize will be awarded.",
  synced_showdown:
    "Rulebook\n\nSYNCED SHOWDOWN (DUO DANCE) \nOBJECTIVE \nTwo participants perform synchronized dance routines emphasizing chemistry, precision, \nand creativity. \nRULES \n1. Time limit: 4 minutes. \n2. Props allowed but must not cause inconvenience or damage. \n3. Music must be submitted in .mp3 format. \n4. Vulgarity or obscenity will lead to disqualification. \nJUDGING CRITERIA \nò Coordination and Synchronization û 30% \nò Creativity and Theme û 25% \nò Energy and Stage Presence û 25% \nò Expression û 10% \nò Overall Impact û 10% \nNOTE: If the number of participants is fewer than three, only the first prize will be awarded.",
  raag_unreleased:
    "Rulebook\n\nRAAG UNRELEASED (SOLO SINGING) \nOBJECTIVE \nA solo singing competition showcasing vocal range, emotion, and connection with the \naudience. \nRULES \n1. Time limit: 4 minutes including sound check. \n2. Background tracks are permitted. \n3. Participants must bring tracks on pendrive. \n4. Judges may ask for an additional song. \nJUDGING CRITERIA \nò Voice Quality û 25% \nò Sur & Taal û 25% \nò Expression and Modulation û 20% \nò Song Choice û 15% \nò Stage Presence û 15% \nNOTE: If the number of participants is fewer than three, only the first prize will be awarded.",
  fusion_fiesta:
    "Rulebook\n\nFUSION FIESTA (GROUP SINGING) \nOBJECTIVE \nGroup singing competition promoting teamwork and harmony. \nRULES \n1. Group size: 2û6 members. \n2. Time limit: 3û5 minutes. \n3. Songs must be suitable for general audiences. \n4. Instruments allowed only if self-played. \nJUDGING CRITERIA \nò Harmony and Coordination û 30% \nò Creativity and Arrangement û 25% \nò Stage Presence û 20% \nò Vocal Strength û 15% \nò Overall Impact û 10% \nNOTE: If the number of participants is fewer than three, only the first prize will be awarded.",
  musical_marvel:
    "Rulebook\n\nMUSICAL MARVEL (INSTRUMENTAL) \nOBJECTIVE \nAn instrumental competition celebrating musical talent, rhythm, and creativity. \nRULES \n1. Time limit: 6 minutes including setup. \n2. No backing tracks allowed. \n3. All instruments permitted (acoustic/electronic). \nJUDGING CRITERIA \nò Clarity and Technique û 30% \nò Originality û 25% \nò Difficulty Level û 20% \nò Rhythm and Flow û 15% \nò Overall Performance û 10% \nNOTE: If the number of participants is fewer than three, only the first prize will be awarded.",
  ekanki:
    "Rulebook\n\nEKANKI (MONO ACT) \nOBJECTIVE \nSolo dramatic performance exploring emotion, storytelling, and acting depth. \nRULES \n1. Duration: 4û10 minutes. \n2. Only one actor allowed; 2 helpers for lights and sound permitted. \n3. Fire, glass, or water use prohibited. \nJUDGING CRITERIA \nò Acting and Expression û 35% \nò Script and Storytelling û 25% \nò Stage Presence û 20% \nò Voice and Diction û 10% \nò Overall Impact û 10% \nNOTE: If the number of participants is fewer than three, only the first prize will be awarded.",
  matargasthi:
    "Rulebook\n\nMATARGASHTI (STAGE PLAY / MIME) \nOBJECTIVE \nA team-based dramatic showcase of creativity and storytelling through dialogue or mime. \nRULES \n1. Team Size: 8û10 members. \n2. Duration: 10û20 minutes. \n3. Bilingual acts allowed. \n4. Vulgarity prohibited. \nJUDGING CRITERIA \nò Acting and Coordination û 30% \nò Script and Message û 25% \nò Stage Design û 20% \nò Expression and Creativity û 15% \nò Overall Impact û 10% \nNOTE: If the number of participants is fewer than three, only the first prize will be awarded.",
  hulchul:
    "Rulebook\n\nHULCHUL (STREET PLAY) \nOBJECTIVE \nA nukkad natak performance addressing social issues through drama and interaction. \nRULES \n1. Team Size: 10û25 members. \n2. Duration: 15û30 minutes. \n3. Only live music permitted. \n4. No electrical appliances allowed. \nJUDGING CRITERIA \nò Social Relevance û 30% \nò Acting and Energy û 25% \nò Crowd Interaction û 20% \nò Script and Dialogue û 15% \nò Overall Impact û 10% \nNOTE: If the number of participants is fewer than three, only the first prize will be awarded.",
  debate:
    "Rulebook\n\nVAAD-VIVAAD (DEBATE) \nOBJECTIVE \nA bilingual debate encouraging reasoning, persuasion, and clarity of thought. \nRULES \n1. Individual participation. \n2. Topics provided 30 minutes before round. \n3. Time limit: 3 minutes per speech. \nJUDGING CRITERIA \nò Content and Logic û 30% \nò Delivery and Confidence û 25% \nò Rebuttal Strength û 25% \nò Language and Clarity û 10% \nò Audience Engagement û 10% \nNOTE: If the number of participants is fewer than three, only the first prize will be awarded.",
  poetry_english:
    "RULEBOOK\n\nJASHN-E-JAZBAAT (POETRY) — ENGLISH\n\nOBJECTIVE\nAn English poetry recital where participants present original poems expressing emotions and life experiences.\n\nRULES\n• Time limit: 3–5 minutes.\n• Poems must be original and presented in English.\n• Plagiarism leads to disqualification.\n\nJUDGING CRITERIA\n• Originality — 30%\n• Expression and Emotion — 25%\n• Language Proficiency — 20%\n• Recitation Style — 15%\n• Audience Connection — 10%\n\nNOTE\nIf the number of participants is fewer than three, only the first prize will be awarded.",
  poetry_hindi:
    "RULEBOOK\n\nJASHN-E-JAZBAAT (POETRY) — HINDI\n\nOBJECTIVE\nA Hindi poetry recital where participants present original poems expressing emotions and life experiences.\n\nRULES\n• Time limit: 3–5 minutes.\n• Poems must be original and presented in Hindi.\n• Plagiarism leads to disqualification.\n\nJUDGING CRITERIA\n• Originality — 30%\n• Expression and Emotion — 25%\n• Language Proficiency — 20%\n• Recitation Style — 15%\n• Audience Connection — 10%\n\nNOTE\nIf the number of participants is fewer than three, only the first prize will be awarded.",
  kavi_sammelan:
    "Rulebook\n\nKAVI SAMMELAN (HINDI POETRY) \nOBJECTIVE \nA celebration of Hindi poetry where poets present original compositions with wit and \nemotion. \nRULES \n1. Individual participation only. \n2. Poems must be original and in Hindi. \n3. Time limit: 3û5 minutes. \n4. No music or theatrical props allowed. \nJUDGING CRITERIA \nò Originality & Theme û 30% \nò Expression & Modulation û 25% \nò Diction & Language û 20% \nò Audience Engagement û 15% \nò Overall Impact û 10% \nNOTE: If the number of participants is fewer than three, only the first prize will be awarded.",
  fashion_insta:
    "Rulebook\n\nFASHION INSTA (FASHION SHOW) \nOBJECTIVE \nA grand fashion event celebrating creativity and stage presence through themed walks. \nRULES \n1. Participants must adhere to given themes. \n2. Vulgarity or offensive display prohibited. \nJUDGING CRITERIA \nò Creativity and Concept û 30% \nò Style and Coordination û 25% \nò Stage Presence û 25% \nò Audience Impact û 20% \nNOTE: If the number of participants is fewer than three, only the first prize will be awarded.",
};

const CULTURAL_RULEBOOK_TEXT = Object.fromEntries(
  Object.entries(CULTURAL_RULEBOOK_TEXT_RAW).map(([key, value]) => [key, cleanPdfExtract(value)]),
);

const events = [
  {
    key: "solo_saga",
    title: "Solo Saga",
    desc: "Step into the spotlight with Solo Saga, a solo dance competition celebrating individual talent and expression. Venue: BIT Auditorium.",
    img: "https://i.ibb.co/Y4rZjmt0/solo-saga.jpg",
    section: "DANCE",
    participation: "Solo",
    fee: "₹149",
    allowedModes: ["solo"],
  },
  {
    key: "synced_showdown",
    title: "Synced Showdown",
    desc: "A duo dance event focused on synchronization, chemistry, and creativity. Venue: BIT Auditorium.",
    img: "https://i.ibb.co/DDr112bf/synced-showdown.jpg",
    section: "DANCE",
    participation: "Duo (2)",
    fee: "₹249 per team",
    allowedModes: ["group"],
    groupMinTotal: 2,
    groupMaxTotal: 2,
  },
  {
    key: "exuberance",
    title: "Exuberance (Group)",
    desc: "A group dance competition celebrating coordination, creativity, and stage presence. Venue: BIT Auditorium.",
    img: "https://i.ibb.co/M57tqdb9/exuberance.png",
    section: "DANCE",
    participation: "Group (3–14)",
    fee: "₹699 per team",
    allowedModes: ["group"],
    groupMinTotal: 3,
    groupMaxTotal: 14,
  },
  {
    key: "street_dance",
    title: "Street Dance",
    desc: "Freestyle street dance — participate solo or with a small team (up to 3). Venue: As per schedule.",
    img: "https://i.ibb.co/nq4pCQSx/street-dance.jpg",
    section: "DANCE",
    participation: "Solo / Team (1–3)",
    fee: "₹149 per team",
    allowedModes: ["solo", "group"],
    groupMinTotal: 2,
    groupMaxTotal: 3,
  },
  {
    key: "raag_unreleased",
    title: "Raag Unreleased",
    desc: "A solo singing competition showcasing vocal range and expression. Venue: BIT Auditorium.",
    img: "https://i.ibb.co/7xw5QJQh/raag-unreleased.jpg",
    section: "MUSIC",
    participation: "Solo",
    fee: "₹149",
    allowedModes: ["solo"],
  },
  {
    key: "fusion_fiesta",
    title: "Fusion Fiesta (Group)",
    desc: "Group singing competition focused on harmony, coordination, and stage presence. Venue: BIT Auditorium.",
    img: "https://i.ibb.co/4Rjg7KTT/fusion-fiesta.png",
    section: "MUSIC",
    participation: "Group (2–6)",
    fee: "₹299 per team",
    allowedModes: ["group"],
    groupMinTotal: 2,
    groupMaxTotal: 6,
  },
  {
    key: "musical_marvel",
    title: "Musical Marvel (Instrumental)",
    desc: "Instrumental event — participate solo or with a small team (up to 4). Venue: BIT Auditorium.",
    img: "https://i.ibb.co/x8XjhJjy/musical-marvel.png",
    section: "MUSIC",
    participation: "Solo / Team (1–4)",
    fee: "₹199 per team",
    allowedModes: ["solo", "group"],
    groupMinTotal: 2,
    groupMaxTotal: 4,
  },
  {
    key: "ekanki",
    title: "Ekanki (Mono Act)",
    desc: "Solo dramatic performance focusing on storytelling and acting depth. Venue: BIT Auditorium.",
    img: "https://i.ibb.co/Lz16qqx3/ekanki.jpg",
    section: "DRAMA",
    participation: "Solo",
    fee: "₹149",
    allowedModes: ["solo"],
  },
  {
    key: "matargasthi",
    title: "Matargashti (Stage Play / Mime)",
    desc: "Team-based dramatic showcase through dialogue or mime. Venue: BIT Auditorium.",
    img: "https://i.ibb.co/GfW07wDt/matarghasti.jpg",
    section: "DRAMA",
    participation: "Team (8–10)",
    fee: "₹599 per team",
    allowedModes: ["group"],
    groupMinTotal: 8,
    groupMaxTotal: 10,
  },
  {
    key: "hulchul",
    title: "Hulchul (Street Play)",
    desc: "Street play competition with social themes and strong crowd interaction. Venue: Faculty Parking Area.",
    img: "https://i.ibb.co/sdyjGy62/hulchul.png",
    section: "DRAMA",
    participation: "Team (10–25)",
    fee: "₹699 per team",
    allowedModes: ["group"],
    groupMinTotal: 10,
    groupMaxTotal: 25,
  },
  {
    key: "debate",
    title: "Vaad Vivaad (Debate)",
    desc: "Bilingual debate event focused on reasoning, persuasion, and clarity of thought. Venue: Conference Hall.",
    img: "https://i.ibb.co/CpQmqhcC/vaad-vivad.png",
    section: "LITERARY",
    participation: "Solo",
    fee: "₹149",
    allowedModes: ["solo"],
  },
  {
    key: "poetry_english",
    title: "Jashn-e-Jazbaat (Poetry) — English",
    desc: "A poetry recital event where participants present original poems expressing emotions and life experiences. Venue: BIT Auditorium.",
    img: "https://i.ibb.co/bRgtwvtj/jashn-e-jazbaat.png",
    section: "LITERARY",
    participation: "Solo",
    fee: "₹149",
    allowedModes: ["solo"],
  },
  {
    key: "poetry_hindi",
    title: "Jashn-e-Jazbaat (Poetry) — Hindi",
    desc: "A poetry recital event where participants present original poems expressing emotions and life experiences. Venue: BIT Auditorium.",
    img: "https://i.ibb.co/bRgtwvtj/jashn-e-jazbaat.png",
    section: "LITERARY",
    participation: "Solo",
    fee: "₹149",
    allowedModes: ["solo"],
  },
  {
    key: "kavi_sammelan",
    title: "Kavi Sammelan",
    desc: "A Hindi poetry event where participants present original compositions with wit and emotion. Venue: BIT Auditorium.",
    img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
    section: "LITERARY",
    participation: "Solo",
    fee: "₹149",
    allowedModes: ["solo"],
  },
  {
    key: "fashion_insta",
    title: "Fashion Insta",
    desc: "Fashion show event — participate solo or as a team. Venue: BIT Auditorium.",
    img: "https://i.ibb.co/RGttZJsb/fashion-insta.png",
    section: "FASHION",
    participation: "Solo / Team",
    fee: "₹399",
    allowedModes: ["solo", "group"],
    groupMinTotal: 2,
    groupMaxTotal: 14,
  },
];

export default function Cultural() {
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
    let resolvedKey = keyParam || getEventKeyById(idParam);
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
        top-30 left-4        
        sm:top-6 sm:left-6  
        lg:top-20 lg:left-20
        z-50 
        flex items-center gap-2 
        hover:bg-black 
        text-white bg-black/30 backdrop-blur-xl
        px-3 py-2 sm:px-4 sm:py-2 
        rounded-lg 
        transition-all duration-250 shadow-md
        text-sm sm:text-base cursor-pointer active:scale-95 active:opacity-90 hover:border-red-500/70 border border-transparent"
      >
        ← Back
      </button>

      <h1 className="text-4xl font-bold mt-20 text-center text-white-500 mb-16">
        CULTURAL EVENTS
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
            {!!events?.[active]?.section && (
              <div className="text-xs uppercase tracking-[0.35em] text-white/60 mb-2">
                {events[active].section}
              </div>
            )}

            <h2 className="text-3xl text-white font-bold mb-3">{events[active].title}</h2>

            <div className="flex-1 overflow-y-auto pr-2">

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
                onClick={openRulebook}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white hover:bg-white/20 transition text-sm cursor-pointer active:scale-95 active:opacity-90"
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
              <button
                type="button"
                onClick={() => setFormOpen(true)}
                className="bg-red-600 hover:shadow-[0_0_18px_rgba(255,0,64,0.55)] transition px-6 py-3 rounded-lg text-white font-bold cursor-pointer active:scale-95 active:opacity-90 duration-250"
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
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 backdrop-blur transition hover:bg-white hover:text-black cursor-pointer hover:shadow-[0_0_18px_rgba(255,255,255,0.55)] active:scale-95 active:opacity-90"
                    aria-label="Previous event"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={next}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-red-500/70 bg-red-600/90 backdrop-blur transition hover:bg-red-500 hover:shadow-[0_0_18px_rgba(255,0,64,0.55)] cursor-pointer active:scale-95 active:opacity-90"
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
        eventCategory="Cultural"
        allowedModes={events?.[active]?.allowedModes}
        groupMinTotal={events?.[active]?.groupMinTotal}
        groupMaxTotal={events?.[active]?.groupMaxTotal}
      />
    </div>
  );
}
