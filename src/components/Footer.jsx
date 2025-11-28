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

export function Footer() {
  const footerRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    // Fade-in animation on scroll
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
      className="bg-[url('/images/footer-bg.jpg')] text-black pt-16 pb-8"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Left - Logos */}
          <div
            ref={logoRef}
            className="opacity-0 transition-all duration-700 ease-out"
            style={{ transform: "translateY(30px)" }}
          >
            <div className="space-y-6">
              {/* BIT Patna Logo */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden bg-white p-2">
                  <img
                    src="/images/bit-patna-logo.png"
                    alt="BIT Patna Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">BIT Mesra</h3>
                  <p className="text-gray-800 text-sm">Excellence in Education</p>
                </div>
              </div>

              {/* Technika Logo */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center overflow-hidden p-2">
                  <img
                    src="/images/technika-logo.png"
                    alt="Technika Logo"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML =
                        '<span class="text-white font-bold text-lg">TK</span>';
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Technika</h3>
                  <p className="text-sm">Annual Tech Fest</p>
                </div>
              </div>
            </div>
          </div>

          {/* Middle - Links and Social Media */}
          <div
            ref={linksRef}
            className="opacity-0 transition-all duration-700 ease-out delay-200"
            style={{ transform: "translateY(30px)" }}
          >
            <div className="space-y-8">
              {/* Important Links */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Important Links</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="hover:text-blue-800 transition-colors duration-300 hover:translate-x-1 inline-block"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-blue-800 transition-colors duration-300 hover:translate-x-1 inline-block"
                    >
                      Events
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-blue-800 transition-colors duration-300 hover:translate-x-1 inline-block"
                    >
                      Core Team
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-blue-800 transition-colors duration-300 hover:translate-x-1 inline-block"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    onMouseEnter={handleSocialMouseEnter}
                    onMouseLeave={handleSocialMouseLeave}
                    className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center hover:bg-[#1877F2] transition-colors duration-300 text-white"
                  >
                    <Facebook size={18} />
                  </a>
                  <a
                    href="#"
                    onMouseEnter={handleSocialMouseEnter}
                    onMouseLeave={handleSocialMouseLeave}
                    className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center hover:bg-[#1DA1F2] transition-colors duration-300 text-white"
                  >
                    <Twitter size={18} />
                  </a>
                  <a
                    href="#"
                    onMouseEnter={handleSocialMouseEnter}
                    onMouseLeave={handleSocialMouseLeave}
                    className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center hover:bg-[#E4405F] transition-colors duration-300 text-white"
                  >
                    <Instagram size={18} />
                  </a>
                  <a
                    href="#"
                    onMouseEnter={handleSocialMouseEnter}
                    onMouseLeave={handleSocialMouseLeave}
                    className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center hover:bg-[#0A66C2] transition-colors duration-300 text-white"
                  >
                    <Linkedin size={18} />
                  </a>
                  <a
                    href="#"
                    onMouseEnter={handleSocialMouseEnter}
                    onMouseLeave={handleSocialMouseLeave}
                    className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center hover:bg-[#FF0000] transition-colors duration-300 text-white"
                  >
                    <Youtube size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Map Location */}
          <div
            ref={mapRef}
            className="opacity-0 transition-all duration-700 ease-out delay-300"
            style={{ transform: "translateY(30px)" }}
          >
            <h3 className="text-lg font-semibold mb-4 hover:text-blue-800 transition-colors duration-300">
              BIT Patna Location
            </h3>
            <div className="bg-gray-800 rounded-lg overflow-hidden h-48 mb-4 relative group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3598.174688276893!2d85.09965931501436!3d25.611938583711956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed58dce6731f59%3A0x4059f39a1ac82c86!2sBirla%20Institute%20Of%20Technology%2C%20Patna!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                className="grayscale group-hover:grayscale-0 transition-all duration-500"
                title="BIT Patna Location"
              ></iframe>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-start space-x-2 hover:text-blue-800 transition-colors duration-300">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>BIT Patna, Patna, Bihar, India</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-blue-800 transition-colors duration-300">
                <Phone size={16} className="flex-shrink-0" />
                <span>+91 1234567890</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-blue-800 transition-colors duration-300">
                <Mail size={16} className="flex-shrink-0" />
                <span>technika@bitmesra.ac.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm hover:text-blue-800 transition-colors duration-300">
              © 2026 BIT Mesra - Technika. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a
                href="#"
                className="hover:text-blue-800 transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="hover:text-blue-800 transition-colors duration-300"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
