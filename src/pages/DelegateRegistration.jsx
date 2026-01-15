import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { usePopup } from "../context/usePopup.jsx";
import { useEntitlements } from "../context/useEntitlements.jsx";
import { onAuthStateChanged } from "firebase/auth";
import BrowserWarningModal from "../components/BrowserWarningModal.jsx";
import { doc, getDoc } from "firebase/firestore";

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
    const popup = usePopup();
    const { loading: entitlementsLoading, canAccessDelegate } = useEntitlements();

    const BASE_API_URL = "https://api.technika.co";

    const [authUser, setAuthUser] = useState(null);
    const [authReady, setAuthReady] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        college: "",
    });

    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [checkingStatus, setCheckingStatus] = useState(false);
    const [checkingGroupStatus, setCheckingGroupStatus] = useState(false);
    const [inGroupDelegate, setInGroupDelegate] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [didShowProfileHint, setDidShowProfileHint] = useState(false);

    const showProfileHintOnce = () => {
        if (didShowProfileHint) return;
        popup.info("To update these details, update them in Profile page.");
        setDidShowProfileHint(true);
    };

    useEffect(() => {
        if (entitlementsLoading) return;
        if (canAccessDelegate) return;
        popup.info("BIT Mesra email detected. Delegate pages are locked for BIT students.");
        navigate("/", { replace: true });
    }, [canAccessDelegate, entitlementsLoading, navigate, popup]);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setAuthUser(u || null);
            setAuthReady(true);
        });
        return () => unsub();
    }, []);

    const PaymentStatus = {
        Confirmed: "confirmed",
        Pending: "pending",
        Failed: "failed",
    };

    const checkStatus = async () => {
        const user = auth.currentUser;
        if (!user) return;

        setCheckingStatus(true);
        try {
            const token = await user.getIdToken();
            const response = await fetch(`${BASE_API_URL}/delegate/status/user`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                const status = (data.status || "").toLowerCase();

                if (status === "success" || status === "paid" || status === "confirmed") {
                    setSubmitted(true);
                    setPaymentStatus(PaymentStatus.Confirmed);
                    setFormData({
                        name: formData.name || data.name || "",
                        email: formData.email || data.email || user.email || "",
                        phone: formData.phone || data.phone || "",
                        college: formData.college || data.college || "",
                    });
                } else if (status === "pending" || status === "pending_payment") {
                    setSubmitted(true);
                    setPaymentStatus(PaymentStatus.Pending);
                    setFormData({
                        name: formData.name || data.name || "",
                        email: formData.email || data.email || user.email || "",
                        phone: formData.phone || data.phone || "",
                        college: formData.college || data.college || "",
                    });
                } else if (
                    status === "failed" ||
                    status === "payment_failed" ||
                    status === "payment failed" ||
                    status === "cancelled" ||
                    status === "canceled"
                ) {
                    setSubmitted(true);
                    setPaymentStatus(PaymentStatus.Failed);
                    setFormData({
                        name: formData.name || data.name || "",
                        email: formData.email || data.email || user.email || "",
                        phone: formData.phone || data.phone || "",
                        college: formData.college || data.college || "",
                    });
                }
            }
        } catch (e) {
            console.error("Status check failed", e);
        } finally {
            setCheckingStatus(false);
        }
    };

    useEffect(() => {
        if (!authReady) return;
        if (!authUser) return;

        const hydrateProfile = async () => {
            try {
                const snap = await getDoc(doc(db, "auth", authUser.uid));
                const data = snap.exists() ? snap.data() : {};
                setFormData((prev) => ({
                    ...prev,
                    name: String(data?.name || prev.name || authUser.displayName || "").trim(),
                    email: String(data?.email || authUser.email || prev.email || "").trim(),
                    phone: String(data?.phone || prev.phone || "").trim(),
                    college: String(data?.college || prev.college || "").trim(),
                }));
            } catch {
                setFormData((prev) => ({
                    ...prev,
                    email: String(authUser.email || prev.email || "").trim(),
                }));
            }
        };

        hydrateProfile();
        checkStatus();
        checkGroupDelegateStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authReady, authUser]);

    const checkGroupDelegateStatus = async () => {
        const user = auth.currentUser;
        if (!user) {
            setInGroupDelegate(false);
            return;
        }

        setCheckingGroupStatus(true);
        try {
            const token = await user.getIdToken();
            const response = await fetch(`${BASE_API_URL}/delegate/status/user`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 404) {
                setInGroupDelegate(false);
                return;
            }

            if (!response.ok) {
                setInGroupDelegate(false);
                return;
            }

            const data = await response.json().catch(() => ({}));
            setInGroupDelegate(Boolean(data?.isOwner || data?.isMember));
        } catch (e) {
            console.error("Group delegate status check failed", e);
            setInGroupDelegate(false);
        } finally {
            setCheckingGroupStatus(false);
        }
    };

    useEffect(() => {
        if (authReady && !authUser) {
            setInGroupDelegate(false);
        }
    }, [authReady, authUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (inGroupDelegate) {
            popup.info("You are already a part of group delegate.");
            return;
        }

        setLoading(true);

        try {
            const missingProfile =
                !String(formData.name || "").trim() ||
                !String(formData.phone || "").trim() ||
                String(formData.phone || "").trim().length < 10 ||
                !String(formData.college || "").trim();

            if (missingProfile) {
                popup.info("Please update your Profile (name, phone, college) before registering.");
                navigate("/profile");
                return;
            }

            const user = auth.currentUser;
            if (!user) {
                popup.error("Please login first.");
                navigate("/login");
                return;
            }

            const token = await user.getIdToken();
            const response = await fetch(`${BASE_API_URL}/delegate/register/self`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: String(formData.name).trim(),
                    email: String(formData.email).trim(),
                    phone: String(formData.phone).trim(),
                    college: String(formData.college).trim(),
                }),
            });

            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                popup.error(data.message || "Registration failed. Please try again.");
                return;
            }

            setSubmitted(true);
        } catch (error) {
            console.error("Error registering delegate: ", error);
            popup.error("Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        if (!agreed) {
            popup.error("Please agree to the Terms and Conditions & Refund Policy.");
            return;
        }

        // Try to open in a new tab. If the browser blocks popups (common in in-app browsers),
        // fall back to redirecting in the same tab so payment isn't blocked.
        const paymentTab = window.open("about:blank", "_blank");
        const closePaymentTab = () => {
            if (paymentTab && !paymentTab.closed) paymentTab.close();
        };
        try {
            if (paymentTab) paymentTab.opener = null;
        } catch {
            // ignore
        }
        const willUseNewTab = Boolean(paymentTab);
        if (!willUseNewTab) {
            popup.info("Popup blocked in your browser. Continuing to payment in this tab…");
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
                    college: String(formData.college),
                    callbackUrl: window.location.href,
                }),
            });

            const data = await response.json();
            console.log("Payment response:", data);

            if (!response.ok) {
                popup.error(`Payment failed: ${data.message || response.statusText}`);
                closePaymentTab();
                return;
            }

            const paymentUrl = data.paymentUrl || data.url;
            if (paymentUrl) {
                if (willUseNewTab) {
                    try {
                        if (paymentTab && !paymentTab.closed) {
                            paymentTab.location.href = paymentUrl;
                            return;
                        }
                    } catch {
                        closePaymentTab();
                    }
                }

                closePaymentTab();
                window.location.href = paymentUrl;
                return;
            }

            closePaymentTab();
            popup.error(`Payment failed: ${data.message || "No payment URL returned"}`);
        } catch (error) {
            console.error("Payment Error:", error);
            closePaymentTab();
            popup.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <BrowserWarningModal />
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
                {!authReady ? (
                    <div className="min-h-[40vh] flex items-center justify-center">
                        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white/80">
                            <span className="inline-block h-5 w-5 rounded-full border-2 border-white/30 border-t-white/80 animate-spin" />
                            Checking login...
                        </div>
                    </div>
                ) : !authUser ? (
                    <div className="min-h-[40vh] flex items-center justify-center">
                        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-black/40 p-6 text-white/80">
                            <div className="text-lg font-semibold text-white mb-2">You’re not logged in</div>
                            <div className="text-white/60 mb-4">Please sign in to register for Delegate Pass.</div>
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white hover:bg-white/20 transition"
                            >
                                Go to Login
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
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
                        {paymentStatus === PaymentStatus.Confirmed ? (
                            <div className="text-center">
                                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500 shadow-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <h3 className="mb-3 text-3xl font-bold text-white">Registration Complete!</h3>
                                <p className="mb-8 text-lg text-gray-200">You are all set for the event.</p>

                                <div className="space-y-6 text-left">
                                    <DetailRow label="Name" value={formData.name} />
                                    <DetailRow label="Email" value={formData.email} />
                                    <DetailRow label="Ph No." value={formData.phone} />
                                </div>

                                <div className="mt-8 rounded-lg border border-emerald-400/60 bg-emerald-900/40 px-6 py-3">
                                    <p className="font-semibold text-emerald-200">Status: <span className="uppercase">PAID & VERIFIED</span></p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 className="mb-8 text-center text-2xl uppercase tracking-widest text-white">
                                    User Details
                                </h2>

                                {paymentStatus === PaymentStatus.Pending && (
                                    <div className="mb-6 border-l-4 border-yellow-400 bg-yellow-900/40 p-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm text-yellow-100">
                                                    Payment is pending. Please complete your payment.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-6">
                                    <DetailRow label="Name" value={formData.name} />
                                    <DetailRow label="Email" value={formData.email} />
                                    <DetailRow label="Ph No." value={formData.phone} />
                                    <div className="flex items-start gap-4 font-mono">
                                        <div className="min-w-[80px] shrink-0 border border-white px-2 py-1 text-sm text-white">
                                            Inst.
                                        </div>
                                        <div className="relative flex-1 break-words py-1 text-base text-white">
                                            <div className="min-h-[1.5em] border-b border-white pb-1">{formData.college}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 border-t border-white pt-6">
                                    <div className="mb-2 flex items-center justify-between text-lg font-mono md:text-xl">
                                        <span>Delegate Reg. Fee:</span>
                                        <span>₹499</span>
                                    </div>
                                    <div className="my-2 h-px w-full bg-white/20"></div>
                                    <div className="flex items-center justify-between font-mono text-xl font-bold md:text-2xl">
                                        <span>Total Amount Payable:</span>
                                        <span>₹499</span>
                                    </div>
                                    <p className="mb-6 mt-1 text-[10px] uppercase tracking-wider text-gray-400">
                                        (incl. of convenience fee & GST)
                                    </p>

                                    <div className="mb-6 flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            checked={agreed}
                                            onChange={(e) => setAgreed(e.target.checked)}
                                            className="h-5 w-5 cursor-pointer appearance-none rounded-none border-2 border-white bg-transparent accent-white checked:bg-white checked:text-black focus:ring-0 focus:ring-offset-0"
                                        />
                                        <label htmlFor="terms" className="cursor-pointer select-none text-xs text-gray-300 md:text-sm">
                                            I agree to the <span className="underline decoration-white underline-offset-2">Terms and Conditions</span> & <span className="underline decoration-white underline-offset-2">Refund Policy</span>.
                                        </label>
                                    </div>

                                    <button
                                        className={`w-full font-mono text-lg font-bold uppercase tracking-widest transition-colors py-4 ${loading ? 'cursor-not-allowed bg-gray-400 opacity-70' : 'bg-white hover:bg-gray-200 text-black'}`}
                                        onClick={handlePayment}
                                        disabled={loading}
                                    >
                                        {loading ? "Processing..." : "Proceed to Pay"}
                                    </button>

                                    <button
                                        className="mt-4 flex w-full items-center justify-center text-sm font-medium text-white/70 transition-colors hover:text-white"
                                        onClick={checkStatus}
                                        disabled={checkingStatus}
                                    >
                                        {checkingStatus ? (
                                            <span className="animate-pulse">Checking...</span>
                                        ) : (
                                            <>
                                                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                Refresh Status
                                            </>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="relative space-y-6 rounded-[28px] border border-white/12 bg-black/55 p-6 md:p-10 shadow-[0_40px_120px_rgba(255,0,48,0.25)] backdrop-blur-xl">
                        {(checkingGroupStatus || inGroupDelegate) && (
                            <div className="rounded-2xl border border-white/12 bg-white/5 p-4 text-sm text-white/80 backdrop-blur-lg">
                                {checkingGroupStatus ? (
                                    <span className="uppercase tracking-[0.25em] text-white/60">Checking group status...</span>
                                ) : (
                                    <>
                                        <span className="font-semibold uppercase tracking-[0.25em] text-white/60">Notice:</span>{" "}
                                        You are already a part of group delegate.
                                    </>
                                )}
                            </div>
                        )}

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
                                readOnly
                                aria-readonly="true"
                                onFocus={showProfileHintOnce}
                                onClick={showProfileHintOnce}
                                placeholder="Update via Profile"
                                disabled={inGroupDelegate}
                                className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-white/60 placeholder-white/30 cursor-not-allowed focus:outline-none transition"
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
                                readOnly
                                onFocus={showProfileHintOnce}
                                onClick={showProfileHintOnce}
                                className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-white/50 placeholder-white/30 cursor-not-allowed focus:outline-none transition"
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
                                readOnly
                                aria-readonly="true"
                                onFocus={showProfileHintOnce}
                                onClick={showProfileHintOnce}
                                placeholder="Update via Profile"
                                disabled={inGroupDelegate}
                                className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-white/60 placeholder-white/30 cursor-not-allowed focus:outline-none transition"
                                required
                            />
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
                                readOnly
                                aria-readonly="true"
                                onFocus={showProfileHintOnce}
                                onClick={showProfileHintOnce}
                                placeholder="Update via Profile"
                                disabled={inGroupDelegate}
                                className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-white/60 placeholder-white/30 cursor-not-allowed focus:outline-none transition"
                                required
                            />
                        </div>

                        <div className="text-xs text-white/50">
                            To change your details, update them in Profile.
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading || checkingGroupStatus || inGroupDelegate}
                                className={`w-full rounded-full bg-white py-4 text-lg font-semibold uppercase tracking-[0.3em] text-black transition-all duration-300 hover:-translate-y-1 hover:bg-white/90 ${loading ? "pointer-events-none opacity-60" : ""
                                    }`}
                            >
                                {checkingGroupStatus
                                    ? "Checking..."
                                    : inGroupDelegate
                                    ? "Already In Group Delegate"
                                    : loading
                                    ? "Registering..."
                                    : "Register Now"}
                            </button>
                        </div>
                    </form>
                )}
                    </>
                )}
            </div>

            <div className="h-12" />
        </div>
        </>
    );
};

export default DelegateRegistration;
