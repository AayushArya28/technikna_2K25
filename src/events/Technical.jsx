import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventForm from "../components/EventForm.jsx";
import { getEventId, getEventKeyById } from "../lib/eventIds.js";
import { useEntitlements } from "../context/useEntitlements.jsx";
import { usePopup } from "../context/usePopup.jsx";

const RULEBOOK_PDF_URL = "/rulebooks/technical-rulebook.pdf";

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

const enhanceRulebookText = (text, eventKey) => {
  let t = String(text || "")
    .replace(/\r\n?/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/OBJECTIV\s*\n\s*E/gi, "OBJECTIVE")
    .trim();

  const hasDuration = /(^|\n)\s*duration\b/i.test(t) || /\bduration\s*:/i.test(t);
  const hasNote = /(^|\n)\s*note\b/i.test(t) || /\bnote\s*:/i.test(t);

  if (!hasDuration) {
    const duration = String(eventKey || "") === "hackathon" ? "24 hours." : "As per schedule.";
    t = `${t}\n\nDURATION\n${duration}`;
  }

  if (!hasNote) {
    t = `${t}\n\nNOTE\n• Participants must carry a valid college ID.\n• Judges’ decision will be final.`;
  }

  if (!/[.!?]$/.test(t.trim())) t = `${t}.`;
  return t;
};

