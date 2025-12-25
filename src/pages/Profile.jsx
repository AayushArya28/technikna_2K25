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
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  signOut,
} from "firebase/auth";
import { usePopup } from "../context/usePopup.jsx";
import {
  getEventId,
  getEventKeyById,
  getEventRouteById,
  getEventTitleById,
  getEventTitleByKey,
} from "../lib/eventIds.js";

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
    label = "Confirmed";
  } else if (normalized === "pending" || normalized === "pending_payment") {
    colorClass = "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
    label = "Pending";
  } else if (
    normalized === "failed" ||
    normalized === "payment_failed" ||
    normalized === "payment failed" ||
    normalized === "cancelled" ||
    normalized === "canceled"
  ) {
    colorClass = "bg-red-500/20 text-red-400 border border-red-500/30";
    label = "Payment Failed";
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
  const navigate = useNavigate();
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
  const [eventsFetchError, setEventsFetchError] = useState("");

  const extractRegisteredEventsList = (raw) => {
    const asEventMap = (m) => m && typeof m === "object" && !Array.isArray(m);

    // API shape: { success: true, events: { [eventId]: "confirmed" | "pending" | "payment_failed" | ... } }
    if (asEventMap(raw?.events)) {
      return Object.entries(raw.events)
        .map(([k, v]) => {
          const asNum = Number(String(k || "").trim());
          const eventId = Number.isFinite(asNum) ? asNum : null;
          const status =
            typeof v === "string"
              ? v
              : v && typeof v === "object"
              ? v.status ??
                v.paymentStatus ??
                v.payment_status ??
                v.state ??
                null
              : v === true
              ? "registered"
              : null;

          if (eventId == null) return null;
          return { eventId, status };
        })
        .filter(Boolean);
    }

    // Some sources store event registrations as a direct map.
    if (asEventMap(raw) && !Array.isArray(raw)) {
      const keys = Object.keys(raw);
      const looksLikeMap = keys.some((k) => /\d+/.test(String(k)));
      if (looksLikeMap) {
        return Object.entries(raw)
          .map(([k, v]) => {
            const asNum = Number(String(k || "").trim());
            const eventId = Number.isFinite(asNum) ? asNum : null;
            const status =
              typeof v === "string"
                ? v
                : v && typeof v === "object"
                ? v.status ??
                  v.paymentStatus ??
                  v.payment_status ??
                  v.state ??
                  null
                : v === true
                ? "registered"
                : null;
            if (eventId == null) return null;
            return { eventId, status };
          })
          .filter(Boolean);
      }
    }

    const list = Array.isArray(raw)
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

  const mergeRegisteredEventItems = (a, b) => {
    const out = [];
    const seen = new Set();
    const add = (item) => {
      if (item == null) return;

      let eventId = null;
      let key = null;
      let title = null;

      if (typeof item === "number") {
        eventId = item;
      } else if (typeof item === "string") {
        const trimmed = item.trim();
        const asNum = Number(trimmed);
        if (Number.isFinite(asNum) && trimmed !== "") eventId = asNum;
        else title = trimmed;
      } else if (typeof item === "object") {
        eventId =
          item.eventId ??
          item.id ??
          item.event_id ??
          item.eventID ??
          item.eventIdFk ??
          null;
        key = item.eventKey ?? item.key ?? null;
        title =
          item.title ?? item.name ?? item.eventTitle ?? item.event ?? null;
      }

      const dedupeKey =
        eventId != null
          ? `id:${String(eventId)}`
          : key
          ? `key:${String(key)}`
          : title
          ? `title:${String(title)}`
          : null;

      if (!dedupeKey) {
        out.push(item);
        return;
      }
      if (seen.has(dedupeKey)) return;
      seen.add(dedupeKey);
      out.push(item);
    };

    (Array.isArray(a) ? a : []).forEach(add);
    (Array.isArray(b) ? b : []).forEach(add);
    return out;
  };

  const getFirestoreRegisteredEvents = async (uid, email, authDocData) => {
    const fromAuthDoc =
      extractRegisteredEventsList(authDocData?.registeredEvents) ||
      extractRegisteredEventsList(authDocData?.registered_events) ||
      extractRegisteredEventsList(authDocData?.events) ||
      extractRegisteredEventsList(authDocData?.eventRegistrations) ||
      extractRegisteredEventsList(authDocData?.registrations) ||
      [];

    const normalizeEventRegistrationEventsMap = (eventsMap) => {
      if (!eventsMap || typeof eventsMap !== "object") return [];
      return Object.entries(eventsMap)
        .map(([k, v]) => {
          const asNum = Number(String(k || "").trim());
          const eventId = Number.isFinite(asNum) ? asNum : null;
          const status =
            v?.status ??
            v?.paymentStatus ??
            v?.payment_status ??
            v?.state ??
            null;
          const eventKey = v?.eventKey ?? v?.event_key ?? v?.key ?? null;
          if (!eventId && !eventKey) return null;
          return { eventId, eventKey, status };
        })
        .filter(Boolean);
    };

    // Known schema: collection `event_registration`, per-user doc has `events: { [eventId]: {status, paymentUrl, ...} }`
    let eventRegistrationDocData = null;
    try {
      const direct = await getDoc(doc(db, "event_registration", uid));
      if (direct.exists()) {
        eventRegistrationDocData = direct.data();
      }
    } catch {
      // ignore
    }

    if (!eventRegistrationDocData && email) {
      try {
        const snap = await getDocs(
          query(
            collection(db, "event_registration"),
            where("email", "==", String(email)),
            limit(1)
          )
        );
        const first = snap.docs?.[0];
        if (first) eventRegistrationDocData = first.data();
      } catch {
        // ignore
      }
    }

    const fromEventRegistration = normalizeEventRegistrationEventsMap(
      eventRegistrationDocData?.events
    );

    if (fromEventRegistration.length > 0) {
      return mergeRegisteredEventItems(fromAuthDoc, fromEventRegistration);
    }

    const tryGetSubcollection = async (subPath) => {
      try {
        const snap = await getDocs(
          query(collection(db, "auth", uid, subPath), limit(200))
        );
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      } catch {
        return [];
      }
    };

    const [subRegs, subEvents] = await Promise.all([
      tryGetSubcollection("registrations"),
      tryGetSubcollection("events"),
    ]);

    const normalizeDocs = (docs) =>
      (Array.isArray(docs) ? docs : [])
        .map((d) => {
          if (!d || typeof d !== "object") return null;
          const eventId =
            d.eventId ??
            d.event_id ??
            d.eventID ??
            d.event ??
            d.eventIdFk ??
            d.eventIdRef ??
            null;
          const eventKey = d.eventKey ?? d.event_key ?? d.key ?? null;
          const status = d.status ?? d.paymentStatus ?? d.state ?? null;

          if (eventId == null && !eventKey) {
            const docId = String(d.id || "");
            const asNum = Number(docId);
            if (Number.isFinite(asNum) && docId.trim() !== "") {
              return { eventId: asNum, status };
            }
            if (docId) return { eventKey: docId, status };
            return null;
          }

          return { eventId, eventKey, status };
        })
        .filter(Boolean);

    const fromFirestoreDocs = mergeRegisteredEventItems(
      normalizeDocs(subRegs),
      normalizeDocs(subEvents)
    );

    return mergeRegisteredEventItems(fromAuthDoc, fromFirestoreDocs);
  };

  const normalizedRegisteredEvents = (() => {
    const raw = statuses.events;

    const list = extractRegisteredEventsList(raw);

    return (Array.isArray(list) ? list : [])
      .map((item) => {
        if (typeof item === "number") {
          const eventId = item;
          const key = getEventKeyById(eventId);
          const title =
            getEventTitleById(eventId) ||
            (key ? getEventTitleByKey(key) : null) ||
            `Event ${eventId}`;
          return { title, eventId, status: null, key };
        }
        if (typeof item === "string") {
          const trimmed = item.trim();
          const asNum = Number(trimmed);
          if (Number.isFinite(asNum) && trimmed !== "") {
            const eventId = asNum;
            const key = getEventKeyById(eventId);
            const title =
              getEventTitleById(eventId) ||
              (key ? getEventTitleByKey(key) : null) ||
              `Event ${eventId}`;
            return { title, eventId, status: null, key };
          }
          return { title: item, eventId: null, status: null, key: null };
        }
        if (!item || typeof item !== "object") {
          return null;
        }

        const eventId =
          item.eventId ??
          item.id ??
          item.event_id ??
          item.eventID ??
          item.eventIdFk ??
          null;
        const key = item.eventKey ?? item.key ?? getEventKeyById(eventId);
        const title =
          item.eventTitle ||
          item.title ||
          item.name ||
          item.event ||
          (key ? getEventTitleByKey(key) : null) ||
          (eventId ? getEventTitleById(eventId) : null) ||
          (eventId ? `Event ${eventId}` : "Event");
        const status = item.status ?? item.paymentStatus ?? item.state ?? null;

        return { title, eventId, status, key };
      })
      .filter(Boolean);
  })();

  const eventsBadgeStatus = (() => {
    if (normalizedRegisteredEvents.length > 0) {
      return `${normalizedRegisteredEvents.length} Registered`;
    }

    const raw = statuses.events;
    const count =
      raw?.count ??
      raw?.total ??
      raw?.registeredCount ??
      raw?.registered_count ??
      raw?.eventsCount ??
      raw?.events_count;

    if (Number.isFinite(Number(count)) && Number(count) > 0) {
      return `${Number(count)} Registered`;
    }

    if (!raw) return null;
    if (raw === true) return "Registered";
    if (typeof raw === "string") return raw;
    if (typeof raw === "object" && raw?.status) return String(raw.status);
    return "Registered";
  })();

  const openRegisteredEvent = (evt) => {
    const key = evt?.key;
    const eventId = evt?.eventId ?? (key ? getEventId(key) : null);
    const route = getEventRouteById(eventId);

    if (!eventId || !route) {
      popup.info("Event link is not available for this entry.");
      return;
    }

    if (key) {
      navigate(`${route}?eventKey=${encodeURIComponent(String(key))}`);
      return;
    }

    navigate(`${route}?eventId=${encodeURIComponent(String(eventId))}`);
  };

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

        const docRef = doc(db, "auth", user.uid);

        const [eventRes, delegateRes, alumniRes, docSnap] = await Promise.all([
          fetch(`${BASE_API_URL}/event/registered`, { headers }),
          fetch(`${BASE_API_URL}/delegate/status/user`, { headers }),
          fetch(`${BASE_API_URL}/alumni/status`, { headers }),
          getDoc(docRef),
        ]);

        setEventsFetchError("");

        let eventData = null;
        if (eventRes.ok) {
          eventData = await eventRes.json().catch(() => []);
        } else {
          // Mark as fetched but unavailable, so UI doesn't show "Fetching" forever.
          eventData = [];
          setEventsFetchError(
            `Could not load registered events (${eventRes.status}).`
          );
        }
        const delegateData = delegateRes.ok ? await delegateRes.json() : null;
        const alumniData = alumniRes.ok ? await alumniRes.json() : null;

        let firestoreUserData = {};
        if (docSnap?.exists?.()) {
          firestoreUserData = docSnap.data();
        }

        let firestoreEvents = [];
        try {
          firestoreEvents = await getFirestoreRegisteredEvents(
            user.uid,
            user.email,
            firestoreUserData
          );
        } catch {
          firestoreEvents = [];
        }

        const apiList = extractRegisteredEventsList(eventData);
        const mergedEvents =
          apiList.length > 0
            ? mergeRegisteredEventItems(apiList, firestoreEvents)
            : firestoreEvents.length > 0
            ? firestoreEvents
            : eventData;

        if (firestoreEvents.length > 0 && !eventRes.ok) {
          setEventsFetchError("");
        }

        setStatuses({
          events: mergedEvents,
          delegate: delegateData,
          alumni: alumniData,
        });

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
        setEventsFetchError("Could not load registered events.");
        setStatuses((prev) => ({ ...prev, events: [] }));
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

    const normalizedPhone = String(draft.phone || "")
      .replace(/\D/g, "")
      .trim();
    if (!String(draft.name || "").trim()) {
      popup.error("Name is required.");
      return;
    }
    if (!String(draft.college || "").trim()) {
      popup.error("College is required.");
      return;
    }
    if (
      !normalizedPhone ||
      normalizedPhone.length < 10 ||
      normalizedPhone.length > 15
    ) {
      popup.error("Please enter a valid phone number.");
      return;
    }

    setSavingProfile(true);
    try {
      const updatedName = String(draft.name || "").trim();
      const updatedCollege = String(draft.college || "").trim();

      await updateDoc(doc(db, "auth", user.uid), {
        name: updatedName,
        college: updatedCollege,
        phone: normalizedPhone,
      });

      // Update profile state with new values
      const newProfile = {
        name: updatedName,
        college: updatedCollege,
        phone: normalizedPhone,
        email: profile.email,
      };
      setProfile(newProfile);
      setDraft(newProfile);
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
                    <>
                      <button
                        type="button"
                        onClick={() => setEditing(true)}
                        className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white hover:bg-white/20 transition sm:w-auto"
                      >
                        Edit profile
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await signOut(auth);
                            popup.success("Signed out");
                            navigate("/");
                          } catch (e) {
                            popup.error(e?.message || "Failed to sign out");
                          }
                        }}
                        className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-red-600/10 px-4 py-2 text-white hover:bg-red-600/20 transition sm:w-auto"
                      >
                        Sign out
                      </button>
                    </>
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
                              onChange={(e) =>
                                setDraft((p) => ({
                                  ...p,
                                  name: e.target.value,
                                }))
                              }
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
                              onChange={(e) =>
                                setDraft((p) => ({
                                  ...p,
                                  college: e.target.value,
                                }))
                              }
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
                              onChange={(e) =>
                                setDraft((p) => ({
                                  ...p,
                                  phone: e.target.value,
                                }))
                              }
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
                    <div className="grid gap-4 md:grid-cols-2">
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
                          <GraduationCap className="h-5 w-5 text-white/70" />
                        </div>
                        <div className="text-sm text-white/60 mb-2">
                          Alumni Meet
                        </div>
                        <StatusBadge status={statuses.alumni?.status} />
                      </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
                          Registered Events
                        </div>
                      </div>

                      {normalizedRegisteredEvents.length > 0 ? (
                        <div className="space-y-2">
                          {normalizedRegisteredEvents.map((evt, idx) => (
                            <button
                              key={`${
                                evt.key || evt.eventId || evt.title
                              }_${idx}`}
                              type="button"
                              onClick={() => openRegisteredEvent(evt)}
                              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-left hover:border-[#ff0045]/50 hover:bg-black/40 transition"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="text-sm font-medium text-white">
                                  {String(evt.title || "Event")}
                                </div>
                                <StatusBadge
                                  status={evt.status || "registered"}
                                />
                              </div>
                              <div className="mt-1 text-xs text-white/45">
                                Tap to open this event
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : statuses.events === null ? (
                        <div className="text-sm text-white/50">
                          Fetching your registered events…
                        </div>
                      ) : (
                        <div className="text-sm text-white/50">
                          {eventsFetchError || "No registered events yet."}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50 mb-4 border-b border-white/10 pb-2">
                      Change Password
                    </h3>

                    <div className="rounded-2xl border border-white/10 bg-black/40 p-5 space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <div className="text-xs uppercase tracking-wider text-white/40 mb-1">
                            Current Password
                          </div>
                          <input
                            type="password"
                            value={pwCurrent}
                            onChange={(e) => setPwCurrent(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#ff0045]/60"
                            placeholder="Current password"
                          />
                        </div>

                        <div>
                          <div className="text-xs uppercase tracking-wider text-white/40 mb-1">
                            New Password
                          </div>
                          <input
                            type="password"
                            value={pwNext}
                            onChange={(e) => setPwNext(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#ff0045]/60"
                            placeholder="New password"
                          />
                          {pwNext
                            ? (() => {
                                const s = getPasswordStrength(pwNext);
                                return (
                                  <div className="mt-2">
                                    <div className="flex items-center justify-between text-xs text-white/60">
                                      <span>Password strength</span>
                                      <span className="text-white/80">
                                        {s.label}
                                      </span>
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
                            : null}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs uppercase tracking-wider text-white/40 mb-1">
                          Confirm New Password
                        </div>
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
