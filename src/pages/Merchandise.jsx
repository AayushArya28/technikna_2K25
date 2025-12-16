import React from "react";
import BrowserWarningModal from "../components/BrowserWarningModal.jsx";

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
    <>
      <BrowserWarningModal />
      <div className="pt-25 min-h-screen flex items-center justify-center bg-black">
        <img src="/images/coming-soon.jpg" alt="Coming Soon" className="max-w-xs sm:max-w-sm md:max-w-md opacity-90" />
      </div>
    </>
  );
}
