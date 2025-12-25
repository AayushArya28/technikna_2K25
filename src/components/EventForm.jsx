import React, { useEffect, useMemo, useRef, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { BASE_API_URL, fetchJson, getAuthHeaders } from "../lib/api.js";
import { usePopup } from "../context/usePopup.jsx";
import { useEntitlements } from "../context/useEntitlements.jsx";
import { FREE_SOLO_EVENT_IDS } from "../lib/eligibility.js";

function sanitizePhone(phone) {
  return String(phone || "").replace(/\D/g, "").trim();
}

export default function EventForm({
  eventId,
  eventTitle,
  eventCategory,
  open,
  onClose,
  allowedModes = ["solo", "group"],
  groupMinTotal = 2,
  groupMaxTotal = null,
}) {
  const popup = usePopup();
  const {
    loading: entitlementsLoading,
    isEventFreeEligible,
    isBitStudent,
    hasDelegatePass,
    hasAlumniPass,
  } = useEntitlements();
  const modalRef = useRef(null);
  const submitLockRef = useRef(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState(null);

  const registrationPaused = String(eventId || "") === "1";

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
  });

  const [type, setType] = useState("solo");
  const [group, setGroup] = useState([{ name: "", email: "", phone: "", college: "" }]);

  const safeAllowedModes = Array.isArray(allowedModes) ? allowedModes : ["solo", "group"];
  const safeGroupMinTotal = Number.isFinite(Number(groupMinTotal)) ? Number(groupMinTotal) : 2;
  const safeGroupMaxTotal =
    groupMaxTotal == null
      ? null
      : Number.isFinite(Number(groupMaxTotal))
        ? Number(groupMaxTotal)
        : null;

  const groupMinAdditional = Math.max(0, safeGroupMinTotal - 1);
  const groupMaxAdditional = safeGroupMaxTotal == null ? null : Math.max(0, safeGroupMaxTotal - 1);

  useEffect(() => {
    if (!open) return;
    if (!Array.isArray(safeAllowedModes) || safeAllowedModes.length === 0) return;
    if (safeAllowedModes.includes(type)) return;
    setType(safeAllowedModes[0]);
  }, [open, safeAllowedModes, type]);

  useEffect(() => {
    if (!open) return;
    if (type !== "group") return;

    setGroup((prev) => {
      const next = Array.isArray(prev) ? [...prev] : [];
      if (groupMaxAdditional != null && next.length > groupMaxAdditional) {
        next.length = groupMaxAdditional;
      }
      while (next.length < Math.max(1, groupMinAdditional)) {
        next.push({ name: "", email: "", phone: "", college: "" });
      }
      return next;
    });
  }, [open, type, groupMinAdditional, groupMaxAdditional]);

  useEffect(() => {
    if (!open) return;

    const run = async () => {
      const user = auth.currentUser;
      if (!user) {
        popup.error("Please sign in to register for events.");
        onClose?.();
        return;
      }

      if (!user.emailVerified) {
        popup.error("Please verify your email before registering for events.");
        onClose?.();
        return;
      }

      setLoadingProfile(true);
      try {
        const snap = await getDoc(doc(db, "auth", user.uid));
        const data = snap.exists() ? snap.data() : {};

        let next = {
          name: data?.name || user.displayName || "",
          email: data?.email || user.email || "",
          phone: data?.phone || "",
          college: data?.college || "",
        };

        const missingAny =
          !String(next.name || "").trim() ||
          !String(next.email || "").trim() ||
          !String(next.college || "").trim() ||
          !String(next.phone || "").trim();

        if (missingAny) {
          try {
            const headers = await getAuthHeaders({ json: false });
            const [delegateRes, alumniRes] = await Promise.all([
              fetchJson(`${BASE_API_URL}/delegate/status/user`, { method: "GET", headers }),
              fetchJson(`${BASE_API_URL}/alumni/status`, { method: "GET", headers }),
            ]);

            const delegateData = delegateRes.resp.ok ? delegateRes.data : null;
            const alumniData = alumniRes.resp.ok ? alumniRes.data : null;
            const source = delegateData || alumniData || {};

            next = {
              name: next.name || source?.name || "",
              email: next.email || source?.email || "",
              phone: next.phone || source?.phone || "",
              college: next.college || source?.college || "",
            };
          } catch {
            // ignore fallback failures
          }
        }

        setProfile(next);
      } catch {
        popup.error("Failed to load profile data for autofill.");
      } finally {
        setLoadingProfile(false);
      }
    };

    run();
  }, [open, onClose, popup]);

  useEffect(() => {
    if (!open) return;

    const run = async () => {
      if (!eventId) return;
      const user = auth.currentUser;
      if (!user) return;

      if (!user.emailVerified) return;

      setChecking(true);
      try {
        const headers = await getAuthHeaders({ json: false });
        const safeEventId = encodeURIComponent(String(eventId));
        const { resp, data } = await fetchJson(`${BASE_API_URL}/event/status/${safeEventId}`, {
          method: "GET",
          headers,
        });
        if (!resp.ok) {
          setStatus(null);
        } else {
          setStatus(data);
        }
      } finally {
        setChecking(false);
      }
    };

    run();
  }, [open, eventId]);

  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY || 0;

    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyPosition = document.body.style.position;
    const prevBodyTop = document.body.style.top;
    const prevBodyWidth = document.body.style.width;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    // Strong scroll lock (works even with smooth-scroll libraries)
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.position = prevBodyPosition;
      document.body.style.top = prevBodyTop;
      document.body.style.width = prevBodyWidth;
      document.documentElement.style.overflow = prevHtmlOverflow;

      // Restore scroll position after unlocking
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  const autofillLockedMessage = useMemo(
    () => "This is auto-filled from your profile. Update it in Profile.",
    []
  );

  const showLocked = () => popup.info(autofillLockedMessage);

  const validateGroupRow = (row, idx) => {
    if (!String(row.name || "").trim()) return `Member ${idx + 1}: name is required.`;
    if (!String(row.email || "").includes("@")) return `Member ${idx + 1}: valid email required.`;
    const p = sanitizePhone(row.phone);
    if (!p || p.length < 10 || p.length > 15) return `Member ${idx + 1}: valid phone required.`;
    if (!String(row.college || "").trim()) return `Member ${idx + 1}: college required.`;
    return "";
  };

  const submit = async () => {
    if (submitLockRef.current) return;
    submitLockRef.current = true;
    if (registrationPaused) {
      popup.info("Hackathon registration is temporarily paused.");
      submitLockRef.current = false;
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      popup.error("Please sign in to register.");
      submitLockRef.current = false;
      return;
    }

    if (!user.emailVerified) {
      popup.error("Please verify your email before registering.");
      submitLockRef.current = false;
      return;
    }
    if (entitlementsLoading) {
      popup.info("Checking eligibility… please try again in a moment.");
      submitLockRef.current = false;
      return;
    }
    if (!eventId) {
      popup.error("Missing/invalid event id. Please contact the team.");
      submitLockRef.current = false;
      return;
    }

    if (!safeAllowedModes.includes(type)) {
      popup.error("This event does not support the selected registration mode.");
      submitLockRef.current = false;
      return;
    }

    const base = {
      name: String(profile.name || "").trim(),
      email: String(profile.email || "").trim(),
      phone: sanitizePhone(profile.phone),
      college: String(profile.college || "").trim(),
    };

    if (!base.name || !base.email || !base.college || !base.phone) {
      popup.error("Complete your profile (name, email, phone, college) before registering.");
      submitLockRef.current = false;
      return;
    }

    if (type === "group") {
      if (!Array.isArray(group) || group.length < groupMinAdditional) {
        popup.error(
          `Add at least ${groupMinAdditional} member${groupMinAdditional === 1 ? "" : "s"} for group registration.`
        );
        submitLockRef.current = false;
        return;
      }
      if (groupMaxAdditional != null && group.length > groupMaxAdditional) {
        popup.error(
          `You can add at most ${groupMaxAdditional} member${groupMaxAdditional === 1 ? "" : "s"} for this event.`
        );
        submitLockRef.current = false;
        return;
      }
      for (let i = 0; i < group.length; i += 1) {
        const msg = validateGroupRow(group[i], i);
        if (msg) {
          popup.error(msg);
          submitLockRef.current = false;
          return;
        }
      }
    }

    const isFreeEventId = FREE_SOLO_EVENT_IDS.includes(Number(eventId));
    // Determine if this specific registration is free.
    // 1. BIT Students: Always free (isEventFreeEligible is true only for them now).
    // 2. Delegate/Alumni: Free ONLY if it matches the FREE_SOLO_EVENT_IDS list.
    const freeEligible =
      isEventFreeEligible || // BIT Student
      (Boolean(hasDelegatePass || hasAlumniPass) && isFreeEventId);
    // Popup blockers usually allow window.open only in the direct click handler.
    // So we open a blank tab first (synchronously), then navigate it after the API responds.
    let paymentTab = null;
    if (!freeEligible) {
      paymentTab = window.open("about:blank", "_blank");
      try {
        if (paymentTab) paymentTab.opener = null;
      } catch {
        // ignore
      }
      if (!paymentTab) {
        popup.info("Popup blocked in your browser. Continuing to payment in this tab…");
      }
    }

    setSubmitting(true);
    try {
      const headers = await getAuthHeaders({ json: true });
      const leader = {
        name: base.name,
        email: base.email,
        phone: base.phone,
        college: base.college,
      };
      const delegateEligible = Boolean(hasDelegatePass);

      const payload = {
        eventId,
        type,
        eventTitle: String(eventTitle || ""),
        eventCategory: String(eventCategory || ""),
        callbackUrl: window.location.href,
        // Back-compat (older backend): was used to mark free event bookings.
        isFreeEligible: freeEligible,
        // New backend flags:
        isBitStudent: Boolean(isBitStudent),
        isDelegate: delegateEligible,
        name: leader.name,
        email: leader.email,
        phone: leader.phone,
        college: leader.college,
      };

      if (type === "group") {
        const normalizedGroup = group.map((m) => ({
          name: String(m.name || "").trim(),
          email: String(m.email || "").trim(),
          phone: sanitizePhone(m.phone),
          college: String(m.college || "").trim(),
        }));

        payload.group = normalizedGroup;
        // Important: backend already knows the owner from top-level fields.
        // Sending owner again inside `members` can cause off-by-one totals.
        payload.members = normalizedGroup;
      }

      const { resp, data } = await fetchJson(`${BASE_API_URL}/event/book`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        popup.error(data?.message || `Event registration failed (${resp.status}).`);
        if (paymentTab && !paymentTab.closed) paymentTab.close();
        return;
      }

      const redirectUrl = data?.paymentUrl || data?.url;
      if (typeof redirectUrl === "string" && redirectUrl.trim()) {
        if (!freeEligible) {
          if (paymentTab && !paymentTab.closed) {
            try {
              paymentTab.location.href = redirectUrl;
              return;
            } catch {
              // If we can't navigate the pre-opened tab, close it before falling back.
              try {
                paymentTab.close();
              } catch {
                // ignore
              }
            }
          }

          window.location.href = redirectUrl;
          return;
        }
      }

      popup.success(
        data?.message ||
        (freeEligible
          ? "Event registration confirmed (free)."
          : "Event registration submitted.")
      );
      onClose?.();
    } catch (e) {
      popup.error(e?.message || "Event registration failed.");
      if (paymentTab && !paymentTab.closed) paymentTab.close();
    } finally {
      setSubmitting(false);
      submitLockRef.current = false;
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10040] flex items-start justify-center bg-blue-950/45 px-3 py-4 overflow-hidden overscroll-contain backdrop-blur-sm sm:px-4 sm:py-6">
      <div
        ref={modalRef}
        onWheelCapture={(e) => e.stopPropagation()}
        onTouchMoveCapture={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-3xl border border-white/12 bg-black/70 p-4 shadow-[0_40px_120px_rgba(0,0,0,0.8)] backdrop-blur-xl h-[85vh] overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch] sm:p-6"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.35em] text-white/50">
              {String(eventCategory || "Event")} registration
            </div>
            <div className="text-lg font-semibold text-white sm:text-xl">{String(eventTitle || "Register")}</div>
            <div className="mt-1 text-xs text-white/50">Event ID: {String(eventId)}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20 transition sm:px-4"
          >
            Close
          </button>
        </div>

        <div className="mt-4 space-y-3 sm:mt-5 sm:space-y-4">
          {registrationPaused && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white/80 sm:p-4">
              Hackathon registration is temporarily paused.
            </div>
          )}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white/80">Mode</div>
              <div className="flex flex-wrap justify-end gap-2">
                {safeAllowedModes.includes("solo") && (
                  <button
                    type="button"
                    onClick={() => setType("solo")}
                    className={`rounded-full px-3 py-2 text-[11px] uppercase tracking-[0.22em] border transition sm:px-4 sm:text-xs ${type === "solo"
                      ? "border-[#ff0045]/50 bg-[#ff0045]/20 text-white"
                      : "border-white/20 bg-white/10 text-white/80 hover:bg-white/20"
                      }`}
                  >
                    Solo
                  </button>
                )}
                {safeAllowedModes.includes("group") && (
                  <button
                    type="button"
                    onClick={() => setType("group")}
                    className={`rounded-full px-3 py-2 text-[11px] uppercase tracking-[0.22em] border transition sm:px-4 sm:text-xs ${type === "group"
                      ? "border-[#ff0045]/50 bg-[#ff0045]/20 text-white"
                      : "border-white/20 bg-white/10 text-white/80 hover:bg-white/20"
                      }`}
                  >
                    Group
                  </button>
                )}
              </div>
            </div>

            <div className="mt-2 text-xs text-white/50">
              {checking ? "Checking status..." : status ? "Status loaded." : ""}
            </div>
          </div>

          <div className="grid gap-2 sm:gap-3 md:grid-cols-2">
            <div>
              <div className="text-xs uppercase tracking-wider text-white/40 mb-1">Name</div>
              <input
                value={profile.name}
                readOnly
                onClick={showLocked}
                className="w-full rounded-2xl border border-white/15 bg-black/60 px-3 py-2.5 text-white/90 placeholder-white/30 focus:outline-none sm:px-4 sm:py-3"
                placeholder={loadingProfile ? "Loading..." : "Name"}
              />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-white/40 mb-1">Email</div>
              <input
                value={profile.email}
                readOnly
                onClick={showLocked}
                className="w-full rounded-2xl border border-white/15 bg-black/60 px-3 py-2.5 text-white/90 placeholder-white/30 focus:outline-none sm:px-4 sm:py-3"
                placeholder={loadingProfile ? "Loading..." : "Email"}
              />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-white/40 mb-1">Phone</div>
              <input
                value={profile.phone}
                readOnly
                onClick={showLocked}
                className="w-full rounded-2xl border border-white/15 bg-black/60 px-3 py-2.5 text-white/90 placeholder-white/30 focus:outline-none sm:px-4 sm:py-3"
                placeholder={loadingProfile ? "Loading..." : "Phone"}
              />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-white/40 mb-1">College</div>
              <input
                value={profile.college}
                readOnly
                onClick={showLocked}
                className="w-full rounded-2xl border border-white/15 bg-black/60 px-3 py-2.5 text-white/90 placeholder-white/30 focus:outline-none sm:px-4 sm:py-3"
                placeholder={loadingProfile ? "Loading..." : "College"}
              />
            </div>
          </div>

          {type === "group" && (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-3 sm:p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-white/80">Group members</div>
                <button
                  type="button"
                  disabled={groupMaxAdditional != null && group.length >= groupMaxAdditional}
                  onClick={() =>
                    setGroup((prev) => [...prev, { name: "", email: "", phone: "", college: "" }])
                  }
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white hover:bg-white/20 transition disabled:opacity-40"
                >
                  Add
                </button>
              </div>

              <div className="space-y-3">
                {group.map((m, idx) => (
                  <div key={idx} className="grid gap-2 sm:gap-3 md:grid-cols-4">
                    <input
                      value={m.name}
                      onChange={(e) =>
                        setGroup((prev) => prev.map((x, i) => (i === idx ? { ...x, name: e.target.value } : x)))
                      }
                      placeholder="Name"
                      className="w-full rounded-2xl border border-white/15 bg-black/60 px-3 py-2.5 text-white placeholder-white/30 focus:border-[#ff1744] focus:outline-none focus:ring-2 focus:ring-[#ff1744]/40 sm:px-4 sm:py-3"
                    />
                    <input
                      value={m.email}
                      onChange={(e) =>
                        setGroup((prev) => prev.map((x, i) => (i === idx ? { ...x, email: e.target.value } : x)))
                      }
                      placeholder="Email"
                      className="w-full rounded-2xl border border-white/15 bg-black/60 px-3 py-2.5 text-white placeholder-white/30 focus:border-[#ff1744] focus:outline-none focus:ring-2 focus:ring-[#ff1744]/40 sm:px-4 sm:py-3"
                    />
                    <input
                      value={m.phone}
                      onChange={(e) =>
                        setGroup((prev) => prev.map((x, i) => (i === idx ? { ...x, phone: e.target.value } : x)))
                      }
                      placeholder="Phone"
                      className="w-full rounded-2xl border border-white/15 bg-black/60 px-3 py-2.5 text-white placeholder-white/30 focus:border-[#ff1744] focus:outline-none focus:ring-2 focus:ring-[#ff1744]/40 sm:px-4 sm:py-3"
                    />
                    <div className="flex gap-2">
                      <input
                        value={m.college}
                        onChange={(e) =>
                          setGroup((prev) => prev.map((x, i) => (i === idx ? { ...x, college: e.target.value } : x)))
                        }
                        placeholder="College"
                        className="w-full rounded-2xl border border-white/15 bg-black/60 px-3 py-2.5 text-white placeholder-white/30 focus:border-[#ff1744] focus:outline-none focus:ring-2 focus:ring-[#ff1744]/40 sm:px-4 sm:py-3"
                      />
                      <button
                        type="button"
                        disabled={group.length <= Math.max(1, groupMinAdditional)}
                        onClick={() => setGroup((prev) => prev.filter((_, i) => i !== idx))}
                        className="rounded-2xl border border-white/20 bg-white/10 px-3 py-2.5 text-xs text-white hover:bg-white/20 transition disabled:opacity-40 sm:py-3"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            disabled={registrationPaused || submitting || loadingProfile}
            onClick={submit}
            className="w-full rounded-full bg-[#ff0045]/90 px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.30em] text-white transition hover:bg-[#ff0045]/80 disabled:opacity-60 sm:py-3 sm:tracking-[0.35em]"
          >
            {registrationPaused ? "Registration Paused" : submitting ? "Submitting..." : "Submit"}
          </button>

          <div className="text-xs text-white/50">
            Auto-filled details can’t be edited here. Click any locked field to update your profile.
          </div>
        </div>
      </div>
    </div>
  );
}
