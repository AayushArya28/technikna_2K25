import React, { useEffect, useState } from 'react';
import { X, User, Mail, School, Calendar, Award, GraduationCap, Loader2 } from 'lucide-react';
import { auth, db } from '../firebase';
import { createPortal } from 'react-dom';
import { collection, doc, getDoc, getDocs, limit, query, where } from 'firebase/firestore';

const UserProfileModal = ({ onClose }) => {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        college: '',
        phone: ''
    });
    const [statuses, setStatuses] = useState({
        events: null,
        delegate: null,
        alumni: null
    });

    const BASE_API_URL = "https://api.technika.co";

    const extractRegisteredEventsList = (raw) => {
        const asEventMap = (m) => m && typeof m === 'object' && !Array.isArray(m);

        // API shape: { success: true, events: { [eventId]: "confirmed" | "pending" | "payment_failed" | ... } }
        if (asEventMap(raw?.events)) {
            return Object.entries(raw.events)
                .map(([k, v]) => {
                    const asNum = Number(String(k || '').trim());
                    const eventId = Number.isFinite(asNum) ? asNum : null;
                    const status =
                        typeof v === 'string'
                            ? v
                            : v && typeof v === 'object'
                                ? (v.status ?? v.paymentStatus ?? v.payment_status ?? v.state ?? null)
                                : v === true
                                    ? 'registered'
                                    : null;
                    if (eventId == null) return null;
                    return { eventId, status };
                })
                .filter(Boolean);
        }

        const list =
            Array.isArray(raw)
                ? raw
                : Array.isArray(raw?.events)
                    ? raw.events
                    : Array.isArray(raw?.data)
                        ? raw.data
                        : Array.isArray(raw?.registeredEvents)
                            ? raw.registeredEvents
                            : Array.isArray(raw?.registered_events)
                                ? raw.registered_events
                                : Array.isArray(raw?.registrations)
                                    ? raw.registrations
                                    : Array.isArray(raw?.results)
                                        ? raw.results
                                        : Array.isArray(raw?.items)
                                            ? raw.items
                                            : [];
        return Array.isArray(list) ? list : [];
    };

    const countFromEventRegistrationDoc = (docData) => {
        const eventsMap = docData?.events;
        if (!eventsMap || typeof eventsMap !== 'object') return 0;
        return Object.keys(eventsMap).length;
    };

    const [firebaseRegCount, setFirebaseRegCount] = useState(0);

    const registeredEventsCount = extractRegisteredEventsList(statuses.events).length || Number(firebaseRegCount || 0);

    useEffect(() => {
        const fetchData = async () => {
            const user = auth.currentUser;
            if (!user) return;

            try {
                const token = await user.getIdToken();
                const headers = { Authorization: `Bearer ${token}` };

                // Fetch all statuses in parallel
                const [eventRes, delegateRes, alumniRes, directEventRegDoc] = await Promise.all([
                    fetch(`${BASE_API_URL}/event/registered`, { headers }),
                    fetch(`${BASE_API_URL}/delegate/status/user`, { headers }),
                    fetch(`${BASE_API_URL}/alumni/status`, { headers }),
                    getDoc(doc(db, 'event_registration', user.uid))
                ]);

                const eventData = eventRes.ok ? await eventRes.json() : null;
                const delegateData = delegateRes.ok ? await delegateRes.json() : null;
                const alumniData = alumniRes.ok ? await alumniRes.json() : null;

                let regCount = 0;
                if (directEventRegDoc?.exists?.()) {
                    regCount = countFromEventRegistrationDoc(directEventRegDoc.data());
                } else if (user.email) {
                    try {
                        const snap = await getDocs(
                            query(collection(db, 'event_registration'), where('email', '==', String(user.email)), limit(1))
                        );
                        const first = snap.docs?.[0];
                        if (first) regCount = countFromEventRegistrationDoc(first.data());
                    } catch {
                        // ignore
                    }
                }
                setFirebaseRegCount(regCount);

                setStatuses({
                    events: eventData,
                    delegate: delegateData,
                    alumni: alumniData
                });

                // Fetch basic user details from Firestore 'auth' collection using UID
                let firestoreUserData = {};
                try {
                    const docRef = doc(db, "auth", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        firestoreUserData = docSnap.data();
                    }
                } catch (err) {
                    console.error("Error fetching user from DB:", err);
                }

                // Extract profile info from DB first, then API sources, then Auth default
                const sourceData = delegateData || alumniData || {};

                setProfile({
                    name: firestoreUserData.name || sourceData.name || user.displayName || 'User',
                    email: firestoreUserData.email || sourceData.email || user.email,
                    college: firestoreUserData.college || sourceData.college || 'Not Provided',
                    phone: firestoreUserData.phone || sourceData.phone || ''
                });

            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Helper to render status badge
    const StatusBadge = ({ status }) => {
        if (!status) return <span className="text-white/40 italic">Not Registered</span>;

        let colorClass = "bg-white/10 text-white/60";
        let label = status;

        const s = String(status).toLowerCase();
        if (s === 'paid' || s === 'confirmed' || s === 'success') {
            colorClass = "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
            label = 'Confirmed';
        } else if (s === 'pending' || s === 'pending_payment') {
            colorClass = "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
            label = 'Pending';
        } else if (s === 'failed' || s === 'payment_failed' || s === 'payment failed' || s === 'cancelled' || s === 'canceled') {
            colorClass = "bg-red-500/20 text-red-400 border border-red-500/30";
            label = 'Payment Failed';
        }

        return (
            <span className={`px-3 py-1 rounded-full text-xs uppercase tracking-wider font-medium ${colorClass}`}>
                {label}
            </span>
        );
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-sans">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a] shadow-[0_0_50px_rgba(255,0,48,0.15)] animate-in fade-in zoom-in duration-200">
                {/* Header Pattern */}
                <div className="absolute inset-0 h-32 bg-gradient-to-b from-[#ff0045]/10 to-transparent pointer-events-none" />

                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-10 rounded-full bg-white/5 p-2 text-white/70 hover:bg-white/10 hover:text-white transition"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="relative p-8">
                    <h2 className="text-2xl font-bold uppercase tracking-widest text-white mb-8 flex items-center gap-3">
                        <User className="h-6 w-6 text-[#ff0045]" />
                        My Profile
                    </h2>

                    {loading ? (
                        <div className="flex h-64 items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-[#ff0045]" />
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Personal Details */}
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/5 p-4">
                                        <div className="rounded-full bg-white/5 p-2 text-white/60">
                                            <User className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="text-xs uppercase tracking-wider text-white/40">Full Name</div>
                                            <div className="text-lg font-medium text-white">{profile.name}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/5 p-4">
                                        <div className="rounded-full bg-white/5 p-2 text-white/60">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="text-xs uppercase tracking-wider text-white/40">Email Address</div>
                                            <div className="text-base font-medium text-white break-all">{profile.email}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 h-full">
                                        <div className="rounded-full bg-white/5 p-2 text-white/60">
                                            <School className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="text-xs uppercase tracking-wider text-white/40">College / Institute</div>
                                            <div className="text-base font-medium text-white">{profile.college}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Registration Status Section */}
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50 mb-4 border-b border-white/10 pb-2">
                                    Registration Status
                                </h3>
                                <div className="grid gap-4 md:grid-cols-3">
                                    {/* Delegate Status */}
                                    <div className="rounded-2xl border border-white/10 bg-black/40 p-5 hover:border-[#ff0045]/50 transition duration-300">
                                        <div className="mb-3 flex items-center justify-between">
                                            <Award className="h-5 w-5 text-white/70" />
                                        </div>
                                        <div className="text-sm text-white/60 mb-2">Delegate Pass</div>
                                        <StatusBadge status={statuses.delegate?.status} />
                                    </div>

                                    {/* Events Status */}
                                    <div className="rounded-2xl border border-white/10 bg-black/40 p-5 hover:border-[#ff0045]/50 transition duration-300">
                                        <div className="mb-3 flex items-center justify-between">
                                            <Calendar className="h-5 w-5 text-white/70" />
                                        </div>
                                        <div className="text-sm text-white/60 mb-2">Events</div>
                                            <StatusBadge status={registeredEventsCount > 0 ? `${registeredEventsCount} Registered` : (statuses.events ? "Registered" : null)} />
                                    </div>

                                    {/* Alumni Status */}
                                    <div className="rounded-2xl border border-white/10 bg-black/40 p-5 hover:border-[#ff0045]/50 transition duration-300">
                                        <div className="mb-3 flex items-center justify-between">
                                            <GraduationCap className="h-5 w-5 text-white/70" />
                                        </div>
                                        <div className="text-sm text-white/60 mb-2">Alumni Meet</div>
                                        <StatusBadge status={statuses.alumni?.status} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default UserProfileModal;
