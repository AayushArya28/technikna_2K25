import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

const sliderData = [ 
  { 
    img: "./slides/slide1.png", 
    title: "1.Humanoid & Beyond : Workshop on Robotics, IoT & AI", 
    description: "Step into the future with Humanoid & Beyond: Workshop on Robotics, IoT & AI. This immersive workshop brings together innovation, creativity, and hands-on learning to explore how intelligent machines, connected devices, and artificial intelligence are shaping tomorrow's world. Dive into the fascinating world of humanoid robots, explore the limitless possibilities of IoT, and witness how AI is transforming the way we live, work, and create.", 
  },
  { 
    img: "./slides/slide2.png", 
    title: "2.ESP and ARDUINO (Collaboration with IIT Patna):",
    description: "Unleash your creativity with ESP & Arduino: Workshop on Embedded Systems and IoT. Designed for innovators, tinkerers, and tech enthusiasts, this workshop dives into the world of microcontrollers and IoT development. Participants will explore the powerful capabilities of Arduino and ESP boards, learning how to build interactive projects, connect devices to the internet, and bring ideas to life with hands-on experiments. From smart sensors to home automation, this workshop provides a practical gateway into embedded systems, making technology both accessible and exciting.",
   },
   { 
    img: "./slides/slide3.png",
    title: "3.Basic Trading Workshop:", 
    description: "Step into the world of finance with the Basic Trading Workshop—a beginner-friendly introduction to the art of trading. This workshop is designed to help participants understand market fundamentals, trading strategies, and the essentials of stocks, forex, and commodities. Through interactive sessions and practical insights, attendees will learn how to read charts, analyze trends, and make informed decisions in the dynamic world of financial markets. Whether you're completely new to trading or looking to sharpen your basics, this workshop equips you with the confidence to take your first step toward smart investing.", },
    { 
      img: "./slides/slide4.png", 
      title: "4.Photography workshop", 
      description: "Capture the world through a new lens with our Photography Workshop. This session is designed to help participants explore the art and science of photography, from mastering camera settings to understanding composition, lighting, and storytelling. With hands-on guidance and creative exercises, attendees will learn how to transform ordinary moments into powerful visual stories. Whether you're a beginner with a smartphone or an enthusiast with a DSLR, this workshop will sharpen your skills and inspire your photographic journey.", 
    }, 
  ];

export function Workshop() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [manualClick, setManualClick] = useState(false);
  const autoSlideRef = useRef(null);
  const titleRefs = useRef([]);
  const descRefs = useRef([]);
  const thumbnailRefs = useRef([]);

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % sliderData.length);
  const prevSlide = () =>
    setActiveIndex((prev) => (prev - 1 + sliderData.length) % sliderData.length);

  const goToSlide = (index) => {
    setManualClick(true);
    setActiveIndex(index);
  };

  useEffect(() => {
    autoSlideRef.current = setInterval(nextSlide, 50000);
    return () => clearInterval(autoSlideRef.current);
  }, []);

  useEffect(() => {
    const titleEl = titleRefs.current[activeIndex];
    const descEl = descRefs.current[activeIndex];

    if (descEl) {
      gsap.set(descEl.querySelectorAll("span"), { opacity: 0, y: 20 });
    }

    if (titleEl) {
      const letters = titleEl.querySelectorAll("span");
      gsap.fromTo(
        letters,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: "power3.out",
          onComplete: () => {
            if (descEl) {
              const words = descEl.querySelectorAll("span");
              gsap.to(words, {
                y: 0,
                opacity: 1,
                duration: 0.5,
                stagger: 0.03,
                ease: "power3.out",
              });
            }
          },
        }
      );
    }

    if (!manualClick) {
      const activeThumb = thumbnailRefs.current[activeIndex];
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: "smooth",
          inline: "start",
          block: "nearest",
        });
      }
    } else {
      setManualClick(false);
    }
  }, [activeIndex, manualClick]);

  const splitLetters = (text) =>
    text.split("").map((char, i) => (
      <span key={i} className="inline-block">
        {char === " " ? "\u00A0" : char}
      </span>
    ));

  const splitWords = (text) =>
    text.split(" ").map((word, i) => (
      <span key={i} className="inline-block mr-1">
        {word}
      </span>
    ));

  return (
    <div
      className="mt-25 relative h-screen w-full font-sans bg-black text-gray-200 overflow-hidden"
    >
      {/* Slides */}
      <div className="absolute inset-0">
        {sliderData.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div className="flex flex-col md:flex-row w-full h-full">
              {/* Image Half */}
              <div className="w-full md:w-1/2 h-1/2 md:h-full relative">
                <img
                  src={slide.img}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-transparent to-black/30"></div>

                {/* Thumbnails */}
                <div className="absolute bottom-5 sm:bottom-8 left-0 right-0 z-30 flex gap-2 px-5 sm:px-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory justify-start">
                  {sliderData.map((thumb, idx) => (
                    <div
                      key={idx}
                      ref={(el) => (thumbnailRefs.current[idx] = el)}
                      onClick={() => goToSlide(idx)}
                      className={`relative flex-shrink-0 snap-start w-[140px] sm:w-[200px] h-[200px] sm:h-[130px] rounded-lg overflow-hidden cursor-pointer transition duration-500 ${
                        idx === activeIndex
                          ? "brightness-150 ring-2 ring-white"
                          : "brightness-50 hover:brightness-75"
                      }`}
                    >
                      <img
                        src={thumb.img}
                        alt={thumb.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1 left-1 text-white text-xs font-semibold bg-black/80 px-1">
                        {thumb.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Text Half */}
              <div className="w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center px-3 sm:px-9 lg:px-20 bg-black">
                <div className="max-w-xl space-y-4">
                  <h2
                    ref={(el) => (titleRefs.current[index] = el)}
                    className="text-2xl sm:text-2xl md:text-2xl lg:text-4xl font-bold leading-tight tracking-tight"
                  >
                    {splitLetters(slide.title)}
                  </h2>
                  <p
                    ref={(el) => (descRefs.current[index] = el)}
                    className="text-sm sm:text-base md:text-lg lg:text-lg text-gray-300 leading-relaxed max-w-prose"
                  >
                    {splitWords(slide.description)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Arrows */}
      <div className="hidden md:flex fixed top-1/2 right-5 sm:right-12 z-[9999] flex-col gap-4 -translate-y-1/2">
        <button
          onClick={prevSlide}
          className="bg-white/40 hover:bg-white active:bg-white text-black w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-xl transition-all active:scale-90"
        >
          &lt;
        </button>
        <button
          onClick={nextSlide}
          className="bg-white/40 hover:bg-white active:bg-white text-black w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-xl transition-all active:scale-90"
        >
          &gt;
        </button>
      </div>

      {/* 📱 Mobile Arrows */}
      <div className="md:hidden absolute inset-y-1/2 left-0 right-0 flex justify-between px-4 z-[9999] -translate-y-1/2">
        <button
          onClick={prevSlide}
          className="bg-white/40 hover:bg-white text-black w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-md active:scale-90 transition"
        >
          &lt;
        </button>
        <button
          onClick={nextSlide}
          className="bg-white/40 hover:bg-white text-black w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-md active:scale-90 transition"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
