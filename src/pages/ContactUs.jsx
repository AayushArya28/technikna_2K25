import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  User,
  MessageSquare,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";

// Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const titleRef = useRef(null);
  const formRef = useRef(null);
  const contactCardsRef = useRef([]);
  const mapRef = useRef(null);

  // Animations
  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: -40 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    tl.fromTo(
      contactCardsRef.current,
      { opacity: 0, x: -40, scale: 0.9 },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.18,
        ease: "back.out(1.4)",
      },
      "-=0.5"
    );

    tl.fromTo(
      formRef.current,
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
      "-=0.4"
    );

    if (mapRef.current) {
      tl.fromTo(
        mapRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.6"
      );
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "contacts"), {
        ...formData,
        timestamp: new Date(),
      });

      gsap.to(formRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          setSubmitted(true);

          gsap.fromTo(
            ".success-message",
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" }
          );

          setTimeout(() => {
            setSubmitted(false);
            setFormData({
              name: "",
              email: "",
              phone: "",
              message: "",
            });
          }, 3000);
        },
      });
    } catch (error) {
      console.error("Error saving contact form data: ", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const contactInfo = [
    {
      icon: <User className="w-6 h-6" />,
      title: "Publicity Head",
      info: "Shikhar Rai (+91 79857 67003)",
      color: "bg-sky-500",
    },
    {
      icon: <User className="w-6 h-6" />,
      title: "Venue Head",
      info: "Parag (+91 81302 15822)",
      color: "bg-indigo-500",
    },
    {
      icon: <User className="w-6 h-6" />,
      title: "Event Head",
      info: "Suyash Sinha (+91 70707 47693)",
      color: "bg-pink-500",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      info: "technika@bitmesra.ac.in",
      color: "bg-emerald-500",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Location",
      info: "BIT Patna, Patna",
      color: "bg-violet-500",
      link: "https://maps.app.goo.gl/Ck8LjZcoWbXz8nPCA",
    },
  ];

  // Same hover animation as footer social buttons
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

  // Social links for Contact page (match footer links)
  const SOCIAL_URLS = [
    "https://www.facebook.com/",
    "https://x.com/technikabitp",
    "https://www.instagram.com/technika_bitp?igsh=MTlqY2Vwd3h4OHdrdQ==",
    "https://www.linkedin.com/in/technika-bitp-b765b2397?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    "https://youtube.com/@technika_bitp?si=2tvJpStKabR5RO-y",
  ];

  // X icon uses the shared PNG asset to avoid broken links
  const XIcon = ({ size = 18 }) => (
    <img
      src="/images/x-logo.png"
      alt="X"
      width={size}
      height={size}
      draggable={false}
      style={{ display: "block" }}
    />
  );

  const ICON_COMPONENTS = [Facebook, XIcon, Instagram, Linkedin, Youtube];

  return (
    <div
      className="
        relative min-h-screen
        bg-[url('/images/bg-contact.png')]
        bg-cover bg-center bg-fixed bg-no-repeat
        pt-25 pb-16 px-4 sm:px-6 lg:px-8
        text-gray-100
      "
    >
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-12">
          <p className="text-sm tracking-[0.3em] uppercase text-red-300 mb-2">
            Contact Technika
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Get In Touch
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Have questions about Technika, events or collaborations? Send us a
            message and the core team will get back to you.
          </p>
        </div>

        {/* Contact cards */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {contactInfo.map((item, index) => (
            <div
              key={index}
              ref={(el) => (contactCardsRef.current[index] = el)}
              className="w-full md:w-[30%] max-w-sm cursor-pointer"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  y: -8,
                  duration: 0.25,
                  boxShadow: "0 18px 40px rgba(0,0,0,0.7)",
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  y: 0,
                  duration: 0.25,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                });
              }}
            >
              <div className="rounded-xl border border-white/15 bg-black/55 backdrop-blur-sm shadow-[0_16px_40px_rgba(0,0,0,0.75)] p-6 text-center">
                <div
                  className={`${item.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-[0_0_22px_rgba(248,113,113,0.35)]`}
                >
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {item.title}
                </h3>
                <p className="text-gray-200">
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-200 hover:text-red-300 hover:underline"
                    >
                      {item.info}
                    </a>
                  ) : (
                    item.info
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Form + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div
            ref={formRef}
            className="rounded-2xl overflow-hidden border border-white/15 bg-black/60 backdrop-blur-sm shadow-[0_22px_50px_rgba(0,0,0,0.85)] p-8"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center text-white">
              <MessageSquare className="w-6 h-6 mr-2 text-red-400" />
              Send us a Message
            </h2>

            {!submitted ? (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-black/60 border border-white/20 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-black/60 border border-white/20 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-black/60 border border-white/20 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                    placeholder="+91 123 456 7890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2 rounded-lg bg-black/60 border border-white/20 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center hover:bg-red-700 transition-colors shadow-[0_0_22px_rgba(248,113,113,0.4)]"
                  onMouseEnter={(e) => {
                    gsap.to(e.currentTarget, {
                      scale: 1.03,
                      duration: 0.18,
                    });
                  }}
                  onMouseLeave={(e) => {
                    gsap.to(e.currentTarget, {
                      scale: 1,
                      duration: 0.18,
                    });
                  }}
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </button>
              </form>
            ) : (
              <div className="success-message flex flex-col items-center justify-center h-64">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(16,185,129,0.7)]">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Message Sent!
                </h3>
                <p className="text-gray-200 text-center">
                  Thank you for reaching out. We'll get back to you soon!
                </p>
              </div>
            )}
          </div>

          {/* Map + socials */}
          <div
            ref={mapRef}
            className="rounded-2xl overflow-hidden border border-white/15 bg-black/60 backdrop-blur-sm shadow-[0_22px_50px_rgba(0,0,0,0.85)] p-8 flex flex-col"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center text-white">
              <MapPin className="w-6 h-6 mr-2 text-red-400" />
              Find Us
            </h2>

            <div className="group flex-1 bg-black/40 rounded-lg overflow-hidden relative min-h-[300px] border border-white/15">
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

            <div className="mt-6 pt-6 border-t border-white/15">
              <h3 className="text-lg font-semibold mb-4 text-white">
                Follow Us
              </h3>
              <div className="flex space-x-4">
                {ICON_COMPONENTS.map((Icon, idx) => {
                  // Facebook (index 0) is intentionally hidden
                  if (idx === 0) return null;

                  return (
                    <a
                      key={idx}
                      href={SOCIAL_URLS[idx]}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={handleSocialMouseEnter}
                      onMouseLeave={handleSocialMouseLeave}
                      className="w-10 h-10 bg-black/60 border border-white/25 rounded-full flex items-center justify-center 
                                 hover:bg-red-600 transition-colors duration-300 text-gray-200 hover:text-white
                                 shadow-[0_0_16px_rgba(248,113,113,0.3)]"
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
