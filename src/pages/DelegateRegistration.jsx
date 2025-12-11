import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";

const DetailRow = ({ label, value, multiline }) => (
  <div className={`flex ${multiline ? "flex-col gap-2" : "items-center gap-4"} rounded-2xl bg-white/5 px-4 py-3 text-white`}>
    <div className="min-w-[120px] text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
      {label}
    </div>
    <div
      className={`text-base font-medium text-white/90 whitespace-pre-line ${
        multiline ? "" : "flex-1 border-b border-white/10 pb-1"
      }`}
    >
      {value}
    </div>
  </div>
);

const DelegateRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    college: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "delegate_single"), {
        ...formData,
        timestamp: serverTimestamp(),
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Error registering delegate: ", error);
      if (error.code === "permission-denied") {
        alert(
          "Registration failed: Permission denied. Please check your Firebase Firestore rules to allow writing to the 'delegate_single' collection."
        );
      } else {
        alert("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const BASE_API_URL = "https://api.technika.co";

  const handlePayment = async () => {
    setLoading(true);
    const endpoint = `${BASE_API_URL}/book/2399`;

    try {
      const headers = {
        "Content-Type": "application/json",
      };

      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: String(formData.name),
          phone: String(formData.phone),
          callbackUrl: window.location.href,
        }),
      });

      const data = await response.json();

      if (data.paymentUrl) {
        window.open(data.paymentUrl, "_blank");
      } else if (data.url) {
        window.open(data.url, "_blank");
      } else {
        alert(`Payment failed: ${data.message || "No payment URL returned"}`);
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Something went wrong. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-b from-black via-[#140109] to-black px-6 pb-20 pt-32 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-10 left-10 h-64 w-64 rounded-full bg-[#ff0030]/15 blur-[120px]" />
        <div className="absolute bottom-0 right-16 h-72 w-72 rounded-full bg-[#4100ff]/10 blur-[140px]" />
        <div className="absolute top-[12%] right-[12%] text-8xl font-black opacity-[0.06] select-none">
          DELEGATE
        </div>
        <div className="absolute bottom-[16%] left-[14%] text-7xl font-black opacity-[0.05] select-none">
          *
        </div>
      </div>

      <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[28px] border border-white/12 bg-black/55 p-6 md:p-10 shadow-[0_40px_120px_rgba(255,0,48,0.25)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,0,48,0.18),_transparent_55%)]" />

        <div className="relative mb-8 flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/delegate")}
            className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-lg text-white transition hover:bg-white/20"
            aria-label="Back to delegate overview"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-x-1"
            >
              <path
                d="M15 5L8 12L15 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div>
            <h2 className="text-3xl font-semibold tracking-[0.25em] text-white drop-shadow-[0_0_18px_rgba(255,0,48,0.55)] md:text-4xl">
              Delegate Registration
            </h2>
            <p className="mt-2 text-sm font-medium uppercase tracking-[0.3em] text-white/60">
              register as an individual delegate
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-white/20 bg-black/60 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,0,48,0.24),_transparent_60%)]" />

            <div className="relative z-10 space-y-6">
              <h2 className="text-center text-2xl font-semibold uppercase tracking-[0.4em] text-white/90 md:text-3xl">
                Delegate Details
              </h2>

              <div className="space-y-5">
                <DetailRow label="Name" value={formData.name} />
                <DetailRow label="Email" value={formData.email} />
                <DetailRow label="Phone" value={formData.phone} />
                <DetailRow label="Institution" value={formData.college} />
                <DetailRow label="Address" value={formData.address} multiline />
              </div>

              <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-5">
                <div className="flex items-center justify-between text-lg font-medium md:text-xl">
                  <span>Delegate Registration Fee</span>
                  <span className="font-semibold text-[#ff5b6b]">INR 699</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xl font-bold md:text-2xl">
                  <span>Total Payable</span>
                  <span>INR 699</span>
                </div>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/50">
                  inclusive of convenience & gst charges
                </p>
              </div>

              <button
                className="w-full rounded-full bg-white py-4 text-base font-semibold uppercase tracking-[0.3em] text-black transition hover:bg-white/90"
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? "Processing..." : "Proceed to Pay"}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-xs font-semibold uppercase tracking-[0.35em] text-white/60"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-white placeholder-white/30 focus:border-[#ff1744] focus:outline-none focus:ring-2 focus:ring-[#ff1744]/50 transition"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-[0.35em] text-white/60"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-white placeholder-white/30 focus:border-[#ff1744] focus:outline-none focus:ring-2 focus:ring-[#ff1744]/50 transition"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="block text-xs font-semibold uppercase tracking-[0.35em] text-white/60"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-white placeholder-white/30 focus:border-[#ff1744] focus:outline-none focus:ring-2 focus:ring-[#ff1744]/50 transition"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="address"
                className="block text-xs font-semibold uppercase tracking-[0.35em] text-white/60"
              >
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your full address"
                rows="3"
                className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-white placeholder-white/30 focus:border-[#ff1744] focus:outline-none focus:ring-2 focus:ring-[#ff1744]/50 transition resize-none"
                required
              ></textarea>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="college"
                className="block text-xs font-semibold uppercase tracking-[0.35em] text-white/60"
              >
                College / Institute
              </label>
              <input
                type="text"
                id="college"
                name="college"
                value={formData.college}
                onChange={handleChange}
                placeholder="Enter your college name"
                className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-white placeholder-white/30 focus:border-[#ff1744] focus:outline-none focus:ring-2 focus:ring-[#ff1744]/50 transition"
                required
              />
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-full bg-white py-4 text-lg font-semibold uppercase tracking-[0.3em] text-black transition-all duration-300 hover:-translate-y-1 hover:bg-white/90 ${
                  loading ? "pointer-events-none opacity-60" : ""
                }`}
              >
                {loading ? "Registering..." : "Register Now"}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="h-12" />
    </div>
  );
};

export default DelegateRegistration;
