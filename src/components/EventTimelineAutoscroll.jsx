import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";

// ---- CONFIG ----
const DAY_DATES = {
  day1: new Date("2026-01-16"),
  day2: new Date("2026-01-17"),
  day3: new Date("2026-01-18"),
};

// ---- EVENT DATA ----
const EVENTS = [
  { day: "day1", time: "07:30 - 08:30", title: "Multism Mavericks(Multism Simulation)", location: "EM Lab" },
  { day: "day1", time: "08:30 - 12:30", title: "Bridge the Gap (Bridge Making)", location: "Civil Lab" },
  { day: "day1", time: "12:30 - 13:30", title: "Wall Painting", location: "Lawn Tennis Court Area" },
  { day: "day1", time: "12:00 - 14:00", title: "Algo Apex (Competitive Programming)", location: "Online" },
  { day: "day1", time: "12:00 - 15:00", title: "BGMI (LAN), Real Cricket", location: "Gaming Arena" },
  { day: "day1", time: "14:00 - 16:00", title: "Inaugration", location: "Auditorium" },
  { day: "day1", time: "16:00 - 17:30", title: "Solo Dance", location: "Auditorium" },
  { day: "day1", time: "17:30 - 18:00", title: "Poetry", location: "Auditorium" },
  { day: "day1", time: "18:00 - 19:00", title: "Fusion Fiesta (Group Singing)", location: "Auditorium" },
  { day: "day1", time: "19:00 - 19:45", title: "Matargasti (Play)", location: "Auditorium" },
  { day: "day1", time: "19:45 - 20:45", title: "Exuberance (Group Dance)", location: "Auditorium" },
  { day: "day1", time: "21:00 - 23:00", title: "Valorant", location: "Online" },

  { day: "day2", time: "09:00 - 10:00", title: "Ampere Assemble (Circuit Making)", location: "Basic Electronics Lab" },
  { day: "day2", time: "10:00 - 12:00", title: "Robo War", location: "Front Gate" },
  { day: "day2", time: "10:30 - 11:30", title: "Pencil Sketch", location: "LG-1" },
  { day: "day2", time: "10:30 - 13:30", title: "BGMI (LAN), Real Cricket", location: "Gaming Arena" },
  { day: "day2", time: "12:00 - 13:00", title: "Tall Tower (Tower Making Using Stick)", location: "Civil Lab" },
  { day: "day2", time: "10:00 - 12:00", title: "Speed Cubing", location: "LH-3" },
  { day: "day2", time: "13:30 - 14:30", title: "Utility Machine (Machine Demonstration)", location: "Near EEE Dept." },
  { day: "day2", time: "13:30 - 15:30", title: "Robo Soccer", location: "Front Gate" },
  { day: "day2", time: "14:00 - 15:00", title: "Hulchul (Nukkad)", location: "Faculty Parking Area" },
  { day: "day2", time: "14:30 - 15:00", title: "Kavi Sammelan", location: "Conference Hall" },
  { day: "day2", time: "15:00 - 16:30", title: "Music Marvel (Instrument)", location: "Auditorium" },
  { day: "day2", time: "16:30 - 17:30", title: "Synced Showdown (Duo)", location: "Auditorium" },
  { day: "day2", time: "17:30 - 18:30", title: "Ekanki (Mono Act)", location: "Auditorium" },
  { day: "day2", time: "18:30 - 19:30", title: "Raag Unreleased (Solo Singing)", location: "Auditorium" },
  { day: "day2", time: "19:30 - 21:00", title: "Fashion Insta", location: "Auditorium" },

  { day: "day3", time: "09:00 - 11:00", title: "CAD Modelling (CAD Simulation)", location: "CAD Lab" },
  { day: "day3", time: "11:00 - 13:00", title: "Dirt Race (Robo Race)", location: "Front Gate" },
  { day: "day3", time: "13:00 - 14:00", title: "Street Dance", location: "Main Gate" },
  { day: "day3", time: "13:00 - 14:00", title: "Result and Testing of Tall Tower and Aerofilia", location: "Civil Lab" },
  { day: "day3", time: "13:00 - 14:00", title: "Result and Testing of Motion-e-Magic and Capture the Unseen", location: "Civil Lab" },
  { day: "day3", time: "13:00 - 15:00", title: "Guiding Academics (Aptitute Test)", location: "Conference Hall" },
  { day: "day3", time: "14:00 - 15:00", title: "Startup Sphere", location: "Conference Hall (Management)" },
  { day: "day3", time: "14:00 - 15:00", title: "Vaad - Vivaad (Debate)", location: "Language Lab" },
  { day: "day3", time: "15:30 - 17:30", title: "Closing & Veledictory", location: "Auditorium" },
  { day: "day3", time: "18:00 - 23:00", title: "Pronite", location: "BIT Ground" },
];

// ---- HELPERS ----

