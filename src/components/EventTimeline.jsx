import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

// ---- CONFIG ----
const DAY_DATES = {
  day1: new Date("2026-01-16"),
  day2: new Date("2026-01-17"),
  day3: new Date("2026-01-18"),
};

// ---- EVENT DATA ----
const EVENTS = [
  { day: "day1", time: "09:30 - 10:30", title: "Multism Mavericks(Multism Simulation)", location: "EM Lab" },
  { day: "day1", time: "10:30 - 12:30", title: "Bridge the Gap (Bridge Making)", location: "Civil Lab" },
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

const partnerGrid = [
  { name: "PANIKA", icon: "https://i.ibb.co/bjSqT9wr/panika-logo-1.png", sub: "Hydration Partner" },
  { name: "tiqr event", icon: "https://i.ibb.co/QFkNKpfN/tiqr-events-logo.png", sub: "Digital Media Partner" },
  { name: "ADBARK THREADS", icon: "https://i.ibb.co/k2w83Vv7/adbark-logo.jpg", sub: "Merchandise Partner" },
  { name: "unique PATNA", icon: "https://i.ibb.co/TMDVGw1S/unique-patna.jpg", sub: "Social Media Partner" },
  { name: "Jio Saavn", icon: "https://i.ibb.co/0y3ph0Vh/1.png", sub: "Official Music Streaming Partner" },
  { name: "CERAMIC Junction", icon: "https://i.ibb.co/Q39SzLVv/2.png", sub:  "Official Event Partner" },
  { name: "Bank of Baroda", icon: "https://i.ibb.co/6RD2V7K8/3.png", sub: "Official Banking Partner" },
  { name: "VENUS STAR", icon: "https://i.ibb.co/tMrhNJ0R/4.png" , sub: "Bronze Sponsor"},
  { name: "BSEDCL", icon: "https://i.ibb.co/27X3GXL4/5.png", sub: "Event Partner" },
  { name: "GAIL", icon: "https://i.ibb.co/bMqpwbPQ/6.png",label:"Official Partner", sub: "Official Partner" },
  { name: "Prohibition, Excise and Registration Department", icon: "https://i.ibb.co/pBXb1nch/7.png" },
  { name: "NSMCH", icon: "https://i.ibb.co/rGkSQvb0/8.png", sub: "Medical Partner" },
  { name: "Plum Body lovin'", icon: "https://i.ibb.co/HTvrvPj4/9.png" , sub: "Bath & Body Partner"},
  { name: "DKMS", icon: "https://i.ibb.co/tPkXCw4G/10.png", sub: "Social Welfare Partner" },
  { name: "Maa construction", icon: "https://i.ibb.co/wFkQvNFH/11.png" },
  { name: "Sudha", icon: "https://i.ibb.co/hJSggBBd/12.png", sub: "Associate Sponsor Dairy & Nutrition" },
  { name: "Innovadores", icon: "https://i.ibb.co/DHvJdRCk/13.png",  sub: "Artist & Event Partner" },
  { name: "HORIZON", icon: "https://i.ibb.co/gLXP16cW/14.png", sub: "Supporting Partner" },
  { name: "G.C", icon: "https://i.ibb.co/R49yfmT9/15.png" },
  { name: "LIC", icon: "https://i.ibb.co/QBB819K/16.png" },
  { name: "Dainik jagran", icon: "https://i.ibb.co/0yGW5hyN/17.png",  sub: " Official Media Partner" },
  { name: "event om", icon: "https://i.ibb.co/fgYsVvg/18.png" },
  { name: "BIHAR STATE WAREHOUSING CORPORATION", icon: "https://i.ibb.co/CK0JYvxY/19.png" },
  { name: "Shrimate event planners", icon: "https://i.ibb.co/8D9xFzd3/20.png" },
]

// ---- HELPERS ----
function getEventStatus(event, now) {
  const [start, end] = event.time.split("-").map((t) => t.trim());
  const eventDate = DAY_DATES[event.day];

  const startDate = new Date(eventDate);
  const endDate = new Date(eventDate);

  const [sh, sm] = start.split(":");
  const [eh, em] = end.split(":");

  startDate.setHours(+sh, +sm, 0);
  endDate.setHours(+eh, +em, 0);

  if (now > endDate) return "completed";
  if (now >= startDate && now <= endDate) return "ongoing";
  return "upcoming";
}

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

export default function EventTimeline() {
  const containerRef = useRef(null);
  const [now, setNow] = useState(new Date());
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [paddT, setPaddT] = useState(90);

  // live clock
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // rotate sponsor headline
  useEffect(() => {
    const i = setInterval(() => {
      setHeadlineIndex((p) => (p + 1) % partnerGrid.length);
    }, 3500);
    return () => clearInterval(i);
  }, []);

  // auto scroll (non-ongoing only)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let scroll = 0;
    const speed = 1.2;

    const loop = () => {
      scroll += speed;
      if (scroll >= el.scrollHeight / 2) scroll = 0;
      el.scrollTop = scroll;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }, []);

  

  const ongoingEvents = useMemo(
    () => EVENTS.filter((e) => getEventStatus(e, now) === "ongoing"),
    [now]
  );

  useEffect(() => {
    setPaddT(ongoingEvents.length * 90 + 170);
  }, [ongoingEvents.length]);

  const groupedScrollEvents = useMemo(() => {
    return ["day1", "day2", "day3"].map((day) => ({
      day,
      events: EVENTS.filter(
        (e) => e.day === day && getEventStatus(e, now) !== "ongoing"
      ),
    }));
  }, [now]);

  const scrollEvents = useMemo(
    () => EVENTS.filter((e) => getEventStatus(e, now) !== "ongoing"),
    [now]
  );

  const sponsor = partnerGrid[headlineIndex];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* TOP BAR */}
      <div className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur border-b border-white/10">
        <div className="flex items-center gap-4 w-full px-4 py-2">
          {/* CLOCK */}
          <div className="font-mono text-white bg-black/60 text-2xl px-3 py-1 w-full flex flex-row justify-between items-center rounded-md">
           {now.toLocaleTimeString("en-US", {
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
})}
            <motion.div
            key={headlineIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 ml-4"
          >
            <span className="text-white tracking-tight italic uppercase text-4xl font-bold">
              Our <span className="text-red-500">Sponsors</span>
            </span>

    <div className="flex items-center h-25 gap-4 bg-white/5 px-6 py-4 rounded-2xl border border-white/10 overflow-hidden">
      <img
        src={sponsor.icon}
        alt={sponsor.name}
        className="w-40 object-contain"
      />

  <div>
    <p className="text-2xl font-semibold">{sponsor.name}</p>
    <p className="text-sm text-gray-400 uppercase tracking-wide">
      {sponsor.sub}
    </p>
  </div>
</div>
          </motion.div>
          </div>

          {/* HEADLINE */}
          
        </div>
      </div>

      {/* ONGOING EVENTS (PINNED) */}
      {ongoingEvents.length > 0 && (
        <div className="fixed top-10 left-0 w-full z-40 bg-black backdrop-blur border-b border-green-400/20 pt-20">
          <div className="px-4 py-3 space-y-2">
            <p className="text-green-400 text-xl font-bold tracking-wider">
              LIVE NOW
            </p>
            {ongoingEvents.map((event, i) => (
              <div
                key={i}
                className="flex justify-between items-center font-sans bg-green-400/10 border border-green-400/30 rounded-lg p-3"
              >
                <div>
                  <p className="font-semibold text-2xl">{event.title}</p>
                  <p className="text-lg text-gray-400">📍 {event.location}</p>
                </div>
                <span className="text-green-400 font-mono text-2xl ">
                  {formatTimeRange(event.time)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AUTO SCROLL EVENTS (Grouped by Day, Sticky Day Header) */}
      <div
        ref={containerRef}
        className={` h-screen overflow-hidden`}
      >
        <div className="space-y-8 px-4 pt-60">
          {groupedScrollEvents.map((group, groupIdx) => (
            <div key={group.day + groupIdx} className="space-y-4">
              <h2
                className={`text-3xl font-bold mb-2 pt-1 text-center text-yellow-400 sticky z-30`}
                style={{
                  top: paddT,
                  background: 'rgba(0,0,0,1)',
                  padding: '0.5rem 0',
                  borderRadius: '0.75rem',
                  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.1)'
                }}
              >
                {group.day === "day1" ? "Day 1" : group.day === "day2" ? "Day 2" : "Day 3"}
              </h2>
              {[...group.events, ...group.events].map((event, i) => {
                const status = getEventStatus(event, now);
                return (
                  <motion.div
                    key={i}
                    className={`rounded-xl p-4 border flex justify-between items-center
                      ${status === "upcoming" && "border-blue-400 bg-blue-400/10"}
                      ${status === "completed" && "border-gray-600 opacity-50 line-through"}`}
                  >
                    <div>
                      <p className="font-semibold text-2xl">{event.title}</p>
                      <p className="text-lg text-gray-400">📍 {event.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl">{formatTimeRange(event.time)}</p>
                      <span className={`text-xs font-bold
                        ${status === "upcoming" && "text-blue-400"}
                        ${status === "completed" && "text-gray-400"}`}
                      >
                        {capitalizeFirstLetter(status)}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
