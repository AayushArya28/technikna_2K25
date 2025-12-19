import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventForm from "../components/EventForm.jsx";
import RulebookModal from "../components/RulebookModal.jsx";
import { getEventId, getEventKeyById } from "../lib/eventIds.js";
import { useEntitlements } from "../context/useEntitlements.jsx";
import { usePopup } from "../context/usePopup.jsx";

const TECHNICAL_RULEBOOK_TEXT_RAW = {
  hackathon:
    "Rulebook\n\n1.DEV CONTEST (HACKATHON) \n➢ TEAM SIZE: 2-4 MEMBERS \n➢ OBJECTIV\nE \n• Participants will build a fully functional prototype or application based on problem \nstatements provided at the start of the event \nRules: \n• Problem Statements: Teams will choose from a set of real-world problem statements \n(e.g., sustainability, smart technology). \n• Programming Language & Tools: Participants can use any programming language or \nsoftware tools. \n• Documentation: A README file detailing the project and instructions for setup must be \nsubmitted. \n• Presentation: A live demo is mandatory. \nJudging Criteria: \n• Innovation (30%): Originality and creativity in solving the problem. \n• Functionality (30%): How well the application works. \n• Usability (20%): User experience and interface design. \n• Technical Complexity (10%): Code sophistication and challenges overcome. \n• Presentation (10%): Clarity in presenting the solution",
  cp: "Rulebook\n\n2.ALGO APEX \n➢ DURATION: 2 HOURS \n➢ OBJECTIVE: \n• Participants will solve algorithmic problems testing their knowledge of data \nstructures, algorithms, and problem-solving. \nRULES: \n• Participants must submit their solutions electronically through the event’s \nsubmission system. \n• Solutions will be evaluated based on correctness and efficiency. \nJudging Criteria: \n• Problem Solving (50%): Number of problems solved correctly. \n• Efficiency (30%): Time complexity of solutions. \n• Correctness (20%): Accuracy of solutions.",
  ampere_assemble:
    "Rulebook\n\n3.AMPERE ASSEMBLE \n➢ TEAM SIZE: 2-3 MEMBERS \n➢ OBJECTIVE \n• Participants must design a functional circuit based on provided specifications, using no \nsoftware tools. \nRules: \n• Circuits must be designed manually, with all calculations done by hand. \n• No use of software tools like Multisim is allowed. \nJudging Criteria: \n• Design Accuracy (40%): How well the design meets the specifications. \n• Creativity (30%): Innovation in the design. \n• Calculations (20%): Correctness of the manual calculations. \n• Presentation (10%): Clarity in explaining the design process.",
  robo_war:
    "Rulebook\n\n4.ROBO GLADIATORS (ROBO WAR) \n➢ ARENA SIZE: 10X10 FT. \n• ROBOT SPECIFICATIONS: MAX DIMENSIONS 75X75X75 CM; WEIGHT LIMIT OF 20 KG. \n➢ OBJECTIVE \n• Participants will design combat robots to compete against others in an arena. \nRules: \n• Robots must be built to damage or immobilize opponents. \n• No flame-throwers, explosives, or projectiles are allowed. \nJudging Criteria: \n• Combat Performance (50%): Ability to disable the opponent. \n• Robot Durability (30%): Resistance to damage. \n• Design & Innovation (20%): Creativity in the robot's design",
  robo_soccer:
    "Rulebook\n\n5.ROBO SOCCER \n➢ Duration: 2–5 Minutes per Match \n➢ Objective \n• Participants will design and operate robots to compete in a soccer-style match. The goal is to \nscore by pushing or guiding the ball into the opponent’s goal, testing control, strategy, and \nmechanical design. \nRules \n• Each team consists of 2–4 members with one robot. \n• Robots must fit within 30cm x 30cm x 30cm and be battery-powered only. \n• Robots may push or guide the ball but may not lift or hold it completely. \n• Minor contact between robots is allowed; intentional damage or ramming is prohibited. \n• If a robot gets stuck or flips, the referee may allow one reset. \n• Match duration and arena size will be declared by organizers. \nJudging Criteria \n• Goals Scored (50%): Number of valid goals made during the match. \n• Control & Stability (30%): Smooth movement, balanced structure, and handling. \n• Fair Play & Conduct (20%): Clean gameplay and adherence to rules.",
  robo_race:
    "Rulebook\n\n6.DIRT RACE (ROBO RACE) \n➢ Duration: Depends on Track Attempts (Typically 2–3 Minutes per Run) \n➢ Objective \n• Participants will navigate their robots through an obstacle-based race track. The aim is to \ncomplete the course in the shortest time while maintaining control, stability, and avoiding \npenalties. This event tests design durability, speed, and precise maneuvering. \nRules \n• Each team may have 2–4 members with one robot. \n• Robot dimensions must not exceed 30cm x 30cm x 30cm; battery-powered only. \n• The track will include ramps, bumps, turns, sand/dirt patches, and speed breakers. \n• Robots must remain within the track boundaries; going off-track incurs time penalties. \n• No dragging, pushing, or damaging the track is allowed. \n• If the robot stops, a single reset may be allowed (time runs continuously). \nJudging Criteria \n• Completion Time (60%): Fastest valid run. \n• Stability & Control (25%): Smooth handling and minimal resets. \n• Track Discipline (15%): Avoiding off-track penalties and maintaining fair play.",
  tall_tower:
    "Rulebook\n\n7.TALL TOWER (STRUCTURAL DESIGN) \n➢ TEAM SIZE: 2-3 MEMBERS \n➢ OBJECTIVE \n• Teams must design and build the tallest, most stable tower structure using the provided \nmaterials. The tower must meet specific design constraints while withstanding weight or \nenvironmental factors. The focus will be on height, stability, and structural integrity, with \nteams judged on their engineering approach, innovative design, and ability to construct a \ndurable tower. \nRules: \n• Materials such as straws, sticks, and tape will be provided. \n• Towers must be free-standing and support a specified load during testing. \nJudging Criteria: \n• Height (40%): Overall height of the tower. \n• Stability (40%): Ability to support weight without collapsing. \n• Design Creativity (20%): Innovation in the structure's design.",
  bridge_the_gap:
    "Rulebook\n\n8.AEROFILIA (BRIDGE THE GAP) \n➢ TEAM SIZE: 2-3 MEMBERS \n➢ OBJECTIVE \n• Participants must design and construct a bridge model that spans a given gap using \nspecified materials. The model should demonstrate structural efficiency, stability, and the \nability to bear a maximum load without failure. Teams will be judged on the strength of the \nbridge, innovative design, and use of materials while ensuring that the structure adheres to \ngiven constraints. \nRules: \n• Materials such as sticks, strings, and glue will be provided. \n• Bridges will be tested for stability and strength. \nJudging Criteria: \n• Structural Integrity (50%): The ability to support weight without collapsing. \n• Efficiency (30%): Use of materials in a resource-efficient manner. \n• Creativity (20%): Innovation in design and construction",
  multisim_mavericks:
    "Rulebook\n\n9.MULTISIM MAVERICKS(MULTISIM) \n➢ SOLO \n➢ OBJECTIVE \n• Participants will be required to design and simulate electrical circuits using MultiSIM \nsoftware. The challenge involves creating efficient and functional circuits to solve specific \nproblems, adhering to constraints provided. Teams will be judged based on the accuracy, \nefficiency, and creativity of their designs, as well as their ability to explain and optimize the \ncircuits \nRULES: \n• Participants must submit simulation results and design files. \n• A report explaining the design methodology must be submitted. \nJudging Criteria: \n• Accuracy (40%): Correctness of the simulation results. \n• Efficiency (30%): Optimization of the design. \n• Documentation (20%): Clarity in the written report. \n• Presentation (10%): Ability to explain the design process",
  startup_sphere:
    "Rulebook\n\n10.STARTUP SPHERE \n➢ PITCHING STARTUP IDEAS \n➢ OBJECTIVE \n• Participants must present a startup idea to a panel of judges, including market analysis, \nbusiness model, and financial projections. \nRules: \n• Teams will have 10 minutes to present their ideas. \n• Visual aids are encouraged. \n• A Q&A session will follow the pitch. \nJudging Criteria: \n• Innovation (40%): Originality and feasibility of the startup idea. \n• Business Plan (30%): Clarity in market analysis and financial projections. \n• Presentation Skills (20%): Effectiveness of the pitch. \n• Q&A Handling (10%): Confidence and clarity in answering questions",
  cad_modelling:
    "Rulebook\n\n11.CAD MODELLING \n➢ Duration: 1–2 Hours \n➢ Objective \n• Participants will design a 2D/3D model based on the given problem statement using CAD \nsoftware. The event evaluates design accuracy, creativity, and adherence to technical \nspecifications. \nRules \n• Participants must work individually. \n• The problem statement will be provided at the start of the event. \n• Only approved CAD software (such as AutoCAD, SolidWorks, Fusion 360, or similar) may be \nused. \n• Internet usage is not permitted during the contest. \n• Designs must be original and created within the event duration. \n• Final models must be saved and submitted in the required file format specified by \norganizers. \nJudging Criteria \n• Accuracy to Problem Requirements (50%): Correct dimensions and feature placement. \n• Design Quality & Detailing (30%): Clean modelling, constraints, and proper use of tools. \n• Presentation/Finish (20%): Naming conventions, neatness, and completeness of view \nrendering.",
  brain_brawl:
    "Rulebook\n\n12.BRAIN BRAWL: RULES AND GUIDELINES \n• EVENT OVERVIEW \nBrain Brawl is a team-based quiz competition designed to challenge participants across a \nrange of general knowledge and specific topics. Teams will compete to answer questions as \nquickly and accurately as possible, utilizing their collective knowledge and strategy. \n• TEAM STRUCTURE \nEach team must consist of 4 participants. \nTeams will work together to answer questions, but only one designated member can provide the \nfinal answer after discussion. \n• COMPETITION FORMAT \n1. QUIZ ROUND \nQuestions will be asked to all teams simultaneously. \nThe team that raises their hand first will be given the chance to answer. \nOnly one team member may verbally communicate the final answer, after discussing with their \nteammates. Simultaneous answers from multiple team members will not be accepted. The \ndesignated member must say \"lock answer\" after providing the final answer \n• SYLLABUS AND TOPIC COVERED\n\nParticipants should prepare for questions on the following general knowledge topics \n• History (World and Indian History) \n• Geography (World and Indian Geography) \n• Science and Technology (Basic Science, Innovations, and Current Advancements) \n• Sports (Major sports events, players, and records) \n• Entertainment (Movies, Music, TV, and Pop Culture) \n• Current Affairs (Latest news and global events) \n• Literature (Famous authors, books, and literary awards) \n• General Knowledge (Trivia, famous personalities, and events) \nRULES AND REGULATION \n1. No Mobile Phones \nAll participants must submit their phones before the competition starts. Phones will be collected at \nthe registration desk and returned at the end of the event. \n2.Answer Submission \nAll participants must submit their phones before the competition starts. Phones will be collected at \nthe registration desk and returned at the end of the event. \n3.Points and Scoring \n• Teams will accumulate points for each correct answer. The scoring system will follow a \nprogressive format, with points increasing in difficulty (e.g., 1,000 points, 2,000 points, up to \na maximum of 50 lakh points). \n• The team with the highest total points at the end of the competition will be declared the \nwinner. Second and third places will be awarded accordingly. \nWINNING CRITERIA \n• The team with the highest points at the end of all rounds will be declared the winner. \n• In the case of a tie, a tiebreaker round will be conducted with a set of additional questions.",
  utility_bot:
    "Rulebook\n\n13. UTILITY BOT (UTILITY MACHINE) \n\n➢ Duration: 1–2 Hours (Demonstration + Evaluation) \n\n➢ Objective \n• Participants will design and present a robot capable of performing a useful real-\nworld task such as lifting, sorting, transporting, cleaning, or assistance-based \noperations. The event evaluates creativity, practicality, engineering design, and \noperational efficiency. \nRules \n\n• Teams may consist of 2–4 members with one robot. \n• The robot must be battery-powered and self-contained (no external power or wired \nremote).\n\n• The task demonstration will be based on a given scenario or the team’s chosen \nutility function (which must be declared before evaluation). \n• Robots must be safe to operate: no sharp edges, fire, or hazardous materials. \n• Any pre-built kits may be used, but innovation and modifications will carry more \npoints. \nJudging Criteria \n• Functionality & Task Completion (50%): How effectively and reliably the robot performs the \nintended task. \n• Design & Innovation (30%): Creativity, mechanism design, and workflow. \n• Build Quality & Safety (20%): Structural strength, wiring neatness, and safe operation.",
};

