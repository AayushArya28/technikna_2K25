import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const events = [
  {
    title: "Code Arena",
    desc: "Competitive Programming Battle for elite coders.",
    img: "https://wallpapercave.com/wp/wp13514544.jpg",
  },
  {
    title: "Hack Battle",
    desc: "24-hour Hackathon with real-world problem statements.",
    img: "https://wallpapercave.com/wp/wp9777674.png",
  },
  {
    title: "AI Showdown",
    desc: "Machine Learning & AI based coding challenges.",
    img: "https://as2.ftcdn.net/v2/jpg/05/40/07/17/1000_F_540071724_i82PvZO9FccmGpHEGTQyChbX7G7DLRIo.jpg",
  },
  {
    title: "Cyber Security",
    desc: "CTF, ethical hacking & digital forensics.",
    img: "https://wallpapercave.com/wp/wp13514544.jpg",
  },
  {
    title: "UI/UX Wars",
    desc: "Design battles for creative designers.",
    img: "https://as2.ftcdn.net/v2/jpg/05/40/07/17/1000_F_540071724_i82PvZO9FccmGpHEGTQyChbX7G7DLRIo.jpg",
  },
  {
    title: "Code Arena",
    desc: "Competitive Programming Battle for elite coders.",
    img: "https://wallpapercave.com/wp/wp13514544.jpg",
  },
  {
    title: "Hack Battle",
    desc: "24-hour Hackathon with real-world problem statements.",
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
  },
  {
    title: "AI Showdown",
    desc: "Machine Learning & AI based coding challenges.",
    img: "https://wallpapercave.com/wp/wp9777674.png",
  },
  {
    title: "Cyber Security",
    desc: "CTF, ethical hacking & digital forensics.",
    img: "https://as2.ftcdn.net/v2/jpg/05/40/07/17/1000_F_540071724_i82PvZO9FccmGpHEGTQyChbX7G7DLRIo.jpg",
  },
  {
    title: "UI/UX Wars",
    desc: "Design battles for creative designers.",
    img: "https://wallpapercave.com/wp/wp13514544.jpg",
  },
];

export default function Fun() {
  const [active, setActive] = useState(0);
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
        TECHNICAL EVENTS
      </h1>

      <div className="mt-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-black/80 rounded-3xl p-8">
        {/* LEFT IMAGE */}
        <div className="rounded-2xl overflow-hidden">
          <img
            src={events[active].img}
            alt="event"
            className="w-full h-[260px] object-cover"
          />
        </div>

        {/* RIGHT DETAILS */}
        <div>
          <h2 className="text-3xl text-white font-bold mb-3">
            {events[active].title}
          </h2>

          <p className="text-white mb-10">{events[active].desc}</p>

          <ul className="text-sm text-white space-y-2 mb-6">
            <li>➤ Solo & Team Participation</li>
            <li>➤ Certificates & Cash Prizes</li>
            <li>➤ On-Spot Evaluation</li>
          </ul>

          <button className="bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-lg text-white font-bold">
            Register Now
          </button>
        </div>
      </div>
      <div className="relative flex items-center justify-center max-w-7xl mx-auto mb-24">
        {/* LEFT ARROW */}
        <button
          onClick={prev}
          className="absolute left-0 z-30 bg-black text-white px-3 py-2 rounded-full"
        >
          ◀
        </button>

        {/* SLIDER TRACK */}
        <div
          ref={sliderRef}
          className="flex gap-6 px-20 overflow-hidden items-center h-[300px]"
        >
          {events.map((event, index) => {
            const isActive = index === active;

            return (
              <div
                key={index}
                ref={isActive ? cardRef : null}
                onClick={() => setActive(index)}
                className={`relative cursor-pointer transition-all duration-500 rounded-xl overflow-hidden flex-shrink-0
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
                />

                {/* TEXT */}
                <div className="absolute bottom-0 w-full p-2 bg-black/40">
                  <h2 className="text-s font-bold text-white">{event.title}</h2>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT ARROW */}
        <button
          onClick={next}
          className="absolute right-0 z-30 bg-black text-white px-3 py-2 rounded-full"
        >
          ▶
        </button>
      </div>
    </div>
  );
}
