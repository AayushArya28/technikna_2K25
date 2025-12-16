import React, { useEffect, useState } from "react";
import {
  Award,
  Calendar,
  GraduationCap,
  Loader2,
  Mail,
  Phone,
  School,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { usePopup } from "../context/usePopup.jsx";

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
  const popup = usePopup();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    college: "",
    phone: "",
  });
  const [editing, setEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [draft, setDraft] = useState({
    name: "",
    email: "",
    college: "",
    phone: "",
  });

  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNext, setPwNext] = useState("");
  const [pwNextConfirm, setPwNextConfirm] = useState("");
  const [changingPw, setChangingPw] = useState(false);

  const [statuses, setStatuses] = useState({
    events: null,
    delegate: null,
    alumni: null,
  });

  const getPasswordStrength = (value) => {
    const v = String(value || "");
    let score = 0;
    if (v.length >= 8) score += 1;
    if (v.length >= 12) score += 1;
    if (/[a-z]/.test(v) && /[A-Z]/.test(v)) score += 1;
    if (/\d/.test(v)) score += 1;
    if (/[^A-Za-z0-9]/.test(v)) score += 1;

    const clamped = Math.min(score, 5);
    const pct = (clamped / 5) * 100;
    const label =
      clamped <= 1
        ? "Weak"
        : clamped === 2
          ? "Fair"
          : clamped === 3
            ? "Good"
            : clamped === 4
              ? "Strong"
              : "Very strong";
    return { score: clamped, pct, label };
  };

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

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  const saveProfile = async () => {
    const user = auth.currentUser;
    if (!user) {
      popup.error("Please sign in to update your profile.");
      return;
    }

    const normalizedPhone = String(draft.phone || "").replace(/\D/g, "").trim();
    if (!String(draft.name || "").trim()) {
      popup.error("Name is required.");
      return;
    }
    if (!String(draft.college || "").trim()) {
      popup.error("College is required.");
      return;
    }
    if (!normalizedPhone || normalizedPhone.length < 10 || normalizedPhone.length > 15) {
      popup.error("Please enter a valid phone number.");
      return;
    }

    setSavingProfile(true);
    try {
      await updateDoc(doc(db, "auth", user.uid), {
        name: String(draft.name || "").trim(),
        college: String(draft.college || "").trim(),
        phone: normalizedPhone,
      });
      setProfile((prev) => ({
        ...prev,
        name: String(draft.name || "").trim(),
        college: String(draft.college || "").trim(),
        phone: normalizedPhone,
      }));
      setEditing(false);
      popup.success("Profile updated.");
    } catch (e) {
      popup.error(e?.message || "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    const user = auth.currentUser;
    if (!user?.email) {
      popup.error("Please sign in to change your password.");
      return;
    }

    if (!pwCurrent) {
      popup.error("Enter your current password.");
      return;
    }
    if (!pwNext || pwNext.length < 6) {
      popup.error("New password must be at least 6 characters.");
      return;
    }
    if (pwNext !== pwNextConfirm) {
      popup.error("New passwords do not match.");
      return;
    }

    setChangingPw(true);
    try {
      const cred = EmailAuthProvider.credential(user.email, pwCurrent);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, pwNext);
      setPwCurrent("");
      setPwNext("");
      setPwNextConfirm("");
      popup.success("Password updated.");
    } catch (e) {
      const code = e?.code;
      if (code === "auth/wrong-password") {
        popup.error("Current password is incorrect.");
      } else if (code === "auth/too-many-requests") {
        popup.error("Too many attempts. Please try again later.");
      } else if (code === "auth/requires-recent-login") {
        popup.error("Please login again, then retry changing password.");
      } else {
        popup.error(e?.message || "Failed to change password.");
      }
    } finally {
      setChangingPw(false);
    }
  };

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

              {currentUser && (
                <div className="flex flex-wrap justify-end gap-3">
                  {!editing ? (
                    <button
                      type="button"
                      onClick={() => setEditing(true)}
                      className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white hover:bg-white/20 transition sm:w-auto"
                    >
                      Edit profile
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        disabled={savingProfile}
                        onClick={saveProfile}
                        className="inline-flex w-full items-center justify-center rounded-full border border-[#ff0045]/50 bg-[#ff0045]/20 px-4 py-2 text-white hover:bg-[#ff0045]/25 transition disabled:opacity-60 sm:w-auto"
                      >
                        {savingProfile ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        disabled={savingProfile}
                        onClick={() => {
                          setDraft(profile);
                          setEditing(false);
                        }}
                        className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white hover:bg-white/20 transition disabled:opacity-60 sm:w-auto"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              )}
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
                <div className="space-y-6 sm:space-y-8">
                  <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/5 p-3 sm:p-4">
                        <div className="rounded-full bg-white/5 p-2 text-white/60">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-wider text-white/40">
                            Full Name
                          </div>
                          {!editing ? (
                            <div className="text-lg font-medium text-white">
                              {profile.name}
                            </div>
                          ) : (
                            <input
                              value={draft.name}
                              onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
                              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#ff0045]/60"
                              placeholder="Your name"
                            />
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/5 p-3 sm:p-4">
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
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/5 p-3 sm:p-4">
                        <div className="rounded-full bg-white/5 p-2 text-white/60">
                          <School className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-wider text-white/40">
                            College / Institute
                          </div>
                          {!editing ? (
                            <div className="text-base font-medium text-white">
                              {profile.college}
                            </div>
                          ) : (
                            <input
                              value={draft.college}
                              onChange={(e) => setDraft((p) => ({ ...p, college: e.target.value }))}
                              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#ff0045]/60"
                              placeholder="Your college"
                            />
                          )}
                        </div>
                      </div>

                      <div className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/5 p-3 sm:p-4">
                        <div className="rounded-full bg-white/5 p-2 text-white/60">
                          <Phone className="h-5 w-5" />
                        </div>
                        <div className="w-full">
                          <div className="text-xs uppercase tracking-wider text-white/40">
                            Phone
                          </div>
                          {!editing ? (
                            <div className="text-base font-medium text-white">
                              {profile.phone || "—"}
                            </div>
                          ) : (
                            <input
                              value={draft.phone}
                              onChange={(e) => setDraft((p) => ({ ...p, phone: e.target.value }))}
                              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#ff0045]/60"
                              placeholder="Phone"
                              inputMode="numeric"
                            />
                          )}
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

                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50 mb-4 border-b border-white/10 pb-2">
                      Change Password
                    </h3>

                    <div className="rounded-2xl border border-white/10 bg-black/40 p-5 space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <div className="text-xs uppercase tracking-wider text-white/40 mb-1">Current Password</div>
                          <input
                            type="password"
                            value={pwCurrent}
                            onChange={(e) => setPwCurrent(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#ff0045]/60"
                            placeholder="Current password"
                          />
                        </div>

                        <div>
                          <div className="text-xs uppercase tracking-wider text-white/40 mb-1">New Password</div>
                          <input
                            type="password"
                            value={pwNext}
                            onChange={(e) => setPwNext(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#ff0045]/60"
                            placeholder="New password"
                          />
                          {pwNext ? (
                            (() => {
                              const s = getPasswordStrength(pwNext);
                              return (
                                <div className="mt-2">
                                  <div className="flex items-center justify-between text-xs text-white/60">
                                    <span>Password strength</span>
                                    <span className="text-white/80">{s.label}</span>
                                  </div>
                                  <div className="mt-2 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                                    <div
                                      className="h-full bg-[#ff0045]/70"
                                      style={{ width: `${s.pct}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })()
                          ) : null}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs uppercase tracking-wider text-white/40 mb-1">Confirm New Password</div>
                        <input
                          type="password"
                          value={pwNextConfirm}
                          onChange={(e) => setPwNextConfirm(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#ff0045]/60"
                          placeholder="Confirm new password"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          disabled={changingPw}
                          onClick={handleChangePassword}
                          className="inline-flex items-center justify-center rounded-full border border-[#ff0045]/50 bg-[#ff0045]/20 px-5 py-2 text-white hover:bg-[#ff0045]/25 transition disabled:opacity-60"
                        >
                          {changingPw ? "Updating..." : "Update Password"}
                        </button>
                        <div className="text-xs text-white/50">
                          You may need to login again if required.
                        </div>
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
