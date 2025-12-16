import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BrowserWarningModal from "../components/BrowserWarningModal.jsx";
import { auth } from "../firebase";
import { usePopup } from "../context/usePopup.jsx";

const Delegate = () => {
    const navigate = useNavigate();
    const popup = usePopup();

    const BASE_API_URL = "https://api.technika.co";
    const [checkingAccess, setCheckingAccess] = useState(true);
    const [groupStatus, setGroupStatus] = useState({ isOwner: false, isMember: false });
    const [selfStatus, setSelfStatus] = useState({ registered: false });

    const inGroup = useMemo(() => Boolean(groupStatus.isOwner || groupStatus.isMember), [groupStatus]);
    const inSelf = useMemo(() => Boolean(selfStatus.registered), [selfStatus]);

    useEffect(() => {
        const unsub = auth.onAuthStateChanged(async (user) => {
            setCheckingAccess(true);
            try {
                if (!user) {
                    setGroupStatus({ isOwner: false, isMember: false });
                    setSelfStatus({ registered: false });
                    return;
                }

                const token = await user.getIdToken();
                const headers = { Authorization: `Bearer ${token}` };

                // Group status: 404 means not in any room
                try {
                    const resp = await fetch(`${BASE_API_URL}/delegate/status/user`, { headers });
                    if (resp.status === 404) {
                        setGroupStatus({ isOwner: false, isMember: false });
                    } else if (resp.ok) {
                        const data = await resp.json().catch(() => ({}));
                        setGroupStatus({
                            isOwner: Boolean(data?.isOwner),
                            isMember: Boolean(data?.isMember),
                        });
                    } else {
                        setGroupStatus({ isOwner: false, isMember: false });
                    }
                } catch {
                    setGroupStatus({ isOwner: false, isMember: false });
                }

                // Self status: if backend returns a status that indicates pending/paid/etc, treat as registered
                try {
                    const resp = await fetch(`${BASE_API_URL}/delegate/status-self`, { headers });
                    if (resp.ok) {
                        const data = await resp.json().catch(() => ({}));
                        const status = String(data?.status || "").toLowerCase();
                        const registered = ["success", "paid", "confirmed", "pending", "pending_payment"].includes(status);
                        setSelfStatus({ registered });
                    } else {
                        setSelfStatus({ registered: false });
                    }
                } catch {
                    setSelfStatus({ registered: false });
                }
            } finally {
                setCheckingAccess(false);
            }
        });

        return () => unsub();
    }, []);
    const highlights = [
        {
            title: "Immersive Audience Access",
            description: "Priority seating and front-row viewership across every Technika flagship showcase.",
        },
        {
            title: "Discounted Event Entries",
            description: "Locked-in lower pricing across all competitive and cultural event registrations.",
        },
        {
            title: "Seamless Transit",
            description: "Delegates-only bus transportation on designated BIT Patna routes throughout the fest.",
        },
        {
            title: "Stay On Campus",
            description: "Eligibility for in-campus accommodation with curated delegate hosting support.",
        },
        {
            title: "After-Hours Entry",
            description: "Complimentary access to every official after-party and late-night Technika experience.",
        },
        {
            title: "Complimentary Parking",
            description: "Reserved parking privileges for personal vehicles across Technika venues.",
        },
    ];

    return (
        <>
            <BrowserWarningModal />
            <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-b from-black via-[#140109] to-black px-6 pb-20 pt-32 text-white">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-24 right-16 h-[420px] w-[420px] rounded-full bg-[#ff0030]/12 blur-[150px]" />
                <div className="absolute bottom-0 left-8 h-80 w-80 rounded-full bg-[#4100ff]/12 blur-[150px]" />
                <div className="absolute top-[15%] left-[10%] text-9xl font-black uppercase tracking-[0.3em] text-white/5 select-none">
                    Delegate
                </div>
                <div className="absolute bottom-[18%] right-[12%] text-7xl font-black text-white/5 select-none">
                    *
                </div>
            </div>

            <div className="relative z-10 w-full max-w-5xl space-y-10">
                <div className="relative overflow-hidden rounded-[32px] border border-white/12 bg-black/55 p-8 md:p-12 shadow-[0_42px_120px_rgba(255,0,48,0.28)] backdrop-blur-xl">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,0,48,0.22),_transparent_60%)]" />
                    <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-4">
                            <span className="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.38em] text-white/70">
                                Technika 2K25
                            </span>
                            <h1 className="text-4xl font-semibold uppercase tracking-[0.22em] text-white md:text-5xl">
                                Delegate Access Pass
                            </h1>
                            <p className="max-w-xl text-sm text-white/70 md:text-base">
                                Step into the premium lane for Technika. One pass unlocks immersive showcases, curated networking, and effortless movement across campus.
                            </p>
                        </div>
                        <div className="group relative w-full max-w-xs overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-6 text-center md:text-right transition will-change-transform hover:-translate-y-1 hover:border-white/30 hover:bg-white/10 hover:shadow-[0_22px_80px_rgba(255,0,48,0.18)]">
                            <div className="pointer-events-none absolute inset-[-70%] opacity-30 blur-2xl animate-[spin_10s_linear_infinite] bg-[conic-gradient(from_90deg,rgba(255,23,68,0.0),rgba(255,23,68,0.35),rgba(91,44,255,0.35),rgba(255,23,68,0.0))]" />
                            <div className="pointer-events-none absolute inset-0 bg-black/15" />
                            <div className="pointer-events-none absolute -top-20 right-0 h-48 w-48 rounded-full bg-[#ff0030]/10 blur-[120px] transition group-hover:bg-[#ff0030]/20" />
                            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                                Investment
                            </div>
                            <div className="mt-3 text-3xl font-semibold text-white">INR 699</div>
                            <div className="mt-2 text-xs uppercase tracking-[0.35em] text-white/60">
                                inclusive of gst & fees
                            </div>
                            <div className="mt-6 text-left text-sm text-white/70 md:text-right">
                                <span className="font-semibold text-white">Bonus:</span> concierge assistance and curated community meetups throughout Technika.
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                    {highlights.map((item) => (
                        <div
                            key={item.title}
                            className="group relative overflow-hidden rounded-3xl border border-white/12 bg-white/5 p-6 backdrop-blur-lg transition will-change-transform hover:-translate-y-1 hover:border-white/30 hover:bg-white/10 hover:shadow-[0_18px_70px_rgba(255,0,48,0.12)]"
                        >
                            <div className="pointer-events-none absolute inset-[-70%] opacity-25 blur-2xl animate-[spin_12s_linear_infinite] bg-[conic-gradient(from_90deg,rgba(255,23,68,0.0),rgba(255,23,68,0.30),rgba(91,44,255,0.30),rgba(255,23,68,0.0))]" />
                            <div className="pointer-events-none absolute inset-0 bg-black/10" />
                            <div className="pointer-events-none absolute -top-16 right-0 h-36 w-36 rotate-12 rounded-full bg-[#ff0030]/10 blur-[120px] transition group-hover:bg-[#ff0030]/20" />
                            <div className="relative flex items-start gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-base font-semibold uppercase tracking-[0.3em] text-white/80">
                                    *
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                                    <p className="text-sm text-white/70">{item.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-black/60 p-6 md:p-10 backdrop-blur-xl">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(70,0,255,0.2),_transparent_60%)]" />
                    <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-3">
                            <h2 className="text-2xl font-semibold uppercase tracking-[0.3em] text-white md:text-3xl">
                                Choose Your Flow
                            </h2>
                            <p className="max-w-xl text-sm text-white/70 md:text-base">
                                Register solo in minutes or pool in as a crew. Either way, you unlock the same premium delegate advantages from day one.
                            </p>
                        </div>
                        <div className="flex w-full flex-col gap-4 md:w-auto md:flex-row">
                            <div className="group relative overflow-hidden flex flex-col gap-3 rounded-3xl border border-white/12 bg-white/5 p-5 backdrop-blur-lg transition will-change-transform hover:-translate-y-1 hover:border-white/30 hover:bg-white/10 hover:shadow-[0_18px_70px_rgba(255,0,48,0.12)]">
                                <div className="pointer-events-none absolute inset-[-70%] opacity-25 blur-2xl animate-[spin_12s_linear_infinite] bg-[conic-gradient(from_90deg,rgba(255,23,68,0.0),rgba(255,23,68,0.30),rgba(91,44,255,0.30),rgba(255,23,68,0.0))]" />
                                <div className="pointer-events-none absolute inset-0 bg-black/10" />
                                <button
                                    type="button"
                                    disabled={checkingAccess || inGroup}
                                    onClick={() => {
                                        if (inGroup) {
                                            popup.info("You are already a part of group delegate.");
                                            return;
                                        }
                                        navigate("/delegate-registration");
                                    }}
                                    className="rounded-full bg-white px-8 py-4 text-sm font-semibold uppercase tracking-[0.35em] text-black transition hover:-translate-y-1 hover:bg-white/90"
                                >
                                    Individual Pass
                                </button>
                                <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                                    {inGroup ? "already in group delegate" : checkingAccess ? "checking status" : "instant checkout"}
                                </p>
                            </div>
                            <div className="group relative overflow-hidden flex flex-col gap-3 rounded-3xl border border-white/12 bg-white/5 p-5 backdrop-blur-lg transition will-change-transform hover:-translate-y-1 hover:border-white/30 hover:bg-white/10 hover:shadow-[0_18px_70px_rgba(255,0,48,0.12)]">
                                <div className="pointer-events-none absolute inset-[-70%] opacity-25 blur-2xl animate-[spin_12s_linear_infinite] bg-[conic-gradient(from_90deg,rgba(255,23,68,0.0),rgba(255,23,68,0.30),rgba(91,44,255,0.30),rgba(255,23,68,0.0))]" />
                                <div className="pointer-events-none absolute inset-0 bg-black/10" />
                                <button
                                    type="button"
                                    disabled={checkingAccess || inSelf}
                                    onClick={() => {
                                        if (inSelf) {
                                            popup.info("You are already registered as an individual delegate.");
                                            return;
                                        }
                                        navigate("/delegate-group-registration");
                                    }}
                                    className="rounded-full bg-gradient-to-r from-[#ff1744] via-[#ff4f81] to-[#5b2cff] px-8 py-4 text-sm font-semibold uppercase tracking-[0.35em] text-white transition hover:-translate-y-1 hover:brightness-110"
                                >
                                    Group Pass
                                </button>
                                <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                                    {inSelf ? "already registered individually" : checkingAccess ? "checking status" : "ideal for 5+ members"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </>
    );
};

export default Delegate;