function capitalizeFirstLetter(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function to12Hour(time) {
  let [hour, minute] = time.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
}

function formatTimeRange(timeRange) {
  const [start, end] = timeRange.split(" - ");
  return `${to12Hour(start)} - ${to12Hour(end)}`;
}

function parseTime(date, timeStr) {
  const [start, end] = timeStr.split("-").map((t) => t.trim());
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);

  const startDate = new Date(date);
  startDate.setHours(sh, sm, 0, 0);

  const endDate = new Date(date);
  endDate.setHours(eh, em, 0, 0);

  return { startDate, endDate };
}

function getEventStatus(event) {
  const now = new Date();
  const { startDate, endDate } = parseTime(DAY_DATES[event.day], event.time);

  if (now > endDate) return "completed";
  if (now >= startDate && now <= endDate) return "ongoing";
  return "upcoming";
}

function getDayStatus(dayKey) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const d = new Date(DAY_DATES[dayKey]);
  d.setHours(0, 0, 0, 0);

  if (today > d) return "completed";
  if (today < d) return "upcoming";
  return "ongoing";
}

export default function EventTimelineAutoScroll() {
  const containerRef = useRef(null);

  const grouped = useMemo(() => {
    const map = { day1: [], day2: [], day3: [] };
    EVENTS.forEach((e) => map[e.day].push(e));
    return map;
  }, []);

  const loopedDays = useMemo(() => ["day1", "day2", "day3", "day1", "day2", "day3"], []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let scrollPos = 0;
    const speed = 1.2;

    const interval = setInterval(() => {
      scrollPos += speed;
      el.scrollTop = scrollPos;

      if (scrollPos >= el.scrollHeight / 2) {
        scrollPos = 0;
        el.scrollTop = 0;
      }
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex justify-center">
      {/* Auto-scroll section takes 90% width */}
      <div className="w-[95vw] h-screen overflow-hidden mt-30">
        <div
          ref={containerRef}
          className="h-full overflow-y-scroll px-8 py-6 space-y-12 
           scrollbar-none"
        >
          {loopedDays.map((dayKey, idx) => {
            const dayStatus = getDayStatus(dayKey);

            return (
              <div key={idx} className="space-y-6">
                {/* STICKY DAY HEADER */}
                <div
                  className={`sticky -top-6 z-20 backdrop-blur-md px-6 py-3 rounded-xl border text-lg font-semibold ${
                    dayStatus === "ongoing"
                      ? "bg-green-500/20 text-green-400 border-green-400/30"
                      : dayStatus === "upcoming"
                      ? "bg-blue-500/20 text-blue-400 border-blue-400/30"
                      : "bg-zinc-800/80 text-zinc-400 border-zinc-700"
                  }`}
                >
                  {dayKey.toUpperCase()} • {capitalizeFirstLetter(dayStatus)}
                </div>

                {/* EVENTS */}
                {grouped[dayKey].map((e, i) => {
                  const status = getEventStatus(e);
                  const isCompleted = status === "completed";

                  return (
                    <motion.div
  key={i}
  className={`grid grid-cols-[3fr_2fr_1fr] items-center gap-4 p-5 rounded-2xl border 
    ${
      status === "completed"
        ? "bg-zinc-900/50 border-zinc-700/40 opacity-60 line-through decoration-zinc-500"
        : status === "ongoing"
        ? "bg-green-900/70 border-green-500/50 shadow-[0_0_15px_rgba(0,255,0,0.5)]"
        : "bg-black/70 border-red-500/60"
    }`}
  whileHover={{
    scale: 1.03,
    boxShadow:
      status === "ongoing"
        ? "0 0 25px rgba(0,255,0,0.7)"
        : status === "upcoming"
        ? "0 0 25px rgba(255,0,0,0.7)"
        : "0 0 10px rgba(255,255,255,0.1)",
  }}
  transition={{ type: "spring", stiffness: 100, damping: 10 }}
>
  {/* LEFT: name + location */}
  <div className={isCompleted ? "line-through decoration-zinc-500" : ""}>
    <h3
      className={`text-2xl font-bold tracking-wide ${
        status === "ongoing"
          ? "text-green-400"
          : "text-white"
      }`}
    >
      {e.title}
    </h3>
    <p
      className={`text-md ${
        status === "ongoing"
          ? "text-green-300"
          : status === "upcoming"
          ? "text-red-300"
          : "text-zinc-400"
      }`}
    >
      📍 {e.location}
    </p>
  </div>

  {/* CENTER: time */}
  <div
    className={`text-center text-xl ${
      isCompleted ? "line-through text-zinc-500" : "text-white"
    }`}
  >
    {formatTimeRange(e.time)}
  </div>

  {/* RIGHT: status */}
  <div className="text-right">
    <span
      className={`text-xl text-center px-6 pt-1 pb-2 rounded-full font-semibold
        ${
          status === "ongoing"
            ? "bg-green-500/20 text-green-400"
            : status === "upcoming"
            ? "bg-red-500/20 text-red-400"
            : "bg-zinc-700/40 text-zinc-400"
        }`}
    >
      {capitalizeFirstLetter(status)}
    </span>
  </div>
</motion.div>

                  );
                })}
              </div>
            );
          })}
      </div>
      </div>
    </div>
  );
}
