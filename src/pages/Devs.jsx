import React from "react";
import ProfileCard from "../components/ProfileCard";

const Devs = () => {
  const handleContactClick = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="bg-gray-100 min-h-screen py-16 px-4">
      <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
        Meet the Developers
      </h2>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 place-items-center">
        <div className="w-full flex justify-center">
          <ProfileCard
            name="Ashutosh Kumar"
            title="Web Developer"
            handle="sharmashutosh01"
            status="Online"
            contactText="Contact Me"
            avatarUrl="/public/images/devs/ashu.jpeg"
            showUserInfo={true}
            enableTilt={true}
            enableMobileTilt={false}
            onContactClick={() => handleContactClick("https://www.linkedin.com/in/ashutosh-kumar-3624b332a/")}
          />
        </div>
        <div className="w-full flex justify-center">
          <ProfileCard
            name="Aayush Arya"
            title="Web Developer"
            handle="aayusharya_i_am"
            status="Online"
            contactText="Say Hi 👋"
            avatarUrl="/public/images/devs/aayush.jpeg"
            showUserInfo={true}
            enableTilt={true}
            enableMobileTilt={true}
            onContactClick={() => handleContactClick("https://www.linkedin.com/in/aayusharyaiam/")}
          />
        </div>
        <div className="w-full flex justify-center">
          <ProfileCard
            name="Krish Agarwal"
            title="Web Developer"
            handle="coffee.to.code.machine"
            status="Online"
            contactText="Ping Me"
            avatarUrl="/public/images/devs/krish.jpg"
            showUserInfo={true}
            enableTilt={true}
            enableMobileTilt={false}
            onContactClick={() => handleContactClick("https://www.linkedin.com/in/ikrishagarwal/")}
          />
        </div>
        <div className="w-full flex justify-center">
          <ProfileCard
            name="Kanan Kotwani"
            title="Web Developer"
            handle="kanan"
            status="Online"
            contactText="Let's Collaborate"
            avatarUrl="public/images/devs/kanan.jpg"
            showUserInfo={true}
            enableTilt={true}
            enableMobileTilt={false}
            onContactClick={() => handleContactClick("https://www.linkedin.com/in/kanan-kotwani/")}
          />
        </div>
      </div>
    </div>
  );
};

export default Devs;