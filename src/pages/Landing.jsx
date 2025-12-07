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
      </div>

      {/* Background Mountain Image */}
      {/* <div
        className="parallax absolute inset-0 z-0"
        data-depth="0.10"
        data-scale="1.2"
      >
        <img
          src="/images/mountain-with-sun.png"
          alt="Mount Fuji with Pink Sun"
          className="h-full w-full object-cover"
        />
      </div> */}

      {/* Soft red background glow */}
      <div className="absolute rounded-full bg-[rgb(255,0,30)] top-1/2 left-1/2 
                -translate-x-1/2 -translate-y-1/2
                      shadow-[0_0_15.42px_rgb(255,0,30),0_0_80.84px_rgb(255,0,30),0_0_387.93px_rgba(255,0,30,0.7)]"
                      style={{width:"clamp(250px, 40vw, 500px)",
                              height:"clamp(250px, 40vw, 500px)"
                      }}>
      </div>

      {/* Background Image */}
      <div
        className="parallax absolute bottom-0 z-0 select-none"
        data-depth="0.10"
        data-scale="1.2"
      >
        <img
          src="/images/mainbg.png"
          alt="Mount Fuji with Pink Sun"
          className="h-full w-full object-cover"
        />
      </div>

    {/* Mount Fuji with Pink Sun - Bottom Center */}
      <div
        className="absolute bottom-12 z-99 select-none left-1/2 -translate-x-1/2"
      >
        <img
          src="/images/samuraihero.png"
          alt="Mount Fuji with Pink Sun"
          className="mx-auto no-max-width"
          style={{ width: "clamp(380px, 55vw, 440px)" }}
        />
      </div>

      {/* Samurai Warrior - Bottom Left Corner */}
      {/* <div
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
      </div> */}

      {/* Japanese Castle - Bottom Right Corner */}
      {/* <div
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
      </div> */}

      {/* Ground/Floor Image */}
      {/* <div
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
      </div> */}

      {/* Main Title - Centered */}
      <div
        className="parallax absolute inset-0 z-30 flex items-center justify-center"
        data-depth="0.60"
      >
        <div className="text-center jp-font -mt-50">
          <h1 className="text-[clamp(3rem,11vw,9rem)] font-black text-white mb-4 tracking-wider drop-shadow-lg">
            <span
              id="heroText"
              className=" inline-block  md:tracking-[20px] sm:tracking-[10px] transform hover:scale-105 transition-transform duration-300 text-center select-none"
            >
              TECHNIKA
            </span>
          </h1>
          {/* <h2 className="text-3xl  md:text-6xl font-black text-white tracking-widest drop-shadow-lg">
            <span className="inline-block transform hover:scale-105 transition-transform duration-300">
              2026
            </span>
          </h2> */}
          {/* REGISTER Button */}

        </div>

      </div>
      <div
        className="parallax absolute  left-1/2 -translate-x-1/2 bottom-10
             flex items-center justify-center group z-10000"
        data-depth="0.30"
      >
        <Link to="/login">

          {/* Mobile Button */}
          <div className="relative block md:hidden w-auto  justify-center mr-2">
            <button className="mb-3 bg-[#ff001e] text-white text-[1.3rem] ks-font tracking-[1.2px] 
        font-semibold pt-2 pb-2 pl-4 pr-4 rounded-3xl cursor-pointer
        transition duration-200 transform
        hover:shadow-[0_0_30px_6px_rgba(255,0,30,0.5)]
        active:scale-90">
              Register Now
            </button>
          </div>

          {/* Desktop Button */}
          <div className="parallax relative hidden md:flex justify-center w-auto mr-3">
            <button className="mb-3 bg-[#ff001e] text-white text-[1.3rem] ks-font tracking-[1.2px] 
        font-semibold pt-2 pb-2 pl-4 pr-4 rounded-3xl cursor-pointer
        transition duration-200 transform
        hover:shadow-[0_0_30px_6px_rgba(255,0,30,0.5)]
        active:scale-90">
              Register Now
            </button>
          </div>

        </Link>

        <Link to="/events">

          {/* Mobile Button */}
          <div className="relative block md:hidden w-auto  justify-center ml-2">
            <button className="mb-3 bg-[rgba(0,0,0,0)] border-white border-2 text-white text-[1.3rem] ks-font tracking-[1.2px] 
        font-semibold pt-2 pb-2 pl-4 pr-4 rounded-3xl cursor-pointer
        transition duration-200 transform
        hover:shadow-[0_0_30px_6px_rgba(255,255,255,0.5)]
        active:scale-90">
              Explore
            </button>
          </div>

          {/* Desktop Button */}
          <div className="parallax relative hidden md:flex justify-center w-auto ml-3">
            <button className="mb-3 bg-[rgba(0,0,0,0)] border-white border-2 text-white text-[1.3rem] ks-font tracking-[1.2px] 
        font-semibold pt-2 pb-2 pl-4 pr-4 rounded-3xl cursor-pointer
        transition duration-200 transform
        hover:shadow-[0_0_30px_6px_rgba(255,255,255,0.5)]
        active:scale-90">
              Explore
            </button>
          </div>

        </Link>
      </div>

      {/* Floating Animation Effects */}
      {/* <div
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
      </div> */}
    </div>
  );
};

export default Landing;
