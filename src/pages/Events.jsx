// Previous Events page retained for reference.
import React, { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import BrowserWarningModal from "../components/BrowserWarningModal.jsx";
import { useEntitlements } from "../context/useEntitlements.jsx";
import { usePopup } from "../context/usePopup.jsx";

const heroes = [
  {
    id: 1,
    name: "Technical",
    img: "https://wallpapercave.com/wp/wp13514544.jpg",
    route: "/technical",
  },
  {
    id: 2,
    name: "Fun",
    img: "https://img.pikbest.com/illustration/20240607/the-soldiers-of-samurai-warrior_10600894.jpg!bw700",
    route: "/fun",
  },
  {
    id: 3,
    name: "Cultural",
    img: "https://tse2.mm.bing.net/th/id/OIP.DYk6BjV4Sjjm0vC0VkFhJAHaEJ?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
    route: "/cultural",
  },
  {
    id: 4,
    name: "Workshops",
    img: "https://tse1.explicit.bing.net/th/id/OIP.fPRomGdpeIgwomQpBnE1WgHaNK?cb=ucfimg2&ucfimg=1&w=1080&h=1920&rs=1&pid=ImgDetMain&o=7&rm=3",
    route: "/workshops",
  },
];
export function Events() {
  const [active, setActive] = useState(null);
  const navigate = useNavigate();
  const popup = usePopup();
  const { loading: entitlementsLoading, canAccessEvents } = useEntitlements();

  const downloadOrComingSoon = (href) => {
    if (typeof href === "string" && href.trim()) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
    popup.info("Coming soon.");
  };

  useEffect(() => {
    if (entitlementsLoading) return;
    if (canAccessEvents) return;

    popup.info("Alumni Pass users can access only the Alumni section.");
    navigate("/alumni", { replace: true });
  }, [canAccessEvents, entitlementsLoading, navigate, popup]);

  return (
    <>
      <BrowserWarningModal />
      <div className="min-h-screen bg-black px-6 pt-24">
        <div>
          <div className="mx-auto max-w-6xl w-full rounded-2xl overflow-hidden border border-red-500/20 bg-black/60 shadow-[0_0_40px_rgba(239,68,68,0.45)]">
            <div className="marquee py-2.5">
              <div className="marquee__track">
                <div className="marquee__content px-6 text-xs sm:text-sm uppercase tracking-[0.35em] text-white/85">
                  Prize Pool of Events: 5 Lakhs+ <span className="mx-6 text-white/30">•</span> Prize Pool of Events: 5 Lakhs+ <span className="mx-6 text-white/30">•</span> Prize Pool of Events: 5 Lakhs+
                </div>
                <div
                  className="marquee__content px-6 text-xs sm:text-sm uppercase tracking-[0.35em] text-white/85"
                  aria-hidden="true"
                >
                  Prize Pool of Events: 5 Lakhs+ <span className="mx-6 text-white/30">•</span> Prize Pool of Events: 5 Lakhs+ <span className="mx-6 text-white/30">•</span> Prize Pool of Events: 5 Lakhs+
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/rulebooks/about-technika.pdf"
            download
            className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white hover:bg-white/20 transition text-sm"
          >
            Download Technical PDF
          </a>
          <a
            href="/rulebooks/cultural-events-2025-26.pdf"
            download
            className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white hover:bg-white/20 transition text-sm"
          >
            Download Cultural PDF
          </a>
          <button
            type="button"
            onClick={() => downloadOrComingSoon("")}
            className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white hover:bg-white/20 transition text-sm"
          >
            Download Fun PDF
          </button>
        </div>

        <div className="flex items-center justify-center">
        <div className="max-w-6xl w-full mt-12">
          <h1 className="text-white text-4xl font-bold mb-12 tracking-wide text-center">
            Events
          </h1>

          <div className="flex gap-10 flex-wrap justify-center mt-12 perspective-1000">
            {heroes.map((hero) => (
              <Motion.div
                key={hero.id}
                onClick={() => {
                  navigate(hero.route);
                }}
                initial={{ opacity: 0, y: 80, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0, duration: 0.1 }}
                whileHover={{
                  scale: 1,
                  y: -22,
                  rotateX: 10,
                  boxShadow:
                    "0 0 45px rgba(239,68,68,0.65)",
                }}
                onHoverStart={() => setActive(hero.id)}
                onHoverEnd={() => setActive(null)}
                className={`relative w-[240px] h-[380px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 transform-gpu ${
                  active === hero.id
                    ? "ring-4 ring-red-500/80 shadow-[0_0_40px_rgba(239,68,68,0.45)] scale-105"
                    : "opacity-85"
                }`}
              >
                <div className="absolute -inset-3 bg-red-800/10 blur-2xl rounded-3xl -z-10" />
                <img
                  src={hero.img}
                  alt={hero.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="absolute bottom-6 left-6">
                  <h2 className="text-white text-lg font-semibold tracking-wide">
                    {hero.name}
                  </h2>
                </div>
              </Motion.div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </>
  );
}