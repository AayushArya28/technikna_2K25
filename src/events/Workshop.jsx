import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEntitlements } from "../context/useEntitlements.jsx";
import { usePopup } from "../context/usePopup.jsx";

function ComingSoonPage({ onBack }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">
      <button
        type="button"
        onClick={onBack}
        className="fixed top-24 left-4 sm:top-6 sm:left-6 lg:top-20 lg:left-20 z-50 flex items-center gap-2 hover:bg-black text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition shadow-md text-sm sm:text-base"
      >
         Back
      </button>
      <img
        src="/images/coming-soon.jpg"
        alt="Coming Soon"
        className="max-w-xs sm:max-w-sm md:max-w-md opacity-90"
      />
    </div>
  );
}

export default function Workshop() {
  const navigate = useNavigate();
  const popup = usePopup();
  const { loading: entitlementsLoading, canAccessEvents } = useEntitlements();

  useEffect(() => {
    if (entitlementsLoading) return;
    if (canAccessEvents) return;

    popup.info("Alumni Pass users can access only the Alumni section.");
    navigate("/alumni", { replace: true });
  }, [canAccessEvents, entitlementsLoading, navigate, popup]);

  // NOTE: This page is intentionally "Coming Soon" right now.
  // To enable the full Workshops UI later:
  // 1) Comment out the line below.
  // 2) Uncomment the "FUTURE WORKSHOPS" block at the bottom and render that component.
  return <ComingSoonPage onBack={() => navigate("/events")} />;
}

/*
========================
FUTURE WORKSHOPS (EXAMPLE)
========================

When you are ready to launch paid/free workshops:
- Create stable IDs in src/lib/eventIds.js (never change existing IDs once assigned)
- Use EventForm like Technical/Cultural
- Keep the same entitlements guards (canAccessEvents)

Example list you can edit easily:

const WORKSHOP_EVENTS = [
  {
    key: "robotics_iot_ai", // add this key to eventIds.js
    title: "Humanoid & Beyond (Robotics, IoT & AI)",
    desc: "Hands-on workshop with Robotics + IoT + AI basics.",
    img: "/slides/slide1.png",
  },
  {
    key: "arduino_esp", // add this key to eventIds.js
    title: "ESP & Arduino (Collab with IIT Patna)",
    desc: "Embedded systems + IoT workshop.",
    img: "/slides/slide2.png",
  },
];

// Example skeleton (you can copy Technical/Cultural patterns):
// export default function Workshop() {
//   const navigate = useNavigate();
//   const popup = usePopup();
//   const { loading: entitlementsLoading, canAccessEvents } = useEntitlements();
//
//   useEffect(() => {
//     if (entitlementsLoading) return;
//     if (canAccessEvents) return;
//     popup.info("Alumni Pass users can access only the Alumni section.");
//     navigate("/alumni", { replace: true });
//   }, [canAccessEvents, entitlementsLoading, navigate, popup]);
//
//   return <div>... your Workshops UI ...</div>;
// }
*/