const events = [
  {
    key: "hackathon",
    title: "Dev Conquest (Hackathon)",
    desc: "Get ready to unleash your creativity and problem-solving skills at Dev Conquest, a 24-hour hackathon where passionate developers, designers, and innovators collaborate to build and present groundbreaking solutions. Participants work nonstop to transform ideas into functional tech products within a single day. Whether you are a beginner eager to learn or an experienced coder ready to push boundaries, this event challenges innovation, teamwork, and execution under time pressure. Venue: CC-1 / CC-2 (depending on participation).",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    rulebookText: TECHNICAL_RULEBOOK_TEXT_RAW.hackathon,
  },
  {
    key: "cp",
    title: "Algo Apex (Competitive Programming)",
    desc: "Sharpen your logic, speed, and problem-solving skills at Algo Apex, a competitive programming contest designed for coding enthusiasts who thrive under pressure. Participants solve algorithmic challenges focused on data structures, algorithms, and time-optimized coding. Precision, efficiency, and clarity of thought determine success as competitors race against the clock. Venue: CC-1 / CC-2 (depending on participation).",
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    rulebookText: TECHNICAL_RULEBOOK_TEXT_RAW.cp,
  },
  {
    key: "ampere_assemble",
    title: "Ampere Assemble",
    desc: "Ampere Assemble is a hands-on electronics competition conducted in the Basic Electronics Lab. Participants design, assemble, and troubleshoot real-world electronic circuits within a limited time frame. The event tests practical knowledge, circuit understanding, teamwork, and problem-solving skills while encouraging innovation through applied electronics. Venue: Basic Electronics Lab.",
    img: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=800&q=80",
    rulebookText: TECHNICAL_RULEBOOK_TEXT_RAW.ampere_assemble,
  },
  {
    key: "robo_war",
    title: "Robo Gladiators (Robo War)",
    desc: "Gear up for the ultimate battle of bots at Robo Gladiators, where innovation meets destruction. Custom-built robots face off in a controlled combat arena, testing mechanical strength, design strategy, control, and durability. The objective is to overpower or disable the opponent through superior engineering and tactical execution. Venue: Front Gate / Dome Area.",
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    rulebookText: TECHNICAL_RULEBOOK_TEXT_RAW.robo_war,
  },
  {
    key: "robo_soccer",
    title: "Robo Soccer",
    desc: "Robo Soccer brings the excitement of football to robotics. Teams design and program robots to dribble, pass, defend, and score goals in a fast-paced match. The event emphasizes coordination between hardware and software, strategic planning, and precise control to outplay opponents. Venue: Front Gate / Dome Area.",
    img: "https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?auto=format&fit=crop&w=800&q=80",
    rulebookText: TECHNICAL_RULEBOOK_TEXT_RAW.robo_soccer,
  },
  {
    key: "robo_race",
    title: "Dirt Race (Robo Race)",
    desc: "Robo Race is a dirt-track robotics challenge where robots must navigate obstacles, sharp turns, and uneven terrain in the shortest possible time. This event tests speed, stability, control, and design efficiency, pushing robots to their mechanical and technical limits. Venue: BIT Ground.",
    img: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=800&q=80",
    rulebookText: TECHNICAL_RULEBOOK_TEXT_RAW.robo_race,
  },
  {
    key: "tall_tower",
    title: "Tall Tower",
    desc: "Tall Tower is a civil engineering challenge where participants build the tallest possible structure using limited materials. The structure must remain stable under testing conditions, emphasizing design efficiency, material optimization, and structural integrity. Venue: Civil Lab.",
    img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
    rulebookText: TECHNICAL_RULEBOOK_TEXT_RAW.tall_tower,
  },
  {
    key: "bridge_the_gap",
    title: "Aerofilia (Bridge the Gap)",
    desc: "Bridge the Gap is a structural design competition where teams construct model bridges using simple materials. The goal is to span a fixed distance while supporting maximum load. Creativity, durability, and efficient engineering design play a key role in determining success. Venue: Civil Lab.",
    img: "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=800&q=80",
    rulebookText: TECHNICAL_RULEBOOK_TEXT_RAW.bridge_the_gap,
  },
  {
    key: "multisim_mavericks",
    title: "Multisim Mavericks",
    desc: "Multisim Mavericks is a virtual electronics challenge where participants design, simulate, and test electronic circuits using NI Multisim software. The event focuses on circuit accuracy, optimization, and problem-solving through digital simulation techniques. Venue: EM Lab.",
    img: "https://images.unsplash.com/photo-1581091215367-59ab6b9b4c7a?auto=format&fit=crop&w=800&q=80",
    rulebookText: TECHNICAL_RULEBOOK_TEXT_RAW.multisim_mavericks,
  },
  {
    key: "startup_sphere",
    title: "Startup Sphere",
    desc: "Startup Sphere is a pitching and entrepreneurship event where participants present innovative ideas, business concepts, or tech-driven solutions to a panel of judges and experts. The event promotes creativity, feasibility analysis, communication skills, and entrepreneurial thinking. Venue: Conference Hall.",
    img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
    rulebookText: TECHNICAL_RULEBOOK_TEXT_RAW.startup_sphere,
  },
  {
    key: "cad_modelling",
    title: "CAD Modelling",
    desc: "CAD Modelling challenges participants to create precise 2D or 3D models using professional computer-aided design tools. The event evaluates drafting accuracy, creativity, technical skills, and the ability to translate ideas into detailed digital designs. Venue: AutoCAD Lab.",
    img: "https://images.unsplash.com/photo-1581091870627-3b6c68b6a2c6?auto=format&fit=crop&w=800&q=80",
    rulebookText: TECHNICAL_RULEBOOK_TEXT_RAW.cad_modelling,
  },
  {
    key: "brain_brawl",
    title: "Brain Brawl",
    desc: "Brain Brawl is a fast-paced technical quiz competition covering engineering disciplines such as electronics, mechanics, programming, civil concepts, logic, and general problem-solving. The event tests knowledge depth, speed, and accuracy under competitive conditions. Venue: SH-2 / LH-3 (depending on participation).",
    img: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=800&q=80",
    rulebookText: TECHNICAL_RULEBOOK_TEXT_RAW.brain_brawl,
  },
  {
    key: "utility_bot",
    title: "Utility Bot",
    desc: "Utility Bot is a machine design challenge where participants build functional robots or machines capable of performing practical, real-world tasks autonomously and efficiently. The event emphasizes innovation, precision, and applicability of engineering solutions. Venue: Dome Area near EEE Department.",
    img: "https://images.unsplash.com/photo-1581092334491-07c4b45dff47?auto=format&fit=crop&w=800&q=80",
    rulebookText: TECHNICAL_RULEBOOK_TEXT_RAW.utility_bot,
  },
];

export default function Technical() {
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

    const pdf = event?.rulebookPdf;
    if (typeof pdf === "string" && pdf.trim()) {
      window.open(pdf, "_blank", "noopener,noreferrer");
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
        eventId={getEventId(events?.[active]?.key)}
        eventTitle={events?.[active]?.title}
        eventCategory="Technical"
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
