import React, { useEffect, useRef } from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const footerRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    // Simple fade-in animation on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
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

  return (
    <footer ref={footerRef} className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Left - Logos */}
          <div 
            ref={logoRef}
            className="opacity-0 transition-all duration-700 ease-out"
            style={{ transform: 'translateY(30px)' }}
          >
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-gray-900 font-bold text-lg">BIT</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">BIT Mesra</h3>
                  <p className="text-gray-400 text-sm">Excellence in Education</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">TK</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Technika</h3>
                  <p className="text-gray-400 text-sm">Annual Tech Fest</p>
                </div>
              </div>
            </div>
          </div>

          {/* Middle - Links and Social Media */}
          <div 
            ref={linksRef}
            className="opacity-0 transition-all duration-700 ease-out delay-200"
            style={{ transform: 'translateY(30px)' }}
          >
            <div className="space-y-8">
              {/* Important Links */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-300">Important Links</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                      Events
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                      Gallery
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-300">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all duration-300 hover:scale-110">
                    <Facebook size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-all duration-300 hover:scale-110">
                    <Twitter size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-all duration-300 hover:scale-110">
                    <Instagram size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all duration-300 hover:scale-110">
                    <Linkedin size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-300 hover:scale-110">
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
            style={{ transform: 'translateY(30px)' }}
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-300">BIT Patna Location</h3>
            <div className="bg-gray-800 rounded-lg overflow-hidden h-48 mb-4 relative group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3598.174688276893!2d85.09965931501436!3d25.611938583711956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed58dce6731f59%3A0x4059f39a1ac82c86!2sBirla%20Institute%20Of%20Technology%2C%20Patna!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                className="grayscale group-hover:grayscale-0 transition-all duration-500"
              ></iframe>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-start space-x-2 text-gray-400">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>BIT Patna, Patna, Bihar, India</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Phone size={16} className="flex-shrink-0" />
                <span>+91 1234567890</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail size={16} className="flex-shrink-0" />
                <span>info@bitmesra.ac.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 BIT Mesra - Technika. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}