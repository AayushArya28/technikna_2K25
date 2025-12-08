import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shirt,
  Tag,
  CreditCard,
  LogIn,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const PaymentStatus = {
  Confirmed: "confirmed",
  Failed: "failed",
  PendingPayment: "pending_payment",
};

// const BASE_API_URL = "http://localhost:3000";
const BASE_API_URL = "https://api.technika.co";

const Alumni = () => {
  const [user, setUser] = useState(null);
  const [dbName, setDbName] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    yearOfPassing: "",
    phone: "",
    email: "",
  });
  const [status, setStatus] = useState("IDLE");
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [registrationDetails, setRegistrationDetails] = useState(null);

  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
    tl.fromTo(
      contentRef.current,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
      "-=0.5"
    );
    tl.fromTo(
      formRef.current,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
      "-=0.5"
    );
  }, []);

  // Monitor Auth State & Fetch Name from DB
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setFormData((prev) => ({ ...prev, email: currentUser.email }));

        let foundName = currentUser.displayName;

        if (!foundName) {
          try {
            const db = getFirestore();
            const authCollection = collection(db, "auth");
            const q = query(
              authCollection,
              where("email", "==", currentUser.email)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
              const userData = querySnapshot.docs[0].data();
              if (userData.name) {
                foundName = userData.name;
              }
            }
          } catch (error) {
            console.error("Error fetching user details:", error);
          }
        }

        setDbName(foundName || "");
        checkPaymentStatus(currentUser);
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setFormData((prev) => ({ ...prev, email: "" }));
      setPaymentStatus(null);
      setDbName("");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("SUBMITTING");
    setErrorMessage("");

    if (!user) {
      setStatus("ERROR");
      setErrorMessage("You must be logged in to register.");
      return;
    }

    try {
      const token = await user.getIdToken();

      if (formData.name.length < 3) throw new Error("Name is too short.");
      if (formData.phone.length < 10) throw new Error("Invalid phone number.");

      const response = await fetch(BASE_API_URL + "/alumni/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      if (data.status === PaymentStatus.Confirmed) {
        setPaymentStatus(PaymentStatus.Confirmed);
        setStatus("success");
      } else if (data.paymentUrl) {
        window.open(data.paymentUrl, "_blank");
        setStatus("IDLE");
        setPaymentStatus(PaymentStatus.PendingPayment);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error registering alumni: ", error);
      setStatus("ERROR");
      setErrorMessage(
        error.message || "Something went wrong. Please try again."
      );
    }
  };

  const checkPaymentStatus = async (currentUser = user) => {
    if (!currentUser) return;
    setCheckingStatus(true);
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(BASE_API_URL + "/alumni/status", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 404) {
        setPaymentStatus(null);
        setRegistrationDetails(null);
        return;
      }

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setPaymentStatus(data.status);
        if (data.status === "success" && data.details) {
          setRegistrationDetails(data.details);
        }
      } else {
        console.error("Failed to fetch status:", data);
      }
    } catch (error) {
      console.error("Error checking status:", error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const getDisplayLetter = () => {
    if (dbName) return dbName.charAt(0).toUpperCase();
    if (user && user.email) return user.email.charAt(0).toUpperCase();
    return "A";
  };

  return (
    <div
      className="
        min-h-screen
        bg-[url('/images/bg-alumni.png')]  /* update path if needed */
        bg-fixed bg-cover bg-center bg-no-repeat
        py-24 px-4 sm:px-6 lg:px-8
        text-gray-100
      "
    >
      <div className="max-w-7xl mx-auto">
        <div ref={titleRef} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Alumni Registration – Technika ’26
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left info panel */}
          <div
            ref={contentRef}
            className="bg-black/70 backdrop-blur-sm rounded-2xl shadow-[0_22px_50px_rgba(0,0,0,0.9)] p-8 h-fit border border-white/15"
          >
            <h2 className="text-2xl font-bold mb-6 text-red-300">
              Welcome Back!
            </h2>
            <p className="text-lg text-gray-200 mb-6 leading-relaxed">
              Step back into the BIT Patna vibe and relive the legacy. Technika
              ’26 welcomes all our proud alumni to register and be part of the
              celebration. Join us for a power-packed experience featuring
              exclusive alumni perks, premium access, and a full weekend of
              tech, culture, and nostalgia.
            </p>

            <h3 className="text-xl font-semibold mb-4 text-red-200">
              What you get as an Alumni:
            </h3>
            <ul className="space-y-3 mb-6">
              {[
                "Alumni Gift Pack curated specially for Technika ’26",
                "Full Access to PR Night & DJ Night",
                "Entry to all flagship events & showcases",
                "Free Car Parking throughout the fest",
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></span>
                  <span className="text-gray-200">{item}</span>
                </li>
              ))}
            </ul>

            <p className="text-lg text-gray-200 font-medium italic">
              Reconnect with your batchmates, meet the next generation of
              innovators, and enjoy the fest the way it was meant to be.
              <br />
              Join us and make Technika ’26 unforgettable.
            </p>
          </div>

          {/* Right registration / status panel */}
          <div
            ref={formRef}
            className="bg-black/70 backdrop-blur-sm rounded-2xl shadow-[0_22px_50px_rgba(0,0,0,0.9)] p-8 relative border border-white/15"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center text-white">
              <User className="w-6 h-6 mr-2 text-red-400" />
              Register Now
            </h2>

            {loadingAuth ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
              </div>
            ) : !user ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <p className="text-gray-200 text-center">
                  Please sign in to register.
                </p>
                <button
                  onClick={handleLoginRedirect}
                  className="flex items-center bg-black/70 border border-white/25 text-gray-100 px-6 py-3 rounded-lg shadow-md hover:bg-black/80 transition-all font-medium hover:shadow-[0_0_10px_2px_rgba(255,255,255,0.5)] active:scale-90 cursor-pointer"
                >
                  <LogIn className="w-6 h-6 mr-3" />
                  Sign In / Register
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full mr-3 bg-red-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
                      {getDisplayLetter()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {dbName || user.email.split("@")[0]}
                      </p>
                      <p className="text-xs text-gray-300">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-400 hover:text-red-300 font-medium"
                  >
                    Sign Out
                  </button>
                </div>

                {paymentStatus === PaymentStatus.Confirmed ? (
                  <div className="success-message flex flex-col items-center justify-center h-full text-center p-6">
                    <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                      <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-3">
                      Registration Complete!
                    </h3>
                    <p className="text-gray-200 text-lg mb-6">
                      You are all set for Technika ’26.
                    </p>

                    {registrationDetails && (
                      <div className="bg-white/5 border border-white/10 rounded-xl p-6 w-full max-w-md mb-6 text-left shadow-sm">
                        <h4 className="text-lg font-semibold text-red-200 mb-4 border-b border-white/10 pb-2">
                          Registration Details
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-300">Name:</span>
                            <span className="font-medium text-white">
                              {registrationDetails.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-emerald-900/40 border border-emerald-400/60 rounded-lg px-6 py-3 mb-6">
                      <p className="text-emerald-200 font-semibold">
                        Status:{" "}
                        <span className="uppercase">PAID & VERIFIED</span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {paymentStatus === PaymentStatus.PendingPayment && (
                      <div className="bg-yellow-900/40 border-l-4 border-yellow-400 p-4 mb-6">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <AlertCircle
                              className="h-5 w-5 text-yellow-300"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-yellow-100">
                              Payment is pending. Please complete your payment
                              to finalize registration.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-100 mb-1">
                        Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 border border-white/20 rounded-lg bg-black/70 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                          placeholder="Your Full Name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-100 mb-1">
                        Year of Passing
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="number"
                          name="yearOfPassing"
                          required
                          value={formData.yearOfPassing}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 border border-white/20 rounded-lg bg-black/70 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                          placeholder="YYYY"
                          min="1950"
                          max="2026"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-100 mb-1">
                        Phone No
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 border border-white/20 rounded-lg bg-black/70 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                          placeholder="+91 123 456 7890"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-100 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          readOnly
                          className="w-full pl-10 pr-4 py-2 border border-white/20 rounded-lg bg-black/50 text-gray-400 cursor-not-allowed focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-100 mb-1">
                        Size
                      </label>
                      <div className="relative">
                        <select
                          name="size"
                          required
                          value={formData.size}
                          onChange={handleInputChange}
                          className="w-full pl-4 pr-4 py-2 border border-white/20 rounded-lg bg-black/70 text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                        >
                          <option value="">Select size</option>
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                          <option value="XXL">XXL</option>
                        </select>
                      </div>
                    </div>

                    {status === "ERROR" && (
                      <div className="text-red-300 text-sm bg-red-900/40 p-3 rounded-lg flex items-start border border-red-500/40">
                        <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                        {errorMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === "SUBMITTING"}
                      className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-bold text-lg flex items-center justify-center hover:bg-red-700 transition-colors mt-6 shadow-[0_0_24px_rgba(248,113,113,0.5)] transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                      onMouseEnter={(e) => {
                        if (status !== "SUBMITTING") {
                          gsap.to(e.currentTarget, {
                            scale: 1.02,
                            duration: 0.2,
                          });
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (status !== "SUBMITTING") {
                          gsap.to(e.currentTarget, { scale: 1, duration: 0.2 });
                        }
                      }}
                    >
                      {status === "SUBMITTING" ? (
                        <>
                          <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-6 h-6 mr-2" />
                          Pay Now
                        </>
                      )}
                    </button>

                    <div className="mt-4 pt-4 border-t border-white/15">
                      <button
                        type="button"
                        onClick={checkPaymentStatus}
                        disabled={checkingStatus}
                        className="w-full text-red-300 font-medium text-sm hover:text-red-200 transition-colors flex items-center justify-center"
                      >
                        {checkingStatus ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        )}
                        Refresh Status
                      </button>
                      {paymentStatus &&
                        paymentStatus !== PaymentStatus.Confirmed && (
                          <p className="text-center text-sm mt-2 text-gray-300">
                            Status:{" "}
                            <span className="font-semibold">
                              {paymentStatus}
                            </span>
                          </p>
                        )}
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alumni;