const TECHNICAL_RULEBOOK_TEXT_RAW = {
  hackathon:
    "Rulebook\n\n1.DEV CONQUEST (HACKATHON) \n➢ TEAM SIZE: 2-4 MEMBERS \n➢ OBJECTIV\nE \n• Participants will build a fully functional prototype or application based on problem \nstatements provided at the start of the event \nRules: \n• Problem Statements: Teams will choose from a set of real-world problem statements \n(e.g., sustainability, smart technology). \n• Programming Language & Tools: Participants can use any programming language or \nsoftware tools. \n• Documentation: A README file detailing the project and instructions for setup must be \nsubmitted. \n• Presentation: A live demo is mandatory. \nJudging Criteria: \n• Innovation (30%): Originality and creativity in solving the problem. \n• Functionality (30%): How well the application works. \n• Usability (20%): User experience and interface design. \n• Technical Complexity (10%): Code sophistication and challenges overcome. \n• Presentation (10%): Clarity in presenting the solution",
  cp: "Rulebook\n\n2.ALGO APEX \n➢ DURATION: 2 HOURS \n➢ OBJECTIVE: \n• Participants will solve algorithmic problems testing their knowledge of data \nstructures, algorithms, and problem-solving. \nRULES: \n• Participants must submit their solutions electronically through the event’s \nsubmission system. \n• Solutions will be evaluated based on correctness and efficiency. \nJudging Criteria: \n• Problem Solving (50%): Number of problems solved correctly. \n• Efficiency (30%): Time complexity of solutions. \n• Correctness (20%): Accuracy of solutions.",
  ampere_assemble:
    "Rulebook\n\n3.AMPERE ASSEMBLE \n➢ TEAM SIZE: 2-3 MEMBERS \n➢ OBJECTIVE \n• Participants must design a functional circuit based on provided specifications, using no \nsoftware tools. \nRules: \n• Circuits must be designed manually, with all calculations done by hand. \n• No use of software tools like Multisim is allowed. \nJudging Criteria: \n• Design Accuracy (40%): How well the design meets the specifications. \n• Creativity (30%): Innovation in the design. \n• Calculations (20%): Correctness of the manual calculations. \n• Presentation (10%): Clarity in explaining the design process.",
  robo_war:
    "Rulebook\n\n4.ROBO GLADIATORS (ROBO WAR) \n➢ ARENA SIZE: 10X10 FT. \n• ROBOT SPECIFICATIONS: MAX DIMENSIONS 75X75X75 CM; WEIGHT LIMIT OF 20 KG. \n➢ OBJECTIVE \n• Participants will design combat robots to compete against others in an arena. \nRules: \n• Robots must be built to damage or immobilize opponents. \n• No flame-throwers, explosives, or projectiles are allowed. \nJudging Criteria: \n• Combat Performance (50%): Ability to disable the opponent. \n• Robot Durability (30%): Resistance to damage. \n• Design & Innovation (20%): Creativity in the robot's design",
  robo_soccer:
    "Rulebook\n\n5.ROBO SOCCER \n➢ Duration: 2–5 Minutes per Match \n➢ Objective \n• Participants will design and operate robots to compete in a soccer-style match. The goal is to \nscore by pushing or guiding the ball into the opponent’s goal, testing control, strategy, and \nmechanical design. \nRules \n• Each team consists of 2–4 members with one robot. \n• Robots must fit within 30cm x 30cm x 30cm and be battery-powered only. \n• Robots may push or guide the ball but may not lift or hold it completely. \n• Minor contact between robots is allowed; intentional damage or ramming is prohibited. \n• If a robot gets stuck or flips, the referee may allow one reset. \n• Match duration and arena size will be declared by organizers. \nJudging Criteria \n• Goals Scored (50%): Number of valid goals made during the match. \n• Control & Stability (30%): Smooth movement, balanced structure, and handling. \n• Fair Play & Conduct (20%): Clean gameplay and adherence to rules.",
  robo_race:
    "Rulebook\n\n6.DIRT RACE (ROBO-RACE) \n➢ Duration: Depends on Track Attempts (Typically 2–3 Minutes per Run) \n➢ Objective \n• Participants will navigate their robots through an obstacle-based race track. The aim is to \ncomplete the course in the shortest time while maintaining control, stability, and avoiding \npenalties. This event tests design durability, speed, and precise maneuvering. \nRules \n• Each team may have 2–4 members with one robot. \n• Robot dimensions must not exceed 30cm x 30cm x 30cm; battery-powered only. \n• The track will include ramps, bumps, turns, sand/dirt patches, and speed breakers. \n• Robots must remain within the track boundaries; going off-track incurs time penalties. \n• No dragging, pushing, or damaging the track is allowed. \n• If the robot stops, a single reset may be allowed (time runs continuously). \nJudging Criteria \n• Completion Time (60%): Fastest valid run. \n• Stability & Control (25%): Smooth handling and minimal resets. \n• Track Discipline (15%): Avoiding off-track penalties and maintaining fair play.",
  tall_tower:
    "Rulebook\n\n7.TALL TOWER (STRUCTURAL DESIGN) \n➢ TEAM SIZE: 2-3 MEMBERS \n➢ OBJECTIVE \n• Teams must design and build the tallest, most stable tower structure using the provided \nmaterials. The tower must meet specific design constraints while withstanding weight or \nenvironmental factors. The focus will be on height, stability, and structural integrity, with \nteams judged on their engineering approach, innovative design, and ability to construct a \ndurable tower. \nRules: \n• Materials such as straws, sticks, and tape will be provided. \n• Towers must be free-standing and support a specified load during testing. \nJudging Criteria: \n• Height (40%): Overall height of the tower. \n• Stability (40%): Ability to support weight without collapsing. \n• Design Creativity (20%): Innovation in the structure's design.",
  bridge_the_gap:
    "Rulebook\n\n8.AEROFILIA (BRIDGE THE GAP) \n➢ TEAM SIZE: 2-3 MEMBERS \n➢ OBJECTIVE \n• Participants must design and construct a bridge model that spans a given gap using \nspecified materials. The model should demonstrate structural efficiency, stability, and the \nability to bear a maximum load without failure. Teams will be judged on the strength of the \nbridge, innovative design, and use of materials while ensuring that the structure adheres to \ngiven constraints. \nRules: \n• Materials such as sticks, strings, and glue will be provided. \n• Bridges will be tested for stability and strength. \nJudging Criteria: \n• Structural Integrity (50%): The ability to support weight without collapsing. \n• Efficiency (30%): Use of materials in a resource-efficient manner. \n• Creativity (20%): Innovation in design and construction",
  multisim_mavericks:
    "Rulebook\n\n9.MULTISIM MAVERICKS(MULTISIM) \n➢ SOLO \n➢ OBJECTIVE \n• Participants will be required to design and simulate electrical circuits using MultiSIM \nsoftware. The challenge involves creating efficient and functional circuits to solve specific \nproblems, adhering to constraints provided. Teams will be judged based on the accuracy, \nefficiency, and creativity of their designs, as well as their ability to explain and optimize the \ncircuits \nRULES: \n• Participants must submit simulation results and design files. \n• A report explaining the design methodology must be submitted. \nJudging Criteria: \n• Accuracy (40%): Correctness of the simulation results. \n• Efficiency (30%): Optimization of the design. \n• Documentation (20%): Clarity in the written report. \n• Presentation (10%): Ability to explain the design process",
  startup_sphere:
    "Rulebook\n\n10.STARTUP SPHERE \n➢ PITCHING STARTUP IDEAS \n➢ OBJECTIVE \n• Participants must present a startup idea to a panel of judges, including market analysis, \nbusiness model, and financial projections. \nRules: \n• Teams will have 10 minutes to present their ideas. \n• Visual aids are encouraged. \n• A Q&A session will follow the pitch. \nJudging Criteria: \n• Innovation (40%): Originality and feasibility of the startup idea. \n• Business Plan (30%): Clarity in market analysis and financial projections. \n• Presentation Skills (20%): Effectiveness of the pitch. \n• Q&A Handling (10%): Confidence and clarity in answering questions",
  cad_modelling:
    "Rulebook\n\n11.CAD MASTER (AUTOCAD / SKETCHUP DESIGN CHALLENGE) \n➢ Duration: 1–2 Hours \n➢ Objective \n• Participants will design a 2D/3D model based on the given problem statement using CAD \nsoftware. The event evaluates design accuracy, creativity, and adherence to technical \nspecifications. \nRules \n• Participants must work individually. \n• The problem statement will be provided at the start of the event. \n• Only approved CAD software (such as AutoCAD, SolidWorks, Fusion 360, or similar) may be \nused. \n• Internet usage is not permitted during the contest. \n• Designs must be original and created within the event duration. \n• Final models must be saved and submitted in the required file format specified by \norganizers. \nJudging Criteria \n• Accuracy to Problem Requirements (50%): Correct dimensions and feature placement. \n• Design Quality & Detailing (30%): Clean modelling, constraints, and proper use of tools. \n• Presentation/Finish (20%): Naming conventions, neatness, and completeness of view \nrendering.",
  brain_brawl:
    "Rulebook\n\n12.BRAIN BRAWL: RULES AND GUIDELINES \n• EVENT OVERVIEW \nBrain Brawl is a team-based quiz competition designed to challenge participants across a \nrange of general knowledge and specific topics. Teams will compete to answer questions as \nquickly and accurately as possible, utilizing their collective knowledge and strategy. \n• TEAM STRUCTURE \nEach team must consist of 4 participants. \nTeams will work together to answer questions, but only one designated member can provide the \nfinal answer after discussion. \n• COMPETITION FORMAT \n1. QUIZ ROUND \nQuestions will be asked to all teams simultaneously. \nThe team that raises their hand first will be given the chance to answer. \nOnly one team member may verbally communicate the final answer, after discussing with their \nteammates. Simultaneous answers from multiple team members will not be accepted. The \ndesignated member must say \"lock answer\" after providing the final answer \n• SYLLABUS AND TOPIC COVERED\n\nParticipants should prepare for questions on the following general knowledge topics \n• History (World and Indian History) \n• Geography (World and Indian Geography) \n• Science and Technology (Basic Science, Innovations, and Current Advancements) \n• Sports (Major sports events, players, and records) \n• Entertainment (Movies, Music, TV, and Pop Culture) \n• Current Affairs (Latest news and global events) \n• Literature (Famous authors, books, and literary awards) \n• General Knowledge (Trivia, famous personalities, and events) \nRULES AND REGULATION \n1. No Mobile Phones \nAll participants must submit their phones before the competition starts. Phones will be collected at \nthe registration desk and returned at the end of the event. \n2.Answer Submission \nAll participants must submit their phones before the competition starts. Phones will be collected at \nthe registration desk and returned at the end of the event. \n3.Points and Scoring \n• Teams will accumulate points for each correct answer. The scoring system will follow a \nprogressive format, with points increasing in difficulty (e.g., 1,000 points, 2,000 points, up to \na maximum of 50 lakh points). \n• The team with the highest total points at the end of the competition will be declared the \nwinner. Second and third places will be awarded accordingly. \nWINNING CRITERIA \n• The team with the highest points at the end of all rounds will be declared the winner. \n• In the case of a tie, a tiebreaker round will be conducted with a set of additional questions.",
  utility_bot:
    "Rulebook\n\n13. MACHUTILITY EXTREME (UTILITY MACHINE) \n\n➢ Duration: 1–2 Hours (Demonstration + Evaluation) \n\n➢ Objective \n• Participants will design and present a robot capable of performing a useful real-\nworld task such as lifting, sorting, transporting, cleaning, or assistance-based \noperations. The event evaluates creativity, practicality, engineering design, and \noperational efficiency. \nRules \n\n• Teams may consist of 2–4 members with one robot. \n• The robot must be battery-powered and self-contained (no external power or wired \nremote).\n\n• The task demonstration will be based on a given scenario or the team’s chosen \nutility function (which must be declared before evaluation). \n• Robots must be safe to operate: no sharp edges, fire, or hazardous materials. \n• Any pre-built kits may be used, but innovation and modifications will carry more \npoints. \nJudging Criteria \n• Functionality & Task Completion (50%): How effectively and reliably the robot performs the \nintended task. \n• Design & Innovation (30%): Creativity, mechanism design, and workflow. \n• Build Quality & Safety (20%): Structural strength, wiring neatness, and safe operation.",
};

