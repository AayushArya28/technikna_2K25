import React from "react";
import ProfileCard from "../components/ProfileCard";

const Devs = () => {
  const handleContactClick = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="pt-25 min-h-screen flex items-center justify-center bg-black">
      <img src="/images/coming-soon.jpg" alt="Coming Soon" className="max-w-xs sm:max-w-sm md:max-w-md opacity-90" />
    </div>
  );
};

export default Devs;