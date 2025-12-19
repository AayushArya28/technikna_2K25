import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventForm from "../components/EventForm.jsx";
import RulebookModal from "../components/RulebookModal.jsx";
import { getEventId, getEventKeyById } from "../lib/eventIds.js";
import { useEntitlements } from "../context/useEntitlements.jsx";
import { usePopup } from "../context/usePopup.jsx";

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
  poetry:
    "Rulebook\n\nPOETRY \nOBJECTIVE \nA poetry recital blending Hindi and English expression through verse. \nRULES \n1. Time limit: 3û5 minutes. \n2. Performance must include both English and Hindi elements. \n3. Plagiarism leads to disqualification. \nJUDGING CRITERIA \nò Originality û 30% \nò Expression and Emotion û 25% \nò Language Proficiency û 20% \nò Recitation Style û 15% \nò Audience Connection û 10% \nNOTE: If the number of participants is fewer than three, only the first prize will be awarded.",
  kavi_sammelan:
    "Rulebook\n\nKAVI SAMMELAN (HINDI POETRY) \nOBJECTIVE \nA celebration of Hindi poetry where poets present original compositions with wit and \nemotion. \nRULES \n1. Individual participation only. \n2. Poems must be original and in Hindi. \n3. Time limit: 3û5 minutes. \n4. No music or theatrical props allowed. \nJUDGING CRITERIA \nò Originality & Theme û 30% \nò Expression & Modulation û 25% \nò Diction & Language û 20% \nò Audience Engagement û 15% \nò Overall Impact û 10% \nNOTE: If the number of participants is fewer than three, only the first prize will be awarded.",
  fashion_insta:
    "Rulebook\n\nFASHION INSTA (FASHION SHOW) \nOBJECTIVE \nA grand fashion event celebrating creativity and stage presence through themed walks. \nRULES \n1. Participants must adhere to given themes. \n2. Vulgarity or offensive display prohibited. \nJUDGING CRITERIA \nò Creativity and Concept û 30% \nò Style and Coordination û 25% \nò Stage Presence û 25% \nò Audience Impact û 20% \nNOTE: If the number of participants is fewer than three, only the first prize will be awarded.",
};

const cleanPdfExtract = (text) =>
  String(text || "")
    .replace(/Æ/g, "'")
    .replace(/û/g, "–")
    .replace(/ò/g, "•")
    .trim();

const CULTURAL_RULEBOOK_TEXT = Object.fromEntries(
  Object.entries(CULTURAL_RULEBOOK_TEXT_RAW).map(([key, value]) => [
    key,
    cleanPdfExtract(value),
  ]),
);