const events = [
  {
    key: "ampere_assemble",
    title: "Ampere Assemble",
    desc: "Dive into the world of circuits and electronics. This competition tests participants’ knowledge and practical skills in assembling and troubleshooting complex electronic systems. Venue: Basic Electronics Lab.",
    img: "https://i.ibb.co/WN6tVSyQ/ampere-assemble.png",
    participation: "Team (2–3 participants)",
    allowedModes: ["group"],
    groupMinTotal: 2,
    groupMaxTotal: 3,
  },
  {
    key: "cad_modelling",
    title: "CAD Master (AutoCAD / SketchUp Design Challenge)",
    desc: "A timed design challenge where participants draft or model a given structural plan using CAD tools. Judging is based on accuracy, speed, and creativity. Venue: AutoCAD Lab.",
    img: "https://i.ibb.co/Q3vRzMQL/cad-master.png",
    participation: "Solo",
    allowedModes: ["solo"],
  },
  {
    key: "bridge_the_gap",
    title: "Aerofilia (Bridge the Gap)",
    desc: "Teams engineer a model bridge capable of withstanding loads, testing design ingenuity, structural strength, and stability. Venue: Civil Lab.",
    img: "https://i.ibb.co/hFkFxDDG/aerofilia.png",
    participation: "Team (2–3 participants)",
    allowedModes: ["group"],
    groupMinTotal: 2,
    groupMaxTotal: 3,
  },
  {
    key: "robo_soccer",
    title: "Robo Soccer",
    desc: "A high-energy competition where student-built robots play football—dribbling, passing, and scoring through strategy and engineering brilliance. Venue: Front Gate / Dome Area.",
    img: "https://i.ibb.co/N673xHRq/robo-soccer.png",
    participation: "Team (up to 5 participants)",
    allowedModes: ["group"],
    groupMinTotal: 2,
    groupMaxTotal: 5,
  },
  {
    key: "tall_tower",
    title: "Tall Tower",
    desc: "Teams build the tallest and most stable structure using limited resources, pushing architectural creativity and structural integrity. Venue: Civil Lab.",
    img: "https://i.ibb.co/gZHLF9bx/tall-tower.png",
    participation: "Team (2–3 participants)",
    allowedModes: ["group"],
    groupMinTotal: 2,
    groupMaxTotal: 3,
  },
  {
    key: "robo_war",
    title: "Robo Gladiators (Robo War)",
    desc: "Custom-built robots battle in an intense arena. Participants design, build, and control robotic warriors to demolish opponents. Venue: Front Gate / Dome Area.",
    img: "https://i.ibb.co/bj6990Qp/robo-gladiators.png",
    participation: "Team (up to 5 participants)",
    allowedModes: ["group"],
    groupMinTotal: 2,
    groupMaxTotal: 5,
  },
  {
    key: "multisim_mavericks",
    title: "Multisim Mavericks (Multisim)",
    desc: "A circuit simulation competition where participants design and test complex circuits virtually using Multisim. Venue: EM Lab.",
    img: "https://i.ibb.co/xtXHHP7S/mutlisim-mavericks.png",
    participation: "Solo",
    allowedModes: ["solo"],
  },
  {
    key: "utility_bot",
    title: "MachUtility Extreme (Utility Machine)",
    desc: "Participants design and build a multi-functional machine with real-world utility applications, focusing on autonomous task performance. Venue: Dome Area near EEE Department.",
    img: "https://i.ibb.co/2Y785q4V/mach-ultility.png",
    participation: "Team (2–4 participants)",
    allowedModes: ["group"],
    groupMinTotal: 2,
    groupMaxTotal: 4,
  },
  {
    key: "startup_sphere",
    title: "Startup Sphere (Pitching Ideas)",
    desc: "An entrepreneurial showdown where participants pitch startup ideas to industry experts and compete for the best concept. Venue: Conference Hall.",
    img: "https://i.ibb.co/1fS1PMXV/startup-sphere.png",
    participation: "Solo",
    allowedModes: ["solo"],
  },
  {
    key: "cp",
    title: "Algo Apex (Competitive Programming)",
    desc: "A competitive coding event focused on algorithms and problem-solving skills. Venue: CC-1 / CC-2 (depending on participation).",
    img: "https://i.ibb.co/BXfwHmn/algo-apex.png",
    participation: "Solo",
    allowedModes: ["solo"],
  },
  {
    key: "hackathon",
    title: "Dev Conquest (Hackathon)",
    desc: "An intense hackathon challenging teams to build innovative solutions to real-world problems. Venue: CC-1 / CC-2 (depending on participation).",
    img: "https://i.ibb.co/20SGzKMv/dev-contest.png",
    participation: "Team (2–4 participants)",
    allowedModes: ["group"],
    groupMinTotal: 2,
    groupMaxTotal: 4,
    registrationPaused: true,
  },
  {
    key: "robo_race",
    title: "Dirt Race (Robo-Race)",
    desc: "Robots race against time on a challenging track filled with twists, turns, and obstacles, testing speed and control. Venue: BIT Ground.",
    img: "https://i.ibb.co/1Y0mTzkr/dirt-race.png",
    participation: "Team (up to 5 participants)",
    allowedModes: ["group"],
    groupMinTotal: 2,
    groupMaxTotal: 5,
  },
];

export default function Technical() {
  const [active, setActive] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sliderRef = useRef(null);
  const cardRef = useRef(null);
  const popup = usePopup();
  const { loading: entitlementsLoading, canAccessEvents } = useEntitlements();

  const activeEvent = events?.[active];
  const registrationPaused = !!activeEvent?.registrationPaused;

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
                onClick={() => {
                  if (registrationPaused) {
                    popup.info("Hackathon registration is temporarily paused.");
                    return;
                  }
                  setFormOpen(true);
                }}
                className={
                  registrationPaused
                    ? "bg-white/10 border border-white/15 transition px-6 py-3 rounded-lg text-white/70 font-bold cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-lg text-white font-bold"
                }
              >
                {registrationPaused ? "Registrations Paused" : "Register Now"}
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
        allowedModes={events?.[active]?.allowedModes}
        groupMinTotal={events?.[active]?.groupMinTotal}
        groupMaxTotal={events?.[active]?.groupMaxTotal}
      />
    </div>
  );
}
