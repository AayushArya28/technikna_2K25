import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

// Parallax star configuration (position + depth)
const STAR_CONFIGS = [
  { size: 60, left: "15%", top: "55%", depth: 0.03 },
  { size: 44, left: "32%", top: "72%", depth: 0.05 },
  { size: 52, left: "66%", top: "60%", depth: 0.04 },
  { size: 38, left: "78%", top: "80%", depth: 0.06 },
  { size: 72, left: "10%", top: "80%", depth: 0.025 },
  { size: 50, left: "50%", top: "90%", depth: 0.045 },
  { size: 40, left: "85%", top: "65%", depth: 0.035 },
];

export function Footer() {
  const footerRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef(null);
  const mapRef = useRef(null);

  // refs for shuriken outer wrappers
  const starRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );

    if (logoRef.current) observer.observe(logoRef.current);
    if (linksRef.current) observer.observe(linksRef.current);
    if (mapRef.current) observer.observe(mapRef.current);

    return () => observer.disconnect();
  }, []);

  // Scroll-based parallax for stars
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          starRefs.current.forEach((el, idx) => {
            if (!el) return;
            const depth = STAR_CONFIGS[idx]?.depth ?? 0.03;
            // Deeper objects (smaller depth) move less; shallow move more
            const translateY = -scrollY * depth;
            el.style.transform = `translateY(${translateY}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll(); // initial position

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSocialMouseEnter = (e) => {
    gsap.to(e.currentTarget, {
      scale: 1.2,
      rotation: 360,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleSocialMouseLeave = (e) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      rotation: 0,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-[#050509] text-gray-200 pt-16 pb-8"
    >
      {/* ================= BACKGROUND SAMURAI LAYER ================= */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.22]">
        {/* Radial red glow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[580px] h-[580px] rounded-full bg-red-600/40 blur-3xl" />

        {/* Katana Left */}
        <div
          className="absolute -left-10 top-10"
          style={{ animation: "katanaFloat 14s ease-in-out infinite" }}
        >
          <svg width="190" height="40" viewBox="0 0 190 40" className="-rotate-12">
            <rect
              x="30"
              y="16"
              width="140"
              height="4"
              rx="2"
              fill="#f97373"
              opacity="0.9"
            />
            <rect x="18" y="13" width="10" height="10" rx="2" fill="#111827" />
          </svg>
        </div>

        {/* Katana Right */}
        <div
          className="absolute -right-16 top-24"
          style={{ animation: "katanaFloat 18s ease-in-out infinite 2s" }}
        >
          <svg width="200" height="40" viewBox="0 0 200 40" className="rotate-6">
            <rect
              x="30"
              y="16"
              width="150"
              height="4"
              rx="2"
              fill="#f87171"
              opacity="0.85"
            />
            <rect x="18" y="13" width="10" height="10" rx="2" fill="#020617" />
          </svg>
        </div>

        {/* ========= THROWING STARS WITH PARALLAX ========= */}
        {STAR_CONFIGS.map((star, i) => (
          <div
            key={i}
            ref={(el) => (starRefs.current[i] = el)}
            className="absolute"
            style={{
              left: star.left,
              top: star.top,
            }}
          >
            {/* inner wrapper spins; outer div moves with scroll */}
            <div className="shuriken-spin opacity-70">
              <svg width={star.size} height={star.size} viewBox="0 0 60 60">
                <polygon
                  points="30,4 36,24 56,30 36,36 30,56 24,36 4,30 24,24"
                  fill="#fca5a5"
                />
                <circle cx="30" cy="30" r="4" fill="#020617" />
              </svg>
            </div>
          </div>
        ))}
      </div>
      {/* ========================================================== */}

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* ================= LOGOS ================= */}
          <div
            ref={logoRef}
            className="opacity-0 transition-all duration-700 ease-out"
            style={{ transform: "translateY(30px)" }}
          >
            <div className="space-y-6">
              {/* BIT */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-slate-900 border border-slate-700 rounded-lg p-2 overflow-hidden">
                  <img
                    src="/images/bit-patna-logo.png"
                    alt="BIT"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">BIT Mesra</h3>
                  <p className="text-sm text-gray-400">Excellence in Education</p>
                </div>
              </div>

              {/* Technika */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-[#11111a] border border-red-700/60 rounded-lg p-2 overflow-hidden">
                  <img
                    src="/technika_logo.png"
                    alt="Technika"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Technika</h3>
                  <p className="text-sm text-gray-400">Annual Tech Fest</p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= LINKS + SOCIAL ================= */}
          <div
            ref={linksRef}
            className="opacity-0 transition-all duration-700 ease-out delay-200"
            style={{ transform: "translateY(30px)" }}
          >
            <h3 className="text-lg font-semibold mb-4 text-white">Important Links</h3>
            <ul className="space-y-2 text-sm mb-8">
              {["About Us", "Events", "Core Team", "Contact"].map((text) => (
                <li key={text}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-red-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {text}
                  </a>
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold mb-4 text-white">Follow Us</h3>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  onMouseEnter={handleSocialMouseEnter}
                  onMouseLeave={handleSocialMouseLeave}
                  className="w-10 h-10 bg-slate-950/70 border border-slate-700/80 rounded-full flex items-center justify-center 
                             hover:bg-red-600 transition-colors duration-300 text-gray-200
                             shadow-[0_0_18px_rgba(248,113,113,0.15)]"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* ================= MAP ================= */}
          <div
            ref={mapRef}
            className="opacity-0 transition-all duration-700 ease-out delay-300"
            style={{ transform: "translateY(30px)" }}
          >
            <h3 className="text-lg font-semibold mb-4 text-white">
              BIT Patna Location
            </h3>

            <div className="bg-slate-900 rounded-lg overflow-hidden h-48 mb-4 border border-slate-700">
              <iframe
                className="w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                title="BIT Patna"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3598.174688276893!2d85.09965931501436!3d25.611938583711956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed58dce6731f59%3A0x4059f39a1ac82c86!2sBirla%20Institute%20Of%20Technology%2C%20Patna!5e0!3m2!1sen!2sin!4v1234567890"
              />
            </div>

            <div className="space-y-2 text-sm text-gray-400">
              <a
                href="https://www.google.com/maps?q=BIT+Patna,+Bihar,+India"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:text-red-400 transition-colors duration-300"
              >
                <MapPin size={16} /> <span>BIT Patna, Bihar, India</span>
              </a>
              <a
                href="tel:+911234567890"
                className="flex items-center space-x-2 hover:text-red-400 transition-colors duration-300"
              >
                <Phone size={16} /> <span>+91 1234567890</span>
              </a>
              <a
                href="mailto:technika@bitmesra.ac.in"
                className="flex items-center space-x-2 hover:text-red-400 transition-colors duration-300"
              >
                <Mail size={16} /> <span>technika@bitmesra.ac.in</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-8 text-sm flex justify-between flex-wrap">
          <p className="text-gray-500">© 2026 BIT Mesra - Technika</p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-red-400">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-red-400">
              Terms of Service
            </a>
          </div>
        </div>
      </div>

      {/* ================= ANIMATION CSS ================= */}
      <style>{`
        @keyframes katanaFloat {
          0%   { transform: translateY(0px); }
          50%  { transform: translateY(-16px); }
          100% { transform: translateY(0px); }
        }

        @keyframes shurikenSpin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .shuriken-spin {
          animation: shurikenSpin 12s linear infinite;
        }
      `}</style>
    </footer>
  );
}

export default Footer;
