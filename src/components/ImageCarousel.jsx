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
    "https://i.ibb.co/b5VLFW8L/dgdgdg.jpg",
"https://i.ibb.co/tpqSYHX6/fgdfhfhnfchnff.jpg",
"https://i.ibb.co/M5hxpY6d/gvhyfgjfctgjfcgv.jpg",
"https://i.ibb.co/LhJFP0Kh/qwertyui.jpg",
"https://i.ibb.co/jkVLyRRM/sv-zsvzsvzv.jpg",
"https://i.ibb.co/7NkDBPRg/Whats-App-Image-2025-12-12-at-3-37-55-PM.jpg",
"https://i.ibb.co/27YRhFjY/Whats-App-Image-2025-12-12-at-3-37-56-PM.jpg",
"https://i.ibb.co/My68Scyb/Whats-App-Image-2025-12-12-at-3-37-57-PM.jpg",
"https://i.ibb.co/Xfvgnnvy/Whats-App-Image-2025-12-12-at-3-37-58-PMvdsf.jpg"
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
        {slides.map((src, index) => (
          <SplideSlide key={src}>
            <img
              src={src}
              alt={`Technika memory ${index + 1}`}
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
