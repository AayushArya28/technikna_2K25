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
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

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
    size: "",
    merchName: "",
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
            const q = query(authCollection, where("email", "==", currentUser.email));
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
        // MODIFICATION: Open in new tab instead of redirecting
        window.open(data.paymentUrl, "_blank");
        
        // Update UI to show pending state so user knows what's happening
        setStatus("IDLE"); // Stop spinner
        setPaymentStatus(PaymentStatus.PendingPayment); // Show yellow alert
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
    <div className="min-h-screen bg-[url('/images/bg-contus.png')] bg-fixed bg-cover bg-center bg-no-repeat py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div ref={titleRef} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">
            Alumni Registration – Technika ’26
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div
            ref={contentRef}
            className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-8 h-fit"
          >
            <h2 className="text-2xl font-bold mb-6 text-blue-900">
              Welcome Back!
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Step back into the BIT Patna vibe and relive the legacy. Technika
              ’26 welcomes all our proud alumni to register and be part of the
              celebration. Join us for a power-packed experience featuring
              exclusive alumni perks, premium access, and a full weekend of
              tech, culture, and nostalgia.
            </p>

            <h3 className="text-xl font-semibold mb-4 text-blue-800">
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
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>

            <p className="text-lg text-gray-700 font-medium italic">
              Reconnect with your batchmates, meet the next generation of
              innovators, and enjoy the fest the way it was meant to be.
              <br />
              Join us and make Technika ’26 unforgettable.
            </p>
          </div>

          <div
            ref={formRef}
            className="bg-white rounded-lg shadow-xl p-8 relative"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-900">
              <User className="w-6 h-6 mr-2 text-blue-600" />
              Register Now
            </h2>

            {loadingAuth ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : !user ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <p className="text-gray-600 text-center">
                  Please sign in to register.
                </p>
                <button
                  onClick={handleLoginRedirect}
                  className="flex items-center bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg shadow-sm hover:bg-gray-50 transition-all font-medium"
                >
                  <LogIn className="w-6 h-6 mr-3" />
                  Sign In / Register
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full mr-3 bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
                      {getDisplayLetter()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {dbName || user.email.split("@")[0]}
                      </p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Sign Out
                  </button>
                </div>

                {paymentStatus === PaymentStatus.Confirmed ? (
                  <div className="success-message flex flex-col items-center justify-center h-full text-center p-6">
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                      <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">
                      Registration Complete!
                    </h3>
                    <p className="text-gray-600 text-lg mb-6">
                      You are all set for Technika ’26.
                    </p>

                    {registrationDetails && (
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 w-full max-w-md mb-6 text-left shadow-sm">
                        <h4 className="text-lg font-semibold text-blue-900 mb-4 border-b border-blue-200 pb-2">
                          Registration Details
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Name:</span>
                            <span className="font-medium text-gray-900">
                              {registrationDetails.name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Merch Name:</span>
                            <span className="font-medium text-gray-900">
                              {registrationDetails.merchName}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">T-Shirt Size:</span>
                            <span className="font-medium text-gray-900">
                              {registrationDetails.size}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-green-50 border border-green-200 rounded-lg px-6 py-3 mb-6">
                      <p className="text-green-800 font-semibold">
                        Status:{" "}
                        <span className="uppercase">PAID & VERIFIED</span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {paymentStatus === PaymentStatus.PendingPayment && (
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <AlertCircle
                              className="h-5 w-5 text-yellow-400"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                              Payment is pending. Please complete your payment
                              to finalize registration.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          placeholder="Your Full Name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          placeholder="YYYY"
                          min="1950"
                          max="2026"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          placeholder="+91 123 456 7890"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          T-Shirt Size
                        </label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name on Merch
                        </label>
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

                    {status === "ERROR" && (
                      <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg flex items-start">
                        <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                        {errorMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === "SUBMITTING"}
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-bold text-lg flex items-center justify-center hover:bg-blue-700 transition-colors mt-6 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
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

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={checkPaymentStatus}
                        disabled={checkingStatus}
                        className="w-full text-blue-600 font-medium text-sm hover:text-blue-800 transition-colors flex items-center justify-center"
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
                          <p className="text-center text-sm mt-2 text-gray-600">
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