const events = [
  {
    key: "solo_saga",
    title: "Solo Saga",
    desc: "Step into the spotlight with Solo Saga, a solo dance competition celebrating individual talent and expression. Participants perform solo routines showcasing creativity, rhythm, technique, and stage presence. It is not just about dance steps, but about confidence, emotion, and connecting with the audience. Judges evaluate creativity, expression, synchronization with music, and overall impact. Venue: BIT Auditorium.",
    img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80",
    participation: "Solo entry",
    allowedModes: ["solo"],
    rulebookText: CULTURAL_RULEBOOK_TEXT.solo_saga,
  },
  {
    key: "exuberance",
    title: "Exuberance",
    desc: "Celebrate teamwork and creativity with Exuberance, a group dance competition where teams deliver high-energy and synchronized performances. This event focuses on coordination, chemistry, storytelling, and stage presence. Judges assess precision, creativity, expressions, synchronization, and the ability to engage the audience as a team. Venue: BIT Auditorium.",
    img: "https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&w=800&q=80",
    participation: "Group entry",
    allowedModes: ["group"],
    rulebookText: CULTURAL_RULEBOOK_TEXT.exuberance,
  },
  {
    key: "synced_showdown",
    title: "Synced Showdown",
    desc: "Synced Showdown is a duo dance competition where two performers come together to create a perfectly coordinated routine. The event tests synchronization, chemistry, creativity, and storytelling through movement. Precision, expression, and teamwork play a vital role in delivering a performance that captivates both judges and audience. Venue: BIT Auditorium.",
    img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80",
    participation: "Duo (2 participants)",
    allowedModes: ["group"],
    groupMinTotal: 2,
    groupMaxTotal: 2,
    rulebookText: CULTURAL_RULEBOOK_TEXT.synced_showdown,
  },
  {
    key: "raag_unreleased",
    title: "Raag Unreleased",
    desc: "Express your musical talent in Raag Unreleased, a solo singing competition where participants showcase their vocal range, creativity, and emotional expression. It is not just about hitting the right notes, but about interpretation, voice modulation, and connecting with the audience. Judges evaluate pitch, tone, presentation, and overall impact. Venue: BIT Auditorium.",
    img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    participation: "Solo entry",
    allowedModes: ["solo"],
    rulebookText: CULTURAL_RULEBOOK_TEXT.raag_unreleased,
  },
  {
    key: "fusion_fiesta",
    title: "Fusion Fiesta",
    desc: "Fusion Fiesta is a group singing competition that celebrates harmony and teamwork. Participants blend voices to create powerful and memorable musical performances. The event focuses on coordination, creativity, harmonization, and stage presence. Judges evaluate voice blending, synchronization, originality, and audience engagement. Venue: BIT Auditorium.",
    img: "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=800&q=80",
    participation: "Group entry",
    allowedModes: ["group"],
    rulebookText: CULTURAL_RULEBOOK_TEXT.fusion_fiesta,
  },
  {
    key: "teeverse",
    title: "T-Shirt Painting (Teeverse)",
    desc: "Unleash your imagination and let colors speak! Design your own painted T-shirt inspired by cultural themes and creativity. Theme will be revealed on the day of competition. Medium: acrylic. (Markers/pens/glitters not allowed.) Time: 3 hours. Venue: As per schedule.",
    img: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=800&q=80",
    participation: "Solo entry",
    allowedModes: ["solo"],
    rulebookText:
      "Rulebook\n\n1. The competition will be of 3 hours.\n2. Theme will be revealed on the day of competition.\n3. Items provided at venue: Plain white T-shirt, 1 box of acrylic paint, 2 paint brushes.\n4. Participants can bring extra paint brushes and other stationery as needed.\n5. Medium: acrylic.\n6. Use of markers, pens, glitters will lead to disqualification.\n7. Decision of judges and organizing committee will be final.\n8. Judging criteria: (A) Color palette (B) Novelty (C) Creation (D) Execution",
  },
  {
    key: "street_dance",
    title: "Street Dance",
    desc: "Feel the beat and own the stage with your freestyle. This is a solo impromptu event — performers dance on songs given by organizers. Any style allowed (hip hop, popping/locking, breaking, freestyle, semi-classical, krump, etc.). Venue: As per schedule.",
    img: "https://images.unsplash.com/photo-1508704019882-f9cf40e475b4?auto=format&fit=crop&w=800&q=80",
    participation: "Solo entry",
    allowedModes: ["solo"],
    rulebookText:
      "Rulebook\n\n1. This is a solo event.\n2. Performers will enter the stage and perform on the songs given by organizers.\n3. It is an impromptu performance.\n4. Any dance form is allowed (B-boying, Popping and Locking, Hip Hop, freestyle, semi-classical, Krump etc.).\n5. Decision of judges will be final.",
  },
  {
    key: "pencil_perfection",
    title: "Pencil Sketching (Pencil Perfection)",
    desc: "An on-the-spot pencil sketching competition celebrating raw artistic skill and creativity. Theme will be announced at the venue. Time: 60–90 minutes. Bring your own drawing materials. Venue: As per schedule.",
    img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80",
    participation: "Solo entry",
    allowedModes: ["solo"],
    rulebookText:
      "Rulebook\n\n• Theme will be announced on the spot.\n• Complete the artwork within 60–90 minutes (organizers finalize time).\n• Drawing must be original and created live at the venue.\n• One entry per participant.\n• Participants must carry their own drawing materials.\n\nJudging Criteria\n• Creativity & Original Interpretation of Theme\n• Relevance to Theme\n• Color Usage & Technique\n• Neatness & Presentation\n• Overall Visual Impact",
  },
  {
    key: "wall_painting",
    title: "Wall Painting: Colors of Culture",
    desc: "Work as a clan of artists to transform a wall/panel section into an epic story of heritage and culture. Team size: 3–5. Original artwork created live (no pre-drawn outlines/tracing). Theme will be provided before the event. Venue: As per schedule.",
    img: "https://images.unsplash.com/photo-1526318472351-c75fcf070305?auto=format&fit=crop&w=800&q=80",
    participation: "Group (3–5 participants)",
    allowedModes: ["group"],
    groupMinTotal: 3,
    groupMaxTotal: 5,
    rulebookText:
      "General Rules\n\n1. Each clan (team) may consist of 3–5 warriors (participants).\n2. A wall/panel section will be assigned to every clan. Complete the artwork within the given time.\n3. Artwork must be original and created only during the event — no pre-drawn outlines or tracing.\n4. Theme will be provided before the event begins.\n5. Maintain discipline — no misconduct or disturbance to others.",
  },
  {
    key: "musical_marvel",
    title: "Musical Marvel",
    desc: "Musical Marvel is an instrumental performance event where participants can perform solo or in groups. The focus is on musical expression, technique, timing, and originality. It is not just about playing notes, but about storytelling through music and captivating the audience with skill and creativity. Judges evaluate technique, expression, and overall impact. Venue: BIT Auditorium.",
    img: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=800&q=80",
    rulebookText: CULTURAL_RULEBOOK_TEXT.musical_marvel,
  },
  {
    key: "ekanki",
    title: "Ekanki",
    desc: "Ekanki is a solo drama competition where participants bring stories and characters to life on stage. The event emphasizes expression, dialogue delivery, body language, timing, and emotional connection with the audience. Judges look for creativity, characterization, and the ability to leave a lasting impact through performance. Venue: BIT Auditorium.",
    img: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80",
    participation: "Solo entry",
    allowedModes: ["solo"],
    rulebookText: CULTURAL_RULEBOOK_TEXT.ekanki,
  },
  {
    key: "matargasthi",
    title: "Matargasthi",
    desc: "Matargasthi is a stage and mime competition where participants convey stories without words using gestures, expressions, and body language. The event focuses on originality, coordination, creativity, and emotional storytelling purely through movement. Judges evaluate expression, synchronization, and audience engagement. Venue: BIT Auditorium.",
    img: "https://images.unsplash.com/photo-1547841243-eacb14453c6d?auto=format&fit=crop&w=800&q=80",
    rulebookText: CULTURAL_RULEBOOK_TEXT.matargasthi,
  },
  {
    key: "hulchul",
    title: "Hulchul",
    desc: "Hulchul is a Nukkad Natak (street play) competition where participants perform socially relevant and thought-provoking skits. The event emphasizes message delivery, creativity, expression, teamwork, and audience interaction. Judges evaluate content, clarity of message, performance, and overall impact. Venue: Faculty Parking Area.",
    img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    rulebookText: CULTURAL_RULEBOOK_TEXT.hulchul,
  },
  {
    key: "poetry",
    title: "Poetry",
    desc: "Poetry is a literary event where participants express thoughts, emotions, and creativity through original or interpreted poems. The focus is on content, rhythm, emotion, voice modulation, and delivery. Judges evaluate originality, expression, clarity, and the ability to captivate the audience. Venue: BIT Auditorium.",
    img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
    rulebookText: CULTURAL_RULEBOOK_TEXT.poetry,
  },
  {
    key: "kavi_sammelan",
    title: "Kavi Sammelan",
    desc: "Kavi Sammelan is a gathering of poets presenting original compositions with wit, emotion, and creativity. Participants connect with the audience through rhythm, diction, humor, and impactful delivery. Judges evaluate originality, presentation, clarity, and audience engagement. Venue: Conference Hall.",
    img: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80",
    rulebookText: CULTURAL_RULEBOOK_TEXT.kavi_sammelan,
  },
  {
    key: "debate",
    title: "Vaad-Vivaad (Debate)",
    desc: "Vaad-Vivaad is a structured debate competition where participants showcase reasoning, persuasion, and critical thinking. The event focuses on clarity of ideas, logical arguments, counterpoints, confidence, and delivery. Judges evaluate content, coherence, confidence, and overall impact. Venue: Conference Hall.",
    img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
    participation: "Solo entry",
    allowedModes: ["solo"],
    rulebookText: CULTURAL_RULEBOOK_TEXT.debate,
  },
  {
    key: "fashion_insta",
    title: "Fashion Insta",
    desc: "Fashion Insta is a fashion showcase where participants walk the runway displaying themed outfits or original designs with confidence and style. The event emphasizes creativity, attitude, presentation, and stage presence. Judges evaluate styling, originality, confidence, and overall impact. Venue: BIT Auditorium.",
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    participation: "Solo entry",
    allowedModes: ["solo"],
    rulebookText: CULTURAL_RULEBOOK_TEXT.fashion_insta,
  },
];

export default function Cultural() {
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
              <li>➤ {events?.[active]?.participation || "Solo & Team Participation"}</li>
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
        allowedModes={events?.[active]?.allowedModes}
        groupMinTotal={events?.[active]?.groupMinTotal}
        groupMaxTotal={events?.[active]?.groupMaxTotal}
      />

      <RulebookModal
        open={rulebookOpen}
        title={rulebookTitle}
        content={rulebookText}
        onClose={() => {
          setRulebookOpen(false);
          setRulebookText("");
        }}
      />
    </div>
  );
}
