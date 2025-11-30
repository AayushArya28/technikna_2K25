import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Mail, Phone, MapPin, Send, User, MessageSquare } from "lucide-react";

// ✅ Import Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// ✅ Your Firebase Config (replace with your values)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// ✅ Initialize Firebase
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

  // Initial animations on mount
  useEffect(() => {
    const tl = gsap.timeline();

    // Title animation
    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    // Contact cards stagger animation
    tl.fromTo(
      contactCardsRef.current,
      { opacity: 0, x: -50, scale: 0.9 },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.2,
        ease: "back.out(1.2)",
      },
      "-=0.5"
    );

    // Form animation
    tl.fromTo(
      formRef.current,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
      "-=0.4"
    );

    // Map animation
    if (mapRef.current) {
      tl.fromTo(
        mapRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.6"
      );
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Updated handleSubmit with Firebase Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Save form data to Firestore
      await addDoc(collection(db, "contacts"), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        timestamp: new Date(),
      });

      // Success animation
      gsap.to(formRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          setSubmitted(true);

          // Animate success message
          gsap.fromTo(
            ".success-message",
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" }
          );

          // Reset form after delay
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
      color: "bg-blue-500",
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
      color: "bg-green-500",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Location",
      info: "BIT Patna, Patna",
      color: "bg-purple-500",
      link: "https://maps.app.goo.gl/Ck8LjZcoWbXz8nPCA",
    },
  ];

  return (
    <div className="min-h-screen bg-[url('/images/bg-contus.png')] bg-fixed bg-cover bg-center bg-no-repeat py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-12">
          <h1 className="mt-15 text-4xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h1>
          <p className="text-lg text-gray-600">
            Have questions about Technika? We'd love to hear from you!
          </p>
        </div>

        {/* Contact Cards */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {contactInfo.map((item, index) => (
            <div
              key={index}
              ref={(el) => (contactCardsRef.current[index] = el)}
              className="bg-white rounded-lg shadow-lg p-6 text-center cursor-pointer w-full md:w-[30%]"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  y: -10,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
                  duration: 0.3,
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  y: 0,
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  duration: 0.3,
                });
              }}
            >
              <div
                className={`${item.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white`}
              >
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {item.info}
                  </a>
                ) : (
                  item.info
                )}
              </p>

            </div>
          ))}
        </div>

        {/* Form and Map Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div
            ref={formRef}
            className="bg-white rounded-lg shadow-lg p-8 relative"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <MessageSquare className="w-6 h-6 mr-2 text-blue-600" />
              Send us a Message
            </h2>

            {!submitted ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="+91 123 456 7890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center hover:bg-blue-700 transition-colors"
                  onMouseEnter={(e) => {
                    gsap.to(e.currentTarget, {
                      scale: 1.02,
                      duration: 0.2,
                    });
                  }}
                  onMouseLeave={(e) => {
                    gsap.to(e.currentTarget, {
                      scale: 1,
                      duration: 0.2,
                    });
                  }}
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </button>
              </div>
            ) : (
              <div className="success-message flex flex-col items-center justify-center h-64">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4">
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
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Message Sent!
                </h3>
                <p className="text-gray-600 text-center">
                  Thank you for reaching out. We'll get back to you soon!
                </p>
              </div>
            )}
          </div>

          {/* Map Section */}
          <div
            ref={mapRef}
            className="bg-white rounded-lg shadow-lg p-8 flex flex-col"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <MapPin className="w-6 h-6 mr-2 text-purple-600" />
              Find Us
            </h2>
            <div className="flex-1 bg-gray-200 rounded-lg overflow-hidden relative min-h-[300px]">
              {/* Placeholder map */}
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

            {/* Social Media Links */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {["facebook", "twitter", "instagram", "linkedin"].map(
                  (social) => (
                    <button
                      key={social}
                      className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                      onMouseEnter={(e) => {
                        gsap.to(e.currentTarget, {
                          scale: 1.2,
                          rotation: 360,
                          duration: 0.4,
                        });
                      }}
                      onMouseLeave={(e) => {
                        gsap.to(e.currentTarget, {
                          scale: 1,
                          rotation: 0,
                          duration: 0.4,
                        });
                      }}
                    >
                      {social[0].toUpperCase()}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
