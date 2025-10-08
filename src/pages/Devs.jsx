import React from "react";
import ProfileCard from "../components/ProfileCard";

const Devs = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-16 px-4">
      <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
        Meet the Developers
      </h2>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 place-items-center">
        <div className="w-full flex justify-center">
          <ProfileCard
            name="Javi A. Torres"
            title="Software Engineer"
            handle="javicodes"
            status="Online"
            contactText="Contact Me"
            avatarUrl="/path/to/avatar.jpg"
            showUserInfo={true}
            enableTilt={true}
            enableMobileTilt={false}
            onContactClick={() => console.log("Contact clicked")}
          />
        </div>
        <div className="w-full flex justify-center">
          <ProfileCard
            name="Aayush Arya"
            title="Frontend Developer"
            handle="aayusharya"
            status="Online"
            contactText="Say Hi 👋"
            avatarUrl="/path/to/aayush.jpg"
            showUserInfo={true}
            enableTilt={true}
            enableMobileTilt={true}
            onContactClick={() => console.log("Contact Aayush clicked")}
          />
        </div>
        <div className="w-full flex justify-center">
          <ProfileCard
            name="Ashutosh"
            title="Backend Developer"
            handle="ashucodes"
            status="Online"
            contactText="Ping Me"
            avatarUrl="/path/to/ashu.jpg"
            showUserInfo={true}
            enableTilt={true}
            enableMobileTilt={false}
            onContactClick={() => console.log("Contact Ashutosh clicked")}
          />
        </div>
        <div className="w-full flex justify-center">
          <ProfileCard
            name="Kanan"
            title="UI/UX Designer"
            handle="kanandesigns"
            status="Online"
            contactText="Let's Collaborate"
            avatarUrl="/path/to/kanan.jpg"
            showUserInfo={true}
            enableTilt={true}
            enableMobileTilt={false}
            onContactClick={() => console.log("Contact Kanan clicked")}
          />
        </div>
      </div>
    </div>
  );
};

export default Devs;