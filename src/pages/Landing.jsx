import React from "react";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { useEffect, useState } from "react"
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAuth } from "../context/auth.jsx";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

const Landing = ({ animate }) => {
  const { user } = useAuth();

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

  const [isMobile, setIsMobile] = useState(false);
  
    useEffect(() => {
        const checkMobile = () => {
          setIsMobile(window.innerWidth < 613);
        };
    
        checkMobile();
        window.addEventListener("resize", checkMobile);
    
        return () => {
          window.removeEventListener("resize", checkMobile);
        };
      }, []);

    const [isZoomed, setIsZoomed] = useState(false); // to track zoom state of the web page

    useEffect(() => {
      const checkZoom = () => {
        const zoom = window.devicePixelRatio;
    
        // isMobile = true (mobile), false (PC)
        setIsZoomed(zoom > 1.6 && !isMobile);
      };
    
      checkZoom();
      window.addEventListener("resize", checkZoom);
    
      return () => window.removeEventListener("resize", checkZoom);
    }, [isMobile]);

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
      <div className="absolute rounded-full bg-[rgb(255,0,30)] top-1/2 left-1/2 max-md:-translate-y-2/3
                -translate-x-1/2 -translate-y-1/2
                      shadow-[0_0_15.42px_rgb(255,0,30),0_0_80.84px_rgb(255,0,30),0_0_387.93px_rgba(255,0,30,0.7)]"
                      style={{width:"clamp(250px, 40vw, 500px)",
                              height:"clamp(250px, 40vw, 500px)",
        transform: isZoomed ? "scale(0.7)" : "scale(1)",
        transition: "transform 0.3s ease"
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

    {/* samurai photo */}
      <div
        className="absolute bottom-12 max-md:bottom-35 z-5 select-none left-1/2 -translate-x-1/2"
      >
        <img
          src="/images/samuraihero.png"
          alt="Mount Fuji with Pink Sun"
          className="mx-auto no-max-width"
          style={{ width: "clamp(300px, 55vw, 340px)",
        transform: isZoomed ? "scale(0.7)" : "scale(1)",
        transition: "transform 0.3s ease"
      
           }}
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
        className="parallax absolute inset-0 flex items-center justify-center"
        data-depth="0.60"
      >
        <div className="text-center flex flex-col jp-font -mt-50" style={{
        transform: isZoomed ? "scale(0.7)" : "scale(1)",
        transition: "transform 0.3s ease"
      }}>
          <div className="block  relative text-start text-[clamp(0.9rem,4vw,1.6rem)] -ml-10 max-md:-ml-3 tracking-[2px] z-10 select-none hover:opacity-100 hover:scale-105 transition-transform duration-250"><p>BIT Patna <span className="opacity-80 text-[clamp(0.7rem,3vw,1.2rem)] hover:opacity-100 transition-transform duration-250">presents</span></p></div>
          
          <h1 className="text-[clamp(3rem,11vw,9rem)] font-black text-white mb-4 max-md:mb-2 tracking-wider drop-shadow-lg">
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

        </div>

      </div>
      
      <div className=" parallax absolute tracking-[2px] jp-font top-1/2 max-[400px]:top-42/100 max-[1250px]:right-37 max-[400px]:mt-[9px] text-[clamp(0.7rem,3vw,1.2rem)] z-10 right-40 max-[400px]:right-10 max-[1000px]:right-32 max-[1150px]:top-47/100 max-[850px]:right-20 max-[850px]:top-45/100 max-[550px]:top-44/100 max-[550px]:right-15 select-none" style={{
        top: isZoomed ? "41.5%" : "",
        transition: "transform 0.3s ease"
      }} data-depth="17.7"><p className="opacity-80 hover:opacity-100 hover:scale-105 transition-transform duration-250" style={{
        transform: isZoomed ? "scale(0.7)" : "scale(1)"
      }}>16th-18th Jan. 2026</p></div>
      
      {/* REGISTER Button */}
      
      <div
  className={`parallax absolute center left-1/2 transform -translate-x-1/2 bottom-10 max-md:bottom-20
      flex ${isMobile ? "flex-col" : "flex-row"} items-center justify-center ${isMobile ? "gap-1" : "gap-4"} group z-10000`}
  data-depth="0.30"
>
  {/* REGISTER BUTTON */}
    <Link to={user ? "/merchandise" : "/login"}>
      {/* Mobile Button */}
      <div className="relative block md:hidden w-auto justify-center mb-3">
        <button className="mb-3 bg-[#ff001e] text-white text-[1.3rem] ks-font tracking-[1.2px] 
            font-semibold pt-2 pb-2 pl-4 pr-4 rounded-3xl cursor-pointer
            transition duration-200 transform
            hover:shadow-[0_0_30px_6px_rgba(255,0,30,0.5)]
            active:scale-90">
          {user ? "Merchandise" : "Register Now"}
        </button>
      </div>

      {/* Desktop Button */}
      <div className="parallax relative hidden md:flex justify-center w-auto">
        <button className="mb-3 bg-[#ff001e] text-white text-[1.3rem] ks-font tracking-[1.2px] 
            font-semibold pt-2 pb-2 pl-4 pr-4 rounded-3xl cursor-pointer
            transition duration-200 transform
            hover:shadow-[0_0_30px_6px_rgba(255,0,30,0.5)]
            active:scale-90">
          {user ? "Merchandise" : "Register Now"}
        </button>
      </div>
    </Link>

    {/* EXPLORE BUTTON */}
    <Link to="/events">
      {/* Mobile Button */}
      <div className="relative block md:hidden w-auto justify-center">
        <button className="mb-3 bg-[rgba(0,0,0,0)] border-white border-2 text-white text-[1.3rem] ks-font tracking-[1.2px] 
            font-semibold pt-2 pb-2 pl-4 pr-4 rounded-3xl cursor-pointer
            transition duration-200 transform
            hover:shadow-[0_0_30px_6px_rgba(255,255,255,0.5)]
            active:scale-90">
          Explore
        </button>
      </div>

      {/* Desktop Button */}
      <div className="parallax relative hidden md:flex justify-center w-auto">
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
