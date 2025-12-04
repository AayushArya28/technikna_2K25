import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

const sections = [
  {
    id: "consultation",
    title: "Consultation",
    content: (
      <>
        <h2 className="text-3xl font-bold mb-4">Consultation</h2>
        <p className="text-gray-300 leading-relaxed">
          We start by understanding your product, audience, and goals.
          Our consultation ensures a clear roadmap before any design phase begins.
        </p>
      </>
    ),
  },
  {
    id: "ux-strategy",
    title: "UX Strategy",
    content: (
      <>
        <h2 className="text-3xl font-bold mb-4">UX Strategy</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          To take your product in the right direction, we'll help match your
          business goals with UX priorities.
        </p>
        <h3 className="font-semibold text-lg mb-2">Here is how we can do it:</h3>
        <ul className="list-disc ml-6 space-y-1 text-gray-300">
          <li>Discovery phases</li>
          <li>UX roadmap</li>
          <li>Stakeholder engagement</li>
          <li>Competitor analysis</li>
        </ul>
      </>
    ),
  },
  {
    id: "user-research",
    title: "User Research",
    content: (
      <>
        <h2 className="text-3xl font-bold mb-4">User Research</h2>
        <p className="text-gray-300 leading-relaxed">
          We conduct research to understand user behavior, motivations, and needs.
          These insights inform design decisions at every level.
        </p>
      </>
    ),
  },
  {
    id: "ui-design",
    title: "UI Design",
    content: (
      <>
        <h2 className="text-3xl font-bold mb-4">UI Design</h2>
        <p className="text-gray-300 leading-relaxed">
          Creating visually engaging, accessible interfaces that enhance usability
          and brand consistency.
        </p>
      </>
    ),
  },
  {
    id: "development",
    title: "Development",
    content: (
      <>
        <h2 className="text-3xl font-bold mb-4">Development</h2>
        <p className="text-gray-300 leading-relaxed">
          From prototype to production, our developers build responsive,
          high-performance solutions.
        </p>
      </>
    ),
  },
];

/*
export default function Merchandise() {
  const [active, setActive] = useState("ux-strategy");
  const contentRef = useRef(null);
  const headingRef = useRef(null);
  const buttonsRef = useRef([]);
  const containerRef = useRef(null);

  // Animate heading on mount
  useEffect(() => {
    gsap.fromTo(
      headingRef.current,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );

    // Animate container on mount
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.8, delay: 0.3, ease: "power2.out" }
    );

    // Stagger animate buttons on mount
    gsap.fromTo(
      buttonsRef.current,
      { x: 50, opacity: 0 },
      { x: 0, opacity: 1, stagger: 0.1, duration: 0.6, delay: 0.5, ease: "power2.out" }
    );
  }, []);

  // Animate left content when switching with smooth transition
  useEffect(() => {
    if (contentRef.current) {
      // Fade out first
      gsap.to(contentRef.current, {
        opacity: 0,
        x: -20,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          // Then fade in with new content
          gsap.fromTo(
            contentRef.current,
            { opacity: 0, x: 20 },
            { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
          );
          
          gsap.fromTo(
            contentRef.current.children,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: "power2.out", delay: 0.1 }
          );
        }
      });
    }
  }, [active]);

  // Button hover animations
  const handleButtonHover = (index, isHovering) => {
    const button = buttonsRef.current[index];
    if (!button) return;

    if (isHovering) {
      gsap.to(button, {
        scale: 1.03,
        x: 5,
        duration: 0.3,
        ease: "power2.out"
      });
    } else {
      gsap.to(button, {
        scale: 1,
        x: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  // Button click animation
  const handleButtonClick = (sectionId, index) => {
    const button = buttonsRef.current[index];
    
    gsap.to(button, {
      scale: 0.95,
      duration: 0.1,
      ease: "power2.in",
      onComplete: () => {
        gsap.to(button, {
          scale: 1.03,
          duration: 0.2,
          ease: "power2.out"
        });
      }
    });
    
    setActive(sectionId);
  };

  return null;
}
*/

export default function Merchandise() {
  return (
    <div className="pt-25 min-h-screen flex items-center justify-center bg-black">
      <img src="/images/coming-soon.jpg" alt="Coming Soon" className="max-w-xs sm:max-w-sm md:max-w-md opacity-90" />
    </div>
  );
}
