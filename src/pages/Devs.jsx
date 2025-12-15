import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Github, Linkedin, Instagram, Mail } from 'lucide-react';

const SocialLinks = ({ social, isMobile, isActive }) => (
  <div
    className={`
      transition-all duration-700 ease-out
      ${isMobile
        ? isActive
          ? 'opacity-100 translate-y-0 max-h-20'
          : 'opacity-0 -translate-y-4 max-h-0 overflow-hidden'
        : isActive
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 -translate-y-8 scale-95'
      }
    `}
  >
    <div className="bg-gradient-to-br from-red-900/90 to-black/90 backdrop-blur-sm rounded-xl px-3 py-1.5 border-2 border-red-600/30 shadow-lg shadow-red-900/50">
      <div className="flex gap-1.5 justify-center">
        <a
          href={social.github}
          target="_blank"
          rel="noreferrer"
          className="icon-rotate-hover p-2 bg-red-600 hover:bg-red-500 rounded-full transition-all duration-300 hover:scale-110"
        >
          <Github size={18} />
        </a>
        <a
          href={social.linkedin}
          target="_blank"
          rel="noreferrer"
          className="icon-rotate-hover p-2 bg-red-600 hover:bg-red-500 rounded-full transition-all duration-300 hover:scale-110"
        >
          <Linkedin size={18} />
        </a>
        <a
          href={social.instagram}
          target="_blank"
          rel="noreferrer"
          className="icon-rotate-hover p-2 bg-red-600 hover:bg-red-500 rounded-full transition-all duration-300 hover:scale-110"
        >
          <Instagram size={18} />
        </a>
        <a
          href={social.email}
          target="_blank"
          rel="noreferrer"
          className="icon-rotate-hover p-2 bg-red-600 hover:bg-red-500 rounded-full transition-all duration-300 hover:scale-110"
        >
          <Mail size={18} />
        </a>
      </div>
    </div>
  </div>
);

