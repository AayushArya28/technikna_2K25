import React from "react";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

const Landing = ({ animate }) => {
  useGSAP(() => {
    if (animate) {
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
    }

    // Parallax Effect
    const hero = document.getElementById("hero");
    const layers = gsap.utils.toArray(".parallax");

    const totalVH = 1;
    const totalScroll = window.innerHeight * totalVH;

    const zoomFraction = 0.3;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: () => "+=" + totalScroll,
        scrub: true,
        pin: true,
        anticipatePin: 1,
      },
    });

    layers.forEach((layer) => {
      const scale = parseFloat(layer.dataset.scale) || 1;
      const depth = parseFloat(layer.dataset.depth) || 0;
      const movement = -(layer.offsetHeight * depth);

      tl.to(layer, { scale, ease: "none", duration: zoomFraction }, 0);

      tl.to(
        layer,
        { y: movement, ease: "none", duration: 1 - zoomFraction },
        zoomFraction
      );
    });

    // ensure positions are correct
    ScrollTrigger.refresh();
  });

  return (
    <div id="hero" className="relative min-h-screen overflow-hidden">
      {/* Social Media Icons */}
      <div
        data-depth="0.80"
        className="parallax absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-40 flex flex-col space-y-4"
      >
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

      {/* Background Mountain Image */}
      <div
        className="parallax absolute inset-0 z-0"
        data-depth="0.10"
        data-scale="1.2"
      >
        <img
          src="/images/mountain-with-sun.png"
          alt="Mount Fuji with Pink Sun"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Samurai Warrior - Bottom Left Corner */}
      <div
        className="parallax absolute bottom-[-5rem] md:bottom-0 left-[-10rem] md:left-0 z-20"
        data-depth="0.17"
        data-scale="1.17"
      >
        <img
          src="/images/samurai.png"
          alt="Samurai Warrior"
          className="h-96 w-auto object-contain scale-[0.7] md:scale-100"
          style={{
            filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.2))",
          }}
        />
      </div>

      {/* Japanese Castle - Bottom Right Corner */}
      <div
        className="parallax absolute bottom-[-10rem] md:bottom-[-5rem] right-[-14rem] z-20"
        data-depth="0.20"
        data-scale="1.12"
      >
        <img
          src="/images/castle.png"
          alt="Japanese Castle"
          className="h-[32rem] w-auto object-contain scale-[0.8] md:scale-100"
          style={{
            filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.15))",
          }}
        />
      </div>

      {/* Ground/Floor Image */}
      <div
        className="parallax absolute bottom-0 right-0 z-30 opacity-90"
        data-depth="0"
      >
        <img
          src="/images/floor.png"
          alt="Ground"
          className="w-full h-48 object-cover"
          style={{
            filter: "drop-shadow(0 -5px 15px rgba(0,0,0,0.1))",
          }}
        />
      </div>

      {/* Main Title - Centered */}
      <div
        className="parallax absolute inset-0 z-30 flex items-center justify-center"
        data-depth="0.60"
      >
        <div className="text-center jp-font">
          <h1 className="text-5xl md:text-8xl font-black text-black mb-4 tracking-wider drop-shadow-lg">
            <span
              id="heroText"
              className="inline-block transform hover:scale-105 transition-transform duration-300 text-center"
            >
              TECHNIKA
            </span>
          </h1>
          <h2 className="text-3xl md:text-6xl font-black text-black tracking-widest drop-shadow-lg">
            <span className="inline-block transform hover:scale-105 transition-transform duration-300">
              2025
            </span>
          </h2>
          {/* REGISTER Button */}
          <div
            className="parallax absolute bottom-7 right-6 flex items-center justify-center group"
            data-depth="0.30"
          >
            <Link to="/login">
              {/* Mobile Image */}
              <div className="relative block md:hidden w-56">
                <img
                  src="https://www.bits-oasis.org/svgs/landing/mobileRegisterBtn.svg"
                  alt="Register"
                  className="w-full transition duration-300 group-hover:brightness-75"
                />
                <span className="absolute inset-0 flex items-center justify-center text-yellow-400 font-bold text-lg pointer-events-none">
                  REGISTER
                </span>
              </div>

              {/* Desktop Image */}
              <div className="parallax relative hidden md:block w-96">
                <img
                  src="https://www.bits-oasis.org/svgs/landing/registerBtn.svg"
                  alt="Register"
                  className="w-full transition duration-300 group-hover:brightness-75"
                />
                <span className="mb-3 absolute inset-0 flex items-center justify-center text-white font-bold text-4xl pointer-events-none">
                  REGISTER
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Animation Effects */}
      <div
        className="parallax absolute inset-0 pointer-events-none z-25"
        data-depth="0.85"
      >
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

export default Landing;
