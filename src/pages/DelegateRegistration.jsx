
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";

const DetailRow = ({ label, value }) => (
    <div className="flex items-start gap-4 font-mono">
        <div className="min-w-[80px] border border-white px-2 py-1 text-sm text-white shrink-0">
            {label}
        </div>
        <div className="flex-1 border-b border-white py-1 text-base text-white break-words">
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
    const [agreed, setAgreed] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    React.useEffect(() => {
        const checkStatus = async () => {
            const user = auth.currentUser;
            if (!user) return;

            try {
                const token = await user.getIdToken();
                const BASE_API_URL = "https://api.technika.co";
                const response = await fetch(`${BASE_API_URL}/delegate/status-self`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.status === "success" || data.status === "paid") {
                        setSubmitted(true);
                        setFormData({
                            name: data.name || "",
                            email: data.email || user.email || "",
                            phone: data.phone || "",
                            college: data.college || "",
                            address: data.address || "",
                        });
                        alert("Your registration is confirmed!");
                    }
                }
            } catch (e) {
                console.error("Status check failed", e);
            }
        };

        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) checkStatus();
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Optimistically calculate or set state, but we really should wait for server to confirm?
            // Current flow uses client-side write to Firestore then redirection.
            await addDoc(collection(db, "delegate_single"), {
                ...formData,
                timestamp: serverTimestamp(),
            });

            setSubmitted(true);
        } catch (error) {
            console.error("Error registering delegate: ", error);
            if (error.code === "permission-denied") {
                alert(
                    "Registration failed: Permission denied. Please check your Firebase Firestore rules."
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
        if (!agreed) {
            alert("Please agree to the Terms and Conditions & Refund Policy.");
            return;
        }
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
                    email: String(formData.email),
                    phone: String(formData.phone).trim(),
                    callbackUrl: window.location.href,
                }),
            });

            const data = await response.json();
            console.log("Payment response:", data);

            if (!response.ok) {
                alert(`Payment failed: ${data.message || response.statusText}`);
                return;
            }

            if (data.paymentUrl) {
                window.location.href = data.paymentUrl;
            } else if (data.url) {
                window.location.href = data.url;
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
            {/* Background Decorative Elements */}
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

            <div className="relative z-10 w-full max-w-3xl">
                {!submitted && (
                    <div className="mb-8 flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => navigate("/delegate")}
                            className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-lg text-white transition hover:bg-white/20"
                            aria-label="Back to delegate overview"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:-translate-x-1"><path d="M15 5L8 12L15 19" /></svg>
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
                )}

                {submitted ? (
                    <div className="mx-auto max-w-lg rounded-[20px] border-2 border-white bg-black p-6 font-mono text-white shadow-[0_0_30px_rgba(255,255,255,0.1)] md:p-10">
                        <h2 className="mb-8 text-center text-2xl uppercase tracking-widest text-white">
                            User Details
                        </h2>

                        <div className="space-y-6">
                            <DetailRow label="Name" value={formData.name} />
                            <DetailRow label="Email" value={formData.email} />
                            <DetailRow label="Ph No." value={formData.phone} />
                            <div className="flex items-start gap-4 font-mono">
                                <div className="min-w-[80px] border border-white px-2 py-1 text-sm text-white shrink-0">
                                    Inst.
                                </div>
                                <div className="flex-1 py-1 text-base text-white break-words relative">
                                    {/* The image shows 'Inst.' and 'Addr.' contents might wrap but also have underline. 
                        A consistent simple border-b works best. */}
                                    <div className="border-b border-white pb-1 min-h-[1.5em]">{formData.college}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 font-mono">
                                <div className="min-w-[80px] border border-white px-2 py-1 text-sm text-white shrink-0">
                                    Addr.
                                </div>
                                <div className="flex-1 py-1 text-base text-white break-words relative">
                                    <div className="border-b border-white pb-1 min-h-[1.5em]">{formData.address}</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 border-t border-white pt-6">
                            <div className="flex justify-between items-center text-lg md:text-xl font-mono mb-2">
                                <span>Delegate Reg. Fee:</span>
                                <span>₹699</span>
                            </div>
                            <div className="w-full h-px bg-white/20 my-2"></div>
                            <div className="flex justify-between items-center text-xl md:text-2xl font-bold font-mono">
                                <span>Total Amount Payable:</span>
                                <span>₹699</span>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider mb-6">
                                (incl. of convenience fee & GST)
                            </p>

                            <div className="flex items-center gap-3 mb-6">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                    className="w-5 h-5 border-2 border-white bg-transparent rounded-none checked:bg-white checked:text-black focus:ring-0 focus:ring-offset-0 cursor-pointer accent-white"
                                />
                                <label htmlFor="terms" className="text-xs md:text-sm text-gray-300 cursor-pointer select-none">
                                    I agree to the <span className="underline decoration-white underline-offset-2">Terms and Conditions</span> & <span className="underline decoration-white underline-offset-2">Refund Policy</span>.
                                </label>
                            </div>

                            <button
                                className={`w-full bg-white text-black font-mono font-bold text-lg py-4 hover:bg-gray-200 transition-colors uppercase tracking-widest ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                onClick={handlePayment}
                                disabled={loading}
                            >
                                {loading ? "Processing..." : "Proceed to Pay"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="relative space-y-6 rounded-[28px] border border-white/12 bg-black/55 p-6 md:p-10 shadow-[0_40px_120px_rgba(255,0,48,0.25)] backdrop-blur-xl">
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
                                className={`w-full rounded-full bg-white py-4 text-lg font-semibold uppercase tracking-[0.3em] text-black transition-all duration-300 hover:-translate-y-1 hover:bg-white/90 ${loading ? "pointer-events-none opacity-60" : ""
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
