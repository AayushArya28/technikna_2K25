import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventForm from "../components/EventForm.jsx";

const toEventId = (title) =>
  String(title || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const events = [
  {
    title: "Dev Conquest (Hackathon)",
    desc: "Get ready to unleash your creativity and problem-solving skills at Dev Conquest, a 24-hour hackathon where passionate developers, designers, and innovators collaborate to build and present groundbreaking solutions. Participants work nonstop to transform ideas into functional tech products within a single day. Whether you are a beginner eager to learn or an experienced coder ready to push boundaries, this event challenges innovation, teamwork, and execution under time pressure. Venue: CC-1 / CC-2 (depending on participation).",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Algo Apex (Competitive Programming)",
    desc: "Sharpen your logic, speed, and problem-solving skills at Algo Apex, a competitive programming contest designed for coding enthusiasts who thrive under pressure. Participants solve algorithmic challenges focused on data structures, algorithms, and time-optimized coding. Precision, efficiency, and clarity of thought determine success as competitors race against the clock. Venue: CC-1 / CC-2 (depending on participation).",
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Ampere Assemble",
    desc: "Ampere Assemble is a hands-on electronics competition conducted in the Basic Electronics Lab. Participants design, assemble, and troubleshoot real-world electronic circuits within a limited time frame. The event tests practical knowledge, circuit understanding, teamwork, and problem-solving skills while encouraging innovation through applied electronics. Venue: Basic Electronics Lab.",
    img: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Robo Gladiators (Robo War)",
    desc: "Gear up for the ultimate battle of bots at Robo Gladiators, where innovation meets destruction. Custom-built robots face off in a controlled combat arena, testing mechanical strength, design strategy, control, and durability. The objective is to overpower or disable the opponent through superior engineering and tactical execution. Venue: Front Gate / Dome Area.",
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Robo Soccer",
    desc: "Robo Soccer brings the excitement of football to robotics. Teams design and program robots to dribble, pass, defend, and score goals in a fast-paced match. The event emphasizes coordination between hardware and software, strategic planning, and precise control to outplay opponents. Venue: Front Gate / Dome Area.",
    img: "https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Dirt Race (Robo Race)",
    desc: "Robo Race is a dirt-track robotics challenge where robots must navigate obstacles, sharp turns, and uneven terrain in the shortest possible time. This event tests speed, stability, control, and design efficiency, pushing robots to their mechanical and technical limits. Venue: BIT Ground.",
    img: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Tall Tower",
    desc: "Tall Tower is a civil engineering challenge where participants build the tallest possible structure using limited materials. The structure must remain stable under testing conditions, emphasizing design efficiency, material optimization, and structural integrity. Venue: Civil Lab.",
    img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Aerofilia (Bridge the Gap)",
    desc: "Bridge the Gap is a structural design competition where teams construct model bridges using simple materials. The goal is to span a fixed distance while supporting maximum load. Creativity, durability, and efficient engineering design play a key role in determining success. Venue: Civil Lab.",
    img: "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Multisim Mavericks",
    desc: "Multisim Mavericks is a virtual electronics challenge where participants design, simulate, and test electronic circuits using NI Multisim software. The event focuses on circuit accuracy, optimization, and problem-solving through digital simulation techniques. Venue: EM Lab.",
    img: "https://images.unsplash.com/photo-1581091215367-59ab6b9b4c7a?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Startup Sphere",
    desc: "Startup Sphere is a pitching and entrepreneurship event where participants present innovative ideas, business concepts, or tech-driven solutions to a panel of judges and experts. The event promotes creativity, feasibility analysis, communication skills, and entrepreneurial thinking. Venue: Conference Hall.",
    img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "CAD Modelling",
    desc: "CAD Modelling challenges participants to create precise 2D or 3D models using professional computer-aided design tools. The event evaluates drafting accuracy, creativity, technical skills, and the ability to translate ideas into detailed digital designs. Venue: AutoCAD Lab.",
    img: "https://images.unsplash.com/photo-1581091870627-3b6c68b6a2c6?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Brain Brawl",
    desc: "Brain Brawl is a fast-paced technical quiz competition covering engineering disciplines such as electronics, mechanics, programming, civil concepts, logic, and general problem-solving. The event tests knowledge depth, speed, and accuracy under competitive conditions. Venue: SH-2 / LH-3 (depending on participation).",
    img: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Utility Bot",
    desc: "Utility Bot is a machine design challenge where participants build functional robots or machines capable of performing practical, real-world tasks autonomously and efficiently. The event emphasizes innovation, precision, and applicability of engineering solutions. Venue: Dome Area near EEE Department.",
    img: "https://images.unsplash.com/photo-1581092334491-07c4b45dff47?auto=format&fit=crop&w=800&q=80",
  },
];

export default function Technical() {
  const [active, setActive] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const cardRef = useRef(null);

  // ✅ AUTO CENTER ACTIVE CARD (Fixes slider issue)
  useEffect(() => {
    if (!sliderRef.current || !cardRef.current) return;

    const slider = sliderRef.current;
    const activeCard = slider.children[active];

    const sliderWidth = slider.offsetWidth;
    const cardWidth = activeCard.offsetWidth;
    const cardLeft = activeCard.offsetLeft;

    const scrollPosition =
      cardLeft - sliderWidth / 2 + cardWidth / 2;

    slider.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });
  }, [active]);

  const next = () => {
    setActive((prev) => (prev + 1) % events.length);
  };

  const prev = () => {
    setActive((prev) =>
      prev === 0 ? events.length - 1 : prev - 1
    );
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
        TECHNICAL EVENTS
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

            <p className="text-white mb-10">
              {events[active].desc}
            </p>

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
                  <h2 className="text-s font-bold text-white">
                    {event.title}
                  </h2>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <EventForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        eventId={toEventId(events?.[active]?.title)}
        eventTitle={events?.[active]?.title}
        eventCategory="Technical"
      />
    </div>
  );
}
