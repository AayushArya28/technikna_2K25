import { useContext, useRef, useEffect } from "react";
import { SwitchTransition, Transition } from "react-transition-group";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

import TransitionContext from "../context/transition";

const TransitionComponent = ({ children }) => {
  const location = useLocation();
  const { toggleCompleted, updateRoute } = useContext(TransitionContext);
  const nodeRef = useRef(null);

  // Update route in context whenever location changes
  useEffect(() => {
    updateRoute(location.pathname);
  }, [location.pathname, updateRoute]);

  return (
    <SwitchTransition mode="out-in">
      <Transition
        key={location.pathname}
        nodeRef={nodeRef}
        timeout={1400}
        in={true}
        mountOnEnter
        unmountOnExit
        addEndListener={(done) => {
          setTimeout(done, 1400); // match your GSAP duration
        }}
        onEntering={() => {
          toggleCompleted(false);

          console.log("Entering", location.pathname);

          // Check if doors exist
          const doors = document.querySelectorAll(".door");
          console.log("Found doors:", doors.length);

          if (doors.length === 0) {
            console.log("No doors found, waiting...");
            // Wait a bit and try again
            setTimeout(() => {
              const delayedDoors = document.querySelectorAll(".door");
              console.log("Delayed check - Found doors:", delayedDoors.length);

              if (delayedDoors.length > 0) {
                // Clear any CSS transforms and set initial position
                gsap.set(".door", {
                  x: 0,
                });

                gsap
                  .timeline({
                    onComplete: () => toggleCompleted(true),
                  })
                  .to(".door", {
                    x: (_, target) =>
                      target.classList.contains("left-door") ? "-100%" : "100%",
                    duration: 1.2,
                  });
              } else {
                toggleCompleted(true);
              }
            }, 50);
            return;
          }

          // Clear any CSS transforms and set initial position
          gsap.set(".door", {
            x: 0,
          });

          gsap
            .timeline({
              onComplete: () => toggleCompleted(true),
            })
            .to(".door", {
              x: (_, target) =>
                target.classList.contains("left-door") ? "-100%" : "100%",
              duration: 1.2,
              ease: "power2.inOut",
              force3D: true,
            });
        }}
        onExiting={() => {
          // Set doors to open position first
          gsap.set(".door", {
            x: (_, target) =>
              target.classList.contains("left-door") ? "-100%" : "100%",
          });

          gsap.timeline().to(".door", {
            x: 0,
            duration: 1.2,
            force3D: true,
          });
        }}
      >
        <div ref={nodeRef}>{children}</div>
      </Transition>
    </SwitchTransition>
  );
};

export default TransitionComponent;
