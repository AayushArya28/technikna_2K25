"use client";
import React, { useState, useEffect } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import "@splidejs/react-splide/css"; // or "@splidejs/react-splide/css/skyblue" if you prefer that theme

const ImageCarousel = () => {
  const imageClassName = "object-cover w-full h-40 sm:h-48 md:h-56 lg:h-64";
  const [photosOnScreen, setPhotosOnScreen] = useState(1);
  const [gapSize, setGapSize] = useState("0.8rem");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width <= 480) {
        setPhotosOnScreen(1);
        setGapSize("0.6rem");
      } else if (width <= 640) {
        setPhotosOnScreen(1);
        setGapSize("0.7rem");
      } else if (width <= 1024) {
        setPhotosOnScreen(2);
        setGapSize("0.8rem");
      } else {
        setPhotosOnScreen(3);
        setGapSize("1rem");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const slides = [
    "cultural",
    "dance",
    "dance2",
    "dj",
    "fashion",
    "paintball",
    "pitching",
    "img1",
    "singing",
    "tall-tower",
    "tech",
  ];

  return (
    <section className="w-full p-0">
      <Splide
        options={{
          type: "loop",
          gap: gapSize,
          drag: "free",
          focus: "center",
          height: "auto",
          arrows: false,
          pagination: false,
          perPage: photosOnScreen,
          lazyLoad: "nearby",
          autoScroll: {
            pauseOnHover: true,
            pauseOnFocus: false,
            rewind: true,
            speed: 1,
          },
        }}
        extensions={{ AutoScroll }}
        aria-label="Image Carousel"
      >
        {slides.map((name) => (
          <SplideSlide key={name}>
            <img
              src={`/slideshow/${name}.webp`}
              alt={name}
              className={imageClassName}
              style={{ padding: "0.4rem" }}
              loading="lazy"
            />
          </SplideSlide>
        ))}
      </Splide>
    </section>
  );
};

export default ImageCarousel;
