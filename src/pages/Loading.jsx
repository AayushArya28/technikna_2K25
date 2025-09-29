import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./Loading.css";

function Loading({ onFinish }) {
  const svgContainerRef = useRef(null);
  const loadingBarRef = useRef(null);
  const enterBtnRef = useRef(null);
  const splashSvgRef = useRef(null);

  useEffect(() => {
    fetch("/public/landscape.svg")
      .then(res => res.text())
      .then(svgText => {
        if (svgContainerRef.current) {
          svgContainerRef.current.innerHTML = svgText;

          const paths = svgContainerRef.current.querySelectorAll("path");

          paths.forEach(path => {
            const length = path.getTotalLength();
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            path.style.stroke = "#000";
            path.style.strokeWidth = "2";
            path.style.fill = "none";
          });

          const tl = gsap.timeline({
            onComplete: () => {
              if (enterBtnRef.current) {
                gsap.to(enterBtnRef.current, { opacity: 1, display: "block", duration: 0.5 });
              }
            },
          });

          tl.to(paths, {
            strokeDashoffset: 0,
            duration: 2,
            stagger: 0.001,
            ease: "power1.inOut",
            onUpdate: () => {
              if (loadingBarRef.current) {
                const progress = tl.progress() * 100;
                loadingBarRef.current.style.width = progress + "%";
              }
            },
          });
        }
      });
  }, []);

  const handleEnterClick = () => {
    const enterBtn = enterBtnRef.current;
    const circles = splashSvgRef.current.querySelectorAll("circle");

    if (!enterBtn || circles.length === 0) return;

    const rect = enterBtn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    circles.forEach(circle => {
      circle.setAttribute("cx", cx);
      circle.setAttribute("cy", cy);
      const maxRadius = window.innerWidth * (0.6 + Math.random() * 0.4);
      gsap.to(circle, {
        r: maxRadius,
        duration: 1 + Math.random() * 0.5,
        ease: "power2.out",
      });
    });

    setTimeout(() => {
      onFinish();
    }, 1500);
  };

  return (
    <div className="loading-page">
     
      <div ref={svgContainerRef} id="svgContainer"></div>
      <div id="text">LOADING...</div>
        <div id="loadingBarContainer">
        <div ref={loadingBarRef}id="loadingBar"></div>
        </div>

      <svg
        ref={splashSvgRef}
        id="splashSvg"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      >
        {[...Array(5)].map((_, i) => (
          <circle key={i} r="0" fill="beige" opacity="0.9" />
        ))}
      </svg>

      <button
        ref={enterBtnRef}
        id="enterBtn"
        style={{ display: "none", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        onClick={handleEnterClick}
      >
        Enter
      </button>
    </div>
  );
}

export default Loading;
