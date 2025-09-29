import React from "react";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, SplitText);

const Home = () => {
  useGSAP(() => {
    const heroText = new SplitText("#heroText", { type: "chars" });
    const heroTextTimeline = gsap.timeline({ delay: 0.5 });

    const firstLetter = heroText.chars[0];
    const otherLetters = heroText.chars.slice(1);

    gsap.set(heroText.chars, { display: "inline-block" });

    const bounds = firstLetter.getBoundingClientRect();
    const xOffset = window.innerWidth / 2 - (bounds.left + bounds.width / 2);

    gsap.set(firstLetter, { x: xOffset, scale: 100 });

    heroTextTimeline.to(firstLetter, {
      scale: 1,
      duration: 2,
      ease: "power4.out",
    });

    heroTextTimeline.to(firstLetter, {
      x: 0,
      duration: 1,
    });

    heroTextTimeline.fromTo(
      otherLetters,
      { x: 50, autoAlpha: 0 },
      {
        x: 0,
        autoAlpha: 1,
        duration: 1.5,
        stagger: 0.2,
        ease: "power3.out",
      },
      "-=0.75"
    );
  });

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Mountain Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/mountain-with-sun.png"
          alt="Mount Fuji with Pink Sun"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Social Media Icons */}
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2 z-40 flex flex-col space-y-4">
        <Facebook className="w-6 h-6 text-gray-700 hover:text-blue-600 cursor-pointer transition-colors" />
        <Twitter className="w-6 h-6 text-gray-700 hover:text-blue-400 cursor-pointer transition-colors" />
        <a
          href="https://www.instagram.com/technika_bitp/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Instagram className="w-6 h-6 text-gray-700 hover:text-pink-600 cursor-pointer transition-colors" />
        </a>
        <Youtube className="w-6 h-6 text-gray-700 hover:text-red-600 cursor-pointer transition-colors" />
      </div>

      {/* Samurai Warrior - Bottom Left Corner */}
      <div className="absolute bottom-0 left-0 z-20">
        <img
          src="/images/samurai.png"
          alt="Samurai Warrior"
          className="h-96 w-auto object-contain"
          style={{
            filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.2))",
          }}
        />
      </div>

      {/* Japanese Castle - Bottom Right Corner */}
      <div className="absolute bottom-0 right-0 z-20">
        <img
          src="/images/castle.png"
          alt="Japanese Castle"
          className="h-80 w-auto object-contain"
          style={{
            filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.15))",
          }}
        />
      </div>

      {/* Main Title - Centered */}
      <div className="absolute inset-0 z-30 flex items-center justify-center">
        <div className="text-center jp-font">
          <h1 className="text-8xl font-black text-black mb-4 tracking-wider drop-shadow-lg">
            <span
              id="heroText"
              className="inline-block transform hover:scale-105 transition-transform duration-300 text-center"
            >
              TECHNIKA
            </span>
          </h1>
          <h2 className="text-6xl font-black text-black tracking-widest drop-shadow-lg">
            <span className="inline-block transform hover:scale-105 transition-transform duration-300">
              2K25
            </span>
          </h2>
        </div>
      </div>

      {/* Floating Animation Effects */}
      <div className="absolute inset-0 pointer-events-none z-25">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-pink-400 rounded-full animate-pulse opacity-40"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
