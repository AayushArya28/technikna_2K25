import React, { useEffect, useState } from "react";
import {
  Award,
  Calendar,
  GraduationCap,
  Loader2,
  Mail,
  School,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const BASE_API_URL = "https://api.technika.co";

function StatusBadge({ status }) {
  if (!status) {
    return <span className="text-white/40 italic">Not Registered</span>;
  }

  let colorClass = "bg-white/10 text-white/60";
  let label = status;

  const normalized = String(status).toLowerCase();
  if (
    normalized === "paid" ||
    normalized === "confirmed" ||
    normalized === "success"
  ) {
    colorClass =
      "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
  } else if (normalized === "pending" || normalized === "pending_payment") {
    colorClass =
      "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs uppercase tracking-wider font-medium ${colorClass}`}
    >
      {label}
    </span>
  );
}

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    college: "",
    phone: "",
  });
  const [statuses, setStatuses] = useState({
    events: null,
    delegate: null,
    alumni: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken();
        const headers = { Authorization: `Bearer ${token}` };

        const [eventRes, delegateRes, alumniRes] = await Promise.all([
          fetch(`${BASE_API_URL}/event/registered`, { headers }),
          fetch(`${BASE_API_URL}/delegate/status`, { headers }),
          fetch(`${BASE_API_URL}/alumni/status`, { headers }),
        ]);

        const eventData = eventRes.ok ? await eventRes.json() : null;
        const delegateData = delegateRes.ok ? await delegateRes.json() : null;
        const alumniData = alumniRes.ok ? await alumniRes.json() : null;

        setStatuses({
          events: eventData,
          delegate: delegateData,
          alumni: alumniData,
        });

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

        const sourceData = delegateData || alumniData || {};

        setProfile({
          name:
            firestoreUserData.name ||
            sourceData.name ||
            user.displayName ||
            "User",
          email: firestoreUserData.email || sourceData.email || user.email,
          college:
            firestoreUserData.college || sourceData.college || "Not Provided",
          phone: firestoreUserData.phone || sourceData.phone || "",
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const currentUser = auth.currentUser;

  return (
    <div className="min-h-screen pt-24 pb-10 px-4">
      <div className="mx-auto w-full max-w-2xl">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a] shadow-[0_0_50px_rgba(255,0,48,0.15)]">
          <div className="absolute inset-0 h-32 bg-gradient-to-b from-[#ff0045]/10 to-transparent pointer-events-none" />

          <div className="relative p-6 sm:p-8">
            <div className="mb-8 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold uppercase tracking-widest text-white flex items-center gap-3">
                <User className="h-6 w-6 text-[#ff0045]" />
                My Profile
              </h2>
            </div>

            {!currentUser && !loading && (
              <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-white/80">
                <div className="text-lg font-semibold text-white mb-2">
                  You’re not logged in
                </div>
                <div className="text-white/60 mb-4">
                  Please sign in to view your profile.
                </div>
                <Link
                  to="/login"
                  className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white hover:bg-white/20 transition"
                >
                  Go to Login
                </Link>
              </div>
            )}

            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#ff0045]" />
              </div>
            ) : (
              currentUser && (
                <div className="space-y-8">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/5 p-4">
                        <div className="rounded-full bg-white/5 p-2 text-white/60">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-wider text-white/40">
                            Full Name
                          </div>
                          <div className="text-lg font-medium text-white">
                            {profile.name}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/5 p-4">
                        <div className="rounded-full bg-white/5 p-2 text-white/60">
                          <Mail className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-wider text-white/40">
                            Email Address
                          </div>
                          <div className="text-base font-medium text-white break-all">
                            {profile.email}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 h-full">
                        <div className="rounded-full bg-white/5 p-2 text-white/60">
                          <School className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-wider text-white/40">
                            College / Institute
                          </div>
                          <div className="text-base font-medium text-white">
                            {profile.college}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50 mb-4 border-b border-white/10 pb-2">
                      Registration Status
                    </h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="rounded-2xl border border-white/10 bg-black/40 p-5 hover:border-[#ff0045]/50 transition duration-300">
                        <div className="mb-3 flex items-center justify-between">
                          <Award className="h-5 w-5 text-white/70" />
                        </div>
                        <div className="text-sm text-white/60 mb-2">
                          Delegate Pass
                        </div>
                        <StatusBadge status={statuses.delegate?.status} />
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-black/40 p-5 hover:border-[#ff0045]/50 transition duration-300">
                        <div className="mb-3 flex items-center justify-between">
                          <Calendar className="h-5 w-5 text-white/70" />
                        </div>
                        <div className="text-sm text-white/60 mb-2">Events</div>
                        <StatusBadge
                          status={
                            Array.isArray(statuses.events)
                              ? `${statuses.events.length} Registered`
                              : statuses.events
                                ? "Registered"
                                : null
                          }
                        />
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-black/40 p-5 hover:border-[#ff0045]/50 transition duration-300">
                        <div className="mb-3 flex items-center justify-between">
                          <GraduationCap className="h-5 w-5 text-white/70" />
                        </div>
                        <div className="text-sm text-white/60 mb-2">
                          Alumni Meet
                        </div>
                        <StatusBadge status={statuses.alumni?.status} />
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
