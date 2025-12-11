// Previous Events page retained for reference.
/*
import React from "react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const [active, setActive] = useState(1);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-6xl w-full mt-10">
        <h1 className="text-white text-4xl font-bold mb-12 tracking-wide text-center">
          Events
        </h1>

        <div className="flex gap-10 flex-wrap justify-center mt-12 perspective-1000">
          {heroes.map((hero, index) => (
            <motion.div
              key={hero.id}
              onClick={() => {
                setActive(hero.id);

                if (hero.route) {
                  navigate(hero.route);
                }
              }}
              initial={{ opacity: 0, y: 80, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0, duration: 0.1 }}
              whileHover={{
                scale: 1,
                y: -22,
                rotateX: 6,
                boxShadow:
                  active === hero.id
                    ? "ring-4 ring-red-500 shadow-[0_0_50px_rgba(239,68,68,0.85)]"
                    : "opacity-60 blur-[0.3px]",
              }}
              className={`relative w-[240px] h-[380px] rounded-2xl overflow-hidden cursor-pointer 
              transition-all duration-300 transform-gpu
              ${
                active === hero.id
                  ? "ring-4 ring-red-500 shadow-[0_0_50px_rgba(239,68,68,0.85)]"
                  : "opacity-60 blur-[0.3px]"
              }`}
              style={{
                boxShadow:
                  active === hero.id
                    ? "0 0 50px rgba(239,68,68,0.9)"
                    : "0 12px 25px rgba(0,0,0,0.7)",
              }}
            >
              <div className="absolute -inset-3 bg-red-800/10 blur-2xl rounded-3xl -z-10" />
              <img
                src={hero.img}
                alt={hero.name}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              <div className="absolute bottom-6 left-6">
                <h2 className="text-white text-lg font-semibold tracking-wide">
                  {hero.name}
                </h2>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
*/

import React from "react";

// Temporary Coming Soon placeholder matching Merchandise page style.
export function Events() {
  return (
    <div className="pt-25 min-h-screen flex items-center justify-center bg-black">
      <img
        src="/images/coming-soon.jpg"
        alt="Coming Soon"
        className="max-w-xs sm:max-w-sm md:max-w-md opacity-90"
      />
    </div>
  );
}
