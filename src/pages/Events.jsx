import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const eventCategories = {
  Technical: [
    {
      id: 1,
      title: "Hackathon",
      description:
        "Join our 24-hour coding challenge with exciting problem statements.",
      image: "/slides/slide3.png",
    },
    {
      id: 2,
      title: "Robotics Challenge",
      description:
        "Showcase your robotics skills and compete with others in an exciting contest.",
      image: "/slides/slide2.png",
    },
  ],
  "Fun Events": [
    {
      id: 3,
      title: "Treasure Hunt",
      description: "Find hidden clues across campus and win exciting prizes!",
      image: "/slides/slide1.png",
    },
    {
      id: 4,
      title: "Gaming Tournament",
      description: "Compete in your favorite games and showcase your skills.",
      image: "/slides/slide2.png",
    },
  ],
  Others: [
    {
      id: 5,
      title: "Cultural Night",
      description: "Music, dance, and cultural performances from students.",
      image: "/slides/slide3.png",
    },
  ],
};

export function Events() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const titleRef = useRef(null);
  const categoryRefs = useRef([]);
  const modalRef = useRef(null);
  const modalOverlayRef = useRef(null);

  // Title animation on mount
  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  }, []);

  // Category sections animation with ScrollTrigger
  useEffect(() => {
    categoryRefs.current.forEach((section, index) => {
      if (section) {
        const heading = section.querySelector(".category-heading");
        const cards = section.querySelectorAll(".event-card");

        // Animate heading
        gsap.fromTo(
          heading,
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: heading,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );

        // Stagger animate cards
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    });
  }, []);

  // Modal animation
  useEffect(() => {
    if (selectedEvent) {
      // Animate overlay
      gsap.fromTo(
        modalOverlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );

      // Animate modal with scale and rotation
      gsap.fromTo(
        modalRef.current,
        { scale: 0.7, opacity: 0, rotationY: -15 },
        {
          scale: 1,
          opacity: 1,
          rotationY: 0,
          duration: 0.5,
          ease: "back.out(1.4)",
        }
      );
    }
  }, [selectedEvent]);

  const handleCloseModal = () => {
    gsap.to(modalRef.current, {
      scale: 0.7,
      opacity: 0,
      rotationY: 15,
      duration: 0.3,
      ease: "power2.in",
    });
    gsap.to(modalOverlayRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => setSelectedEvent(null),
    });
  };

  const handleCardClick = (event, cardElement) => {
    // Pulse animation before opening modal
    gsap.to(cardElement, {
      scale: 1.05,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
      onComplete: () => setSelectedEvent(event),
    });
  };

  return (
    <div
      className="mt-25 min-h-screen p-10 overflow-x-hidden"
      style={{
        backgroundImage: "url('/images/event-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        width: "100vw",
        maxWidth: "100%", // Prevent horizontal scroll
      }}
    >
      <h1 ref={titleRef} className="text-3xl font-bold text-center mb-8">
        Technika Events
      </h1>

      {/* Loop through categories */}
      {Object.entries(eventCategories).map(([category, events], catIndex) => (
        <div
          key={category}
          ref={(el) => (categoryRefs.current[catIndex] = el)}
          className="mb-12"
        >
          <h2 className="category-heading text-2xl font-semibold mb-6">
            {category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="event-card bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
                onClick={(e) => handleCardClick(event, e.currentTarget)}
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, {
                    y: -10,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
                    scale: 1.05, // GSAP scale animation on hover
                    duration: 0.3,
                    ease: "power2.out",
                  });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, {
                    y: 0,
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    scale: 1, // Return to original scale
                    duration: 0.3,
                    ease: "power2.out",
                  });
                }}
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{event.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Modal */}
      {selectedEvent && (
        <div
          ref={modalOverlayRef}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            ref={modalRef}
            className="bg-white w-11/12 md:w-2/3 lg:w-1/2 rounded-lg shadow-lg flex relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left side - Image */}
            <div className="w-1/2 hidden md:block">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full h-full object-cover rounded-l-lg"
              />
            </div>

            {/* Right side - Info */}
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  {selectedEvent.title}
                </h2>
                <p className="text-gray-600 mb-6">
                  {selectedEvent.description}
                </p>
              </div>

              <button
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, {
                    scale: 1.05,
                    duration: 0.2,
                  });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, {
                    scale: 1,
                    duration: 0.2,
                  });
                }}
              >
                Register
              </button>
            </div>

            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
              onClick={handleCloseModal}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  rotation: 90,
                  scale: 1.2,
                  duration: 0.3,
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  rotation: 0,
                  scale: 1,
                  duration: 0.3,
                });
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