const MemberCard = ({ member, isHovered, onHover, onLeave, isMobileScreen }) => {
  const activeGradient = 'linear-gradient(135deg, rgba(255, 46, 46, 0.38) 0%, rgba(255, 107, 138, 0.26) 25%, rgba(139, 92, 246, 0.18) 50%, rgba(59, 130, 246, 0.22) 80%)';
  const baseGradient = 'linear-gradient(135deg, rgba(255, 46, 46, 0.06) 0%, rgba(255, 107, 138, 0.05) 25%, rgba(139, 92, 246, 0.04) 50%, rgba(59, 130, 246, 0.05) 80%)';
  const useActive = isHovered || isMobileScreen;

  return (
    <div
      className="relative rounded-2xl p-6 transition-all duration-300"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        background: useActive ? activeGradient : baseGradient,
        boxShadow: '0 6px 20px rgba(6, 8, 15, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-1 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">{member.name}</h3>
        <p className="text-red-500 font-medium">{member.branch}</p>
        {member.year && <p className="text-gray-400 text-sm mb-3">{member.year}</p>}
      </div>
      <div className="mt-4 bg-gradient-to-br from-red-900/70 to-black/80 backdrop-blur-sm rounded-xl px-4 py-2 border-2 border-red-600/30 shadow-lg shadow-red-900/40">
        <div className="flex gap-2 justify-center">
          {member.social.linkedin && (
            <a
              href={member.social.linkedin}
              target="_blank"
              rel="noreferrer"
              className="icon-rotate-hover p-2 bg-red-600 hover:bg-red-500 rounded-full transition-all duration-300 hover:scale-110"
              aria-label={`${member.name} on LinkedIn`}
            >
              <Linkedin size={18} />
            </a>
          )}
          {member.social.instagram && (
            <a
              href={member.social.instagram}
              target="_blank"
              rel="noreferrer"
              className="icon-rotate-hover p-2 bg-red-600 hover:bg-red-500 rounded-full transition-all duration-300 hover:scale-110"
              aria-label={`${member.name} on Instagram`}
            >
              <Instagram size={18} />
            </a>
          )}
          {member.social.email && (
            <a
              href={member.social.email}
              target="_blank"
              rel="noreferrer"
              className="icon-rotate-hover p-2 bg-red-600 hover:bg-red-500 rounded-full transition-all duration-300 hover:scale-110"
              aria-label={`Email ${member.name}`}
            >
              <Mail size={18} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
const DevCard = ({ dev, isHovered, onHover, onLeave, isMobileActive, onMobileClick, isDimmed, isMobileScreen }) => {
  const activeGradient = 'linear-gradient(135deg, rgba(255, 46, 46, 0.38) 0%, rgba(255, 107, 138, 0.26) 25%, rgba(139, 92, 246, 0.18) 50%, rgba(59, 130, 246, 0.22) 80%)';
  const baseGradient = 'linear-gradient(135deg, rgba(255, 46, 46, 0.12) 0%, rgba(255, 107, 138, 0.10) 25%, rgba(139, 92, 246, 0.08) 50%, rgba(59, 130, 246, 0.10) 80%)';
  const useActive = isHovered || isMobileScreen;

  return (
    <div
      className={`relative md:w-72 w-full mx-auto md:mb-20 mb-32 transition-all duration-300 ease-out
        ${isDimmed ? 'md:blur-sm md:brightness-75 md:opacity-60 md:scale-[0.98]' : ''}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onMobileClick}
    >
      <div className="relative">
        {/* Image Container - Overlapping the card */}
        <div className={`
          relative z-10 transition-all duration-500 ease-out
          ${isHovered ? 'md:-translate-y-8' : 'md:translate-y-0'}
        `}>
          <div className="relative mx-auto w-48 h-48 rounded-xl overflow-hidden">
            <img
              src={dev.image}
              alt={dev.name}
              className="w-full h-full object-cover"
              style={{ backgroundColor: 'transparent' }}
            />
          </div>
        </div>

        {/* Card Container */}
        <div
          className={`
            relative rounded-2xl -mt-24 pt-28 px-0
            transition-all duration-500 cursor-pointer
          `}
          style={{
            background: useActive ? activeGradient : baseGradient,
            boxShadow: '0 6px 20px rgba(6, 8, 15, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
            opacity: 1,
          }}
        >
          {/* Content Container */}
          <div className={`
            px-6 pb-4 transition-all duration-500
            ${isHovered ? 'md:-translate-y-4' : 'md:translate-y-0'}
          `}>
            <h3 className="text-2xl font-bold text-center mb-1 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              {dev.name}
            </h3>
            <p className="text-red-500 text-center font-medium">{dev.role}</p>
            <p className="text-gray-300 text-center text-sm mb-3">
              {dev.branch} · {dev.year}
            </p>

            {/* Details - Desktop: shown on hover, Mobile: always shown */}
            <div className={`
              transition-all duration-500
              md:opacity-0 md:max-h-0 md:overflow-hidden opacity-100 max-h-80
              ${isHovered ? 'md:opacity-100 md:max-h-80 md:mt-3' : ''}
            `}>
              <p className="text-gray-400 text-sm text-center leading-relaxed">
                {dev.bio}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Social Box - Outside the card */}
      <div className="md:hidden">
        <div
          className={`
            mt-4 transition-all duration-500 ease-out origin-top
            ${isMobileActive
              ? 'opacity-100 translate-y-0 scale-y-100'
              : 'opacity-0 -translate-y-4 scale-y-0'
            }
          `}
        >
          <div className="bg-gradient-to-br from-red-900/90 to-black/90 backdrop-blur-sm rounded-xl px-3 py-1.5 border-2 border-red-600/30 shadow-lg shadow-red-900/50">
            <div className="flex gap-1.5 justify-center">
              <a href={dev.social.github} target="_blank" rel="noreferrer" className="icon-rotate-hover p-2 bg-red-600 hover:bg-red-500 rounded-full transition-all duration-300 hover:scale-110">
                <Github size={18} />
              </a>
              <a href={dev.social.linkedin} target="_blank" rel="noreferrer" className="icon-rotate-hover p-2 bg-red-600 hover:bg-red-500 rounded-full transition-all duration-300 hover:scale-110">
                <Linkedin size={18} />
              </a>
              <a href={dev.social.instagram} target="_blank" rel="noreferrer" className="icon-rotate-hover p-2 bg-red-600 hover:bg-red-500 rounded-full transition-all duration-300 hover:scale-110">
                <Instagram size={18} />
              </a>
              <a href={dev.social.email} target="_blank" rel="noreferrer" className="icon-rotate-hover p-2 bg-red-600 hover:bg-red-500 rounded-full transition-all duration-300 hover:scale-110">
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Social Box - Completely separate box below with drop animation */}
      <div className="hidden md:block">
        <div
          className={`
            mt-4 transition-all duration-700 ease-out origin-top
            ${isHovered
              ? 'opacity-100 translate-y-0 scale-y-100'
              : 'opacity-0 -translate-y-8 scale-y-0'
            }
          `}
        >
          <div className="bg-gradient-to-br from-red-900/90 to-black/90 backdrop-blur-sm rounded-xl px-4 py-1.5 border-2 border-red-600/30 shadow-2xl shadow-red-900/50">
            <div className="flex gap-2 justify-center">
              <a href={dev.social.github} target="_blank" rel="noreferrer" className="icon-rotate-hover p-3 bg-red-600 hover:bg-red-500 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/50">
                <Github size={20} />
              </a>
              <a href={dev.social.linkedin} target="_blank" rel="noreferrer" className="icon-rotate-hover p-3 bg-red-600 hover:bg-red-500 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/50">
                <Linkedin size={20} />
              </a>
              <a href={dev.social.instagram} target="_blank" rel="noreferrer" className="icon-rotate-hover p-3 bg-red-600 hover:bg-red-500 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/50">
                <Instagram size={20} />
              </a>
              <a href={dev.social.email} target="_blank" rel="noreferrer" className="icon-rotate-hover p-3 bg-red-600 hover:bg-red-500 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/50">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DevsPage = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mobileActiveCard, setMobileActiveCard] = useState(null);
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const [hoveredMember, setHoveredMember] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return;
      setIsMobileScreen(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Developer data - easy to add more developers
  const developers = [
    {
      id: 1,
      name: "Aayush Arya",
      role: "Full Stack",
      branch: "ECE",
      year: "2nd Year",
      image: "images/devs/aayush.png",
      bio: "Curious builder who works across the stack, with interest in clean interfaces, smart app development, and creative automation.",
      social: {
        github: "https://github.com/AayushArya28",
        linkedin: "https://www.linkedin.com/in/aayusharyaiam/",
        instagram: "https://www.instagram.com/aayusharya_i_am/",
        email: "mailto:aayush10738@gmail.com"
      }
    },
    {
      id: 2,
      name: "Ashutosh Kumar",
      role: "UI/UX & Backend",
      branch: "ECE",
      year: "2nd Year",
      image: "images/devs/ashu.png",
      bio: "I am an engineering student passionate about UI/UX, Backend, automation and building innovative tech projects that blend creativity and real impact.",
      social: {
        github: "https://github.com/Ashutosh9470",
        linkedin: "https://www.linkedin.com/in/ashutosh-kumar-3624b332a/",
        instagram: "https://www.instagram.com/sharmashutosh01/",
        email: "mailto:sharmashutosh02@gmail.com"
      }
    },
    {
      id: 3,
      name: "Kanan Kotwani",
      role: "Frontend Engineer",
    branch: "AI&ML",
      year: "2nd Year",
      image: "images/devs/kanan.png",
      bio: "Skilled in building fast, responsive, and user-focused web interfaces",
      social: {
        github: "https://github.com/kanankotwani28",
        linkedin: "https://www.linkedin.com/in/kanan-kotwani/",
        instagram: "https://www.instagram.com/kaananfr/",
        email: "mailto:kanankotwani28@gmail.com"
      }
    },
    {
      id: 4,
      name: "Krish Agarwal",
      role: "Full Stack",
      branch: "CSE",
      year: "2nd Year",
      image: "images/devs/krish.png",
      bio: "Exploring new tech and an enthusiastic developer. Full Stack Developer with a tinge of UI/UX, apps, bots and automation.",
      social: {
        github: "https://github.com/ikrishagarwal",
        linkedin: "https://www.linkedin.com/in/ikrishagarwal/",
        instagram: "https://instagram.com/coffee.to.code.machine",
        email: "mailto:foronlykrish@gmail.com"
      }
    }
    // {
    //   id: 5,
    //   name: "David Kumar",
    //   role: "Mobile Developer",
    //   branch: "CSE",
    //   year: "2nd Year",
    //   image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    //   bio: "Creating native mobile experiences. React Native and Flutter expert.",
    //   social: {
    //     github: "https://github.com",
    //     linkedin: "https://linkedin.com",
    //     instagram: "https://instagram.com",
    //     email: "mailto:david@technika.dev"
    //   }
    // },
    // {
    //   id: 6,
    //   name: "Lisa Park",
    //   role: "Data Scientist",
    //   branch: "AIML",
    //   year: "3rd Year",
    //   image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop",
    //   bio: "Turning data into insights. Machine learning and AI enthusiast.",
    //   social: {
    //     github: "https://github.com",
    //     linkedin: "https://linkedin.com",
    //     instagram: "https://instagram.com",
    //     email: "mailto:lisa@technika.dev"
    //   }
    // }
  ];

  const coreMembers = [
    {
      id: 1,
      name: "Virat",
      branch: "AI&ML",
      year: "1st Year",
      social: {
        linkedin: "https://www.linkedin.com/in/virat-m-62a710390?utm_source=share_via&utm_content=profile&utm_medium=member_android",
        instagram: "https://www.instagram.com/vir_x_t",
        email: "mailto:demonvirat1980@gmail.com"
      }
    },
    {
      id: 2,
      name: "Krishankant Jha",
      branch: "CSE",
      year: "1st Year",
      social: {
        linkedin: "https://www.linkedin.com/in/krishankant-jha-kk00001?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
        instagram: "https://www.instagram.com/thek.krisshhh?igsh=NzJjajk1M2JlM3Z4",
        email: "mailto:krishnkantjha713@gmail.com"
      }
    }
  ];

  const handleMobileClick = (id) => {
    setMobileActiveCard(mobileActiveCard === id ? null : id);
  };

  return (
    <div
      className="min-h-screen text-white px-4 pt-24 pb-8 md:px-8 md:pt-24"
      style={{
        backgroundImage: "url('/images/bg-dev.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
            Meet Our Developers
          </h1>
          <p className="text-gray-400 text-lg">The core minds behind the development of Official Technika website</p>
        </div>

        {/* Spacer under navbar on all views */}
        <div className="h-4 md:h-2" />

        {/* Developer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {developers.slice(0, 4).map((dev) => (
            <DevCard
              key={dev.id}
              dev={dev}
              isHovered={hoveredCard === dev.id}
              onHover={() => setHoveredCard(dev.id)}
              onLeave={() => setHoveredCard(null)}
              isMobileActive={mobileActiveCard === dev.id}
              onMobileClick={() => handleMobileClick(dev.id)}
              isDimmed={hoveredCard !== null && hoveredCard !== dev.id}
              isMobileScreen={isMobileScreen}
            />
          ))}
        </div>

        {/* Additional developers - centered */}
        {developers.length > 4 && (
          <div className="flex flex-wrap justify-center gap-8">
            {developers.slice(4).map((dev) => (
              <div key={dev.id} className="w-full md:w-auto">
                <DevCard
                  dev={dev}
                  isHovered={hoveredCard === dev.id}
                  onHover={() => setHoveredCard(dev.id)}
                  onLeave={() => setHoveredCard(null)}
                  isMobileActive={mobileActiveCard === dev.id}
                  onMobileClick={() => handleMobileClick(dev.id)}
                  isDimmed={hoveredCard !== null && hoveredCard !== dev.id}
                  isMobileScreen={isMobileScreen}
                />
              </div>
            ))}
          </div>
        )}

        {/* Members section */}
        <div className="mt-12 pb-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Members</h2>
            <p className="text-gray-400">The driving force that helped build Technika Website</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {coreMembers.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                isHovered={hoveredMember === member.id}
                onHover={() => setHoveredMember(member.id)}
                onLeave={() => setHoveredMember(null)}
                isMobileScreen={isMobileScreen}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevsPage;
