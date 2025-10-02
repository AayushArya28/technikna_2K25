import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./Loading.css";
import DrawSVGPlugin from "gsap/DrawSVGPlugin";

gsap.registerPlugin(DrawSVGPlugin);

function Loading({ onFinish }) {
  const svgContainerRef = useRef(null);
  const enterBtnRef = useRef(null);
  const splashSvgRef = useRef(null);

  useEffect(() => {
    document.querySelector(".loader") &&
      document
        .querySelector(".loader")
        .style.setProperty("stroke-width", "0.2");

    gsap.set(".loader", {
      drawSVG: "0%",
      strokeWidth: 0.2,
    });

    fetch("/landscape.svg")
      .then((res) => res.text())
      .then((svgText) => {
        if (svgContainerRef.current) {
          svgContainerRef.current.innerHTML = svgText;

          const paths = svgContainerRef.current.querySelectorAll("path");

          paths.forEach((path) => {
            const length = path.getTotalLength();
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            path.style.stroke = "#000";
            path.style.strokeWidth = "2";
            path.style.fill = "none";
          });

          const tl = gsap.timeline({
            onComplete: () => {
              document.querySelector(".loader-text") &&
                (document.querySelector(".loader-text").textContent = "Start");

              document.querySelector(".loader-group") &&
                document
                  .querySelector(".loader-group")
                  .addEventListener("click", handleEnterClick);
            },
          });

          tl.to(paths, {
            strokeDashoffset: 0,
            duration: 2,
            stagger: 0.001,
            ease: "power1.inOut",
            onUpdate: () => {
              gsap.to(".loader", {
                drawSVG: `${tl.progress() * 100}%`,
                duration: 0.1,
              });

              document.querySelector(".loader-text") &&
                (document.querySelector(
                  ".loader-text"
                ).textContent = `${Math.round(tl.progress() * 100)}%`);
            },
          });
        }
      });
  });

  const handleEnterClick = () => {
    const enterBtn = enterBtnRef.current;
    const circles = splashSvgRef.current.querySelectorAll("circle");

    if (!enterBtn || circles.length === 0) return;

    const rect = enterBtn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    circles.forEach((circle) => {
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
    <div className="flex flex-col w-screen h-screen bg-[beige] items-start gap-2.5">
      <div
        ref={svgContainerRef}
        className="flex-1 w-full h-full overflow-hidden"
        id="svgContainer"
      ></div>

      <svg
        ref={splashSvgRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-40"
      >
        {[...Array(5)].map((_, i) => (
          <circle key={i} r="0" fill="beige" opacity="0.9" />
        ))}
      </svg>

      <div className="absolute w-full h-full top-0 left-0 flex items-center justify-center">
        <div className="flex items-center justify-center z-10 h-full w-full bg-transparent">
          <svg
            version="1.1"
            width="256"
            height="256"
            viewBox="0 0 16 16"
            ref={enterBtnRef}
          >
            <g className="cursor-pointer loader-group">
              <rect
                x="1.9"
                y="5.9"
                width="12"
                height="4"
                stroke="black"
                strokeWidth="0"
                fill="#F5F5DC"
                ry="3"
                rx="2"
                className="loader"
              />
              <text
                x="7.9"
                y="8.1"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="2"
                fill="black"
                fontFamily="Arial, sans-serif"
                className="select-none loader-text"
              >
                0%
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default Loading;
