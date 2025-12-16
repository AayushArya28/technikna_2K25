import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Loading({ onFinish }) {
  const loaderRef = useRef(null);
  const diamondRef = useRef(null);
  const diamondWireRef = useRef(null);
  const squareRef = useRef(null);
  const scanSvgRef = useRef(null);
  const logoRef = useRef(null);
  const maskRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    gsap.to(diamondRef.current, {
      rotate: 360,
      duration: 10,
      repeat: -1,
      ease: "linear",
    });

    gsap.to(squareRef.current, {
      scale: 1.05,
      boxShadow: "0 0 60px rgba(255,0,0,0.7)",
      duration: 1.4,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    });

    gsap.to({}, {
      duration: 5,
      ease: "power2.inOut",
      onUpdate() {
        setProgress(Math.floor(this.progress() * 100));
      },
      onComplete() {
        exitLoader();
      },
    });
  }, []);

  const exitLoader = () => {
    const tl = gsap.timeline({ onComplete: onFinish });

    // Scanlines appear
    tl.to(scanSvgRef.current, {
      opacity: 1,
      duration: 0.25,
      ease: "power2.out",
    });

    tl.fromTo(
      scanSvgRef.current,
      { y: "-0.6%" },
      { y: "0.6%", duration: 0.6, ease: "power1.inOut" }
    );

    // Logo comes out
    tl.to(logoRef.current, {
      z: 160,
      scale: 1.5,
      duration: 0.6,
      ease: "power3.out",
    }, "-=0.3");

    // Logo rotation
    tl.to(logoRef.current, {
      rotateY: 300,
      rotateX: 10,
      duration: 0.9,
      ease: "power4.inOut",
    });

    // Wireframe diamond
    tl.to(diamondWireRef.current, {
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
    }, "-=0.6");

    // 🌑 MASK EXPANSION (key transition)
    tl.to(maskRef.current, {
      scale: 20,
      duration: 1.1,
      ease: "power4.inOut",
    }, "-=0.2");

    // Fade loader inside mask
    tl.to(loaderRef.current, {
      opacity: 0,
      duration: 0.2,
    }, "-=0.3");
  };

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-50 bg-black text-white overflow-hidden
                 [perspective:1200px]"
    >
      {/* Mask overlay */}
      <div className="absolute inset-0 z-[80] pointer-events-none flex items-center justify-center">
        <div
          ref={maskRef}
          className="w-24 h-24 rounded-full bg-red-600 scale-0"
        />
      </div>

      <div className="relative w-full h-full px-12 py-10">
        {/* Top Left */}
        <div className="absolute top-10 left-10 tracking-widest">
          <h1 className="text-red-600 text-sm mb-2">TECHNIKA 2k26</h1>
          <p className="text-xs text-gray-300 leading-relaxed">
            ENTER THE FEST <br />
            FORGED IN HONOR.
          </p>
        </div>

        {/* Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-56 h-56 flex items-center justify-center">
            <div
              ref={diamondRef}
              className="absolute w-56 h-56 rotate-45 bg-red-600/20 blur-[80px]"
            />

            <div
              ref={diamondWireRef}
              className="absolute w-64 h-64 rotate-45 border border-red-500/60
                         shadow-[0_0_28px_rgba(255,0,0,0.45)]
                         opacity-100"
            />

            <div
              ref={squareRef}
              className="relative w-36 h-36 bg-red-600 flex items-center justify-center"
            >
              <img
                ref={logoRef}
                src="/landscape.svg"
                alt="logo"
                className="w-16 h-16"
                style={{ transformStyle: "preserve-3d" }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Left */} 
        <div className="absolute bottom-10 left-10 text-xs tracking-wide text-gray-300"> 
        <p>INDIA : PATNA</p> <p>25°35′44″ N, 85°5′11″ E</p> 
        <p className="text-red-600 mt-1">&gt; BIT PATNA</p> 
        </div> 
        {/* Bottom Right */} 
        <div className="absolute bottom-6 right-6 text-red-600 font-light text-3xl sm:text-2xl md:text-4xl lg:text-5xl" style={{ lineHeight: 1.1, letterSpacing: "0.02em", userSelect: "none", }} > {progress}% </div> 
        {/* Loading Bar */} 
        <div className="absolute bottom-0 left-0 w-full h-1 bg-red-600"> <div className="h-full bg-red-600 transition-all duration-75" style={{ width: `${progress}%` }} /> </div>
      </div>
    </div>
  );
}