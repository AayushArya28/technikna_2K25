import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { User, Mail, Phone, Calendar, Shirt, Tag, CreditCard } from "lucide-react";

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

const Alumni = () => {
    const [formData, setFormData] = useState({
        name: "",
        yearOfPassing: "",
        phone: "",
        email: "",
        size: "",
        merchName: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const titleRef = useRef(null);
    const contentRef = useRef(null);
    const formRef = useRef(null);

    // Initial animations on mount
    useEffect(() => {
        const tl = gsap.timeline();

        // Title animation
        tl.fromTo(
            titleRef.current,
            { opacity: 0, y: -50 },
            { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
        );

        // Content animation
        tl.fromTo(
            contentRef.current,
            { opacity: 0, x: -50 },
            { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
            "-=0.5"
        );

        // Form animation
        tl.fromTo(
            formRef.current,
            { opacity: 0, x: 50 },
            { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
            "-=0.5"
        );
    }, []);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Save form data to Firestore
            await addDoc(collection(db, "alumni_registrations"), {
                ...formData,
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
                            yearOfPassing: "",
                            phone: "",
                            email: "",
                            size: "",
                            merchName: "",
                        });
                    }, 3000);
                },
            });
        } catch (error) {
            console.error("Error saving alumni registration: ", error);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-[url('/images/bg-contus.png')] bg-fixed bg-cover bg-center bg-no-repeat py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div ref={titleRef} className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">
                        Alumni Registration – Technika ’26
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Content Section */}
                    <div ref={contentRef} className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-8 h-fit">
                        <h2 className="text-2xl font-bold mb-6 text-blue-900">Welcome Back!</h2>
                        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                            Step back into the BIT Patna vibe and relive the legacy. Technika ’26 welcomes all our proud alumni to register and be part of the celebration. Join us for a power-packed experience featuring exclusive alumni perks, premium access, and a full weekend of tech, culture, and nostalgia.
                        </p>

                        <h3 className="text-xl font-semibold mb-4 text-blue-800">What you get as an Alumni:</h3>
                        <ul className="space-y-3 mb-6">
                            {[
                                "Alumni Gift Pack curated specially for Technika ’26",
                                "Full Access to PR Night & DJ Night",
                                "Entry to all flagship events & showcases",
                                "Free Car Parking throughout the fest"
                            ].map((item, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                                    <span className="text-gray-700">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <p className="text-lg text-gray-700 font-medium italic">
                            Reconnect with your batchmates, meet the next generation of innovators, and enjoy the fest the way it was meant to be.
                            <br />
                            Join us and make Technika ’26 unforgettable.
                        </p>
                    </div>

                    {/* Registration Form */}
                    <div ref={formRef} className="bg-white rounded-lg shadow-xl p-8 relative">
                        <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-900">
                            <User className="w-6 h-6 mr-2 text-blue-600" />
                            Register Now
                        </h2>

                        {!submitted ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder="Your Full Name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Year of Passing</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="number"
                                            name="yearOfPassing"
                                            required
                                            value={formData.yearOfPassing}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder="YYYY"
                                            min="2000"
                                            max="2026"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone No</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder="+91 123 456 7890"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder="your.email@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">T-Shirt Size</label>
                                        <div className="relative">
                                            <Shirt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <select
                                                name="size"
                                                required
                                                value={formData.size}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
                                            >
                                                <option value="">Select Size</option>
                                                <option value="S">S</option>
                                                <option value="M">M</option>
                                                <option value="L">L</option>
                                                <option value="XL">XL</option>
                                                <option value="XXL">XXL</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name on Merch</label>
                                        <div className="relative">
                                            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="text"
                                                name="merchName"
                                                required
                                                value={formData.merchName}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                placeholder="Name to print"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-bold text-lg flex items-center justify-center hover:bg-blue-700 transition-colors mt-6 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
                                    <CreditCard className="w-6 h-6 mr-2" />
                                    Pay Now
                                </button>
                            </form>
                        ) : (
                            <div className="success-message flex flex-col items-center justify-center h-96">
                                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                                    <svg
                                        className="w-12 h-12 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={3}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                                    Registration Successful!
                                </h3>
                                <p className="text-gray-600 text-center text-lg max-w-xs">
                                    Redirecting to payment gateway...
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Alumni;
