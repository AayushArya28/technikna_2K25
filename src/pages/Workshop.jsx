import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

const sliderData = [
  {
    img: "./slides/slide1.png",
    title: "Workshop 01",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, neque? Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, ex.",
  },
  {
    img: "./slides/slide2.png",
    title: "Workshop 02",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, neque? Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, ex.",
  },
  {
    img: "./slides/slide3.png",
    title: "Workshop 03",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, neque? Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, ex.",
  },
  {
    img: "./slides/slide4.png",
    title: "Workshop 04",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, neque? Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, ex.",
  },
  {
    img: "./slides/slide5.png",
    title: "Workshop 05",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, neque? Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, ex.",
  },
];

export function Workshop() {
  const [activeIndex, setActiveIndex] = useState(0);
  const autoSlideRef = useRef(null);
  const titleRefs = useRef([]);
  const descRefs = useRef([]);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % sliderData.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + sliderData.length) % sliderData.length);
  };

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  // Auto-slide always active
  useEffect(() => {
    autoSlideRef.current = setInterval(nextSlide, 5000);
    return () => {
      clearInterval(autoSlideRef.current);
    };
  }, []);

  // Animate text on slide change
  useEffect(() => {
    // Title letters animation
    const letters = titleRefs.current[activeIndex]?.querySelectorAll("span");
    if (letters) {
      gsap.fromTo(
        letters,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: "power3.out",
        }
      );
    }

    // Description words animation
    const words = descRefs.current[activeIndex]?.querySelectorAll("span");
    if (words) {
      gsap.fromTo(
        words,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.03,
          delay: 0.3,
          ease: "power3.out",
        }
      );
    }
  }, [activeIndex]);

  const splitLetters = (text) =>
    text.split("").map((char, i) => (
      <span key={i} className="inline-block">
        {char}
      </span>
    ));

  const splitWords = (text) =>
    text.split(" ").map((word, i) => (
      <span key={i} className="inline-block mr-1">
        {word}
      </span>
    ));

  return (
    <div className="relative h-screen w-full font-sans bg-black text-gray-200 overflow-hidden">
      {/* Slider Items */}
      <div className="absolute inset-0">
        {sliderData.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === activeIndex ? "opacity-100 z-10" : "opacity-0"
            }`}
          >
            <img
              src={slide.img}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div
              className="absolute left-5 sm:left-10 top-1/4 sm:top-1/5 w-[90%] sm:w-[500px] z-20"
            >
              <h2
                ref={(el) => (titleRefs.current[index] = el)}
                className="text-4xl sm:text-[40px] md:text-[60px] font-bold leading-tight"
              >
                {splitLetters(slide.title)}
              </h2>
              <p
                ref={(el) => (descRefs.current[index] = el)}
                className="mt-4 text-sm sm:text-base md:text-lg"
              >
                {splitWords(slide.description)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Arrow Buttons */}
      <div className="absolute top-1/3 right-5 sm:right-12 z-30 flex flex-col gap-2">
        <button
          onClick={prevSlide}
          className="bg-white/20 hover:bg-white text-white hover:text-black w-10 h-10 rounded-md text-xl transition"
        >
          &lt;
        </button>
        <button
          onClick={nextSlide}
          className="bg-white/20 hover:bg-white text-white hover:text-black w-10 h-10 rounded-md text-xl transition"
        >
          &gt;
        </button>
      </div>

      {/* Thumbnails */}
      <div className="absolute bottom-5 sm:bottom-12 z-30 flex gap-2 w-full px-5 sm:px-12 overflow-x-auto scrollbar-hide">
        {sliderData.map((slide, index) => (
          <div
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative flex-shrink-0 w-[120px] sm:w-[150px] h-[180px] sm:h-[220px] transition duration-500 rounded-lg overflow-hidden cursor-pointer ${
              index === activeIndex ? "brightness-150" : "brightness-50"
            }`}
          >
            <img
              src={slide.img}
              alt={slide.title}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute bottom-2 left-2 text-white text-xs sm:text-sm">
              {slide.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
