import React, { useEffect, useMemo, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { BASE_API_URL, fetchJson, getAuthHeaders } from "../lib/api.js";
import { usePopup } from "../context/usePopup.jsx";
import { useEntitlements } from "../context/useEntitlements.jsx";

function sanitizePhone(phone) {
  return String(phone || "").replace(/\D/g, "").trim();
}

export default function EventForm({ eventId, eventTitle, eventCategory, open, onClose }) {
  const popup = usePopup();
  const { loading: entitlementsLoading, isEventFreeEligible } = useEntitlements();
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState(null);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
  });

  const [type, setType] = useState("solo");
  const [group, setGroup] = useState([{ name: "", email: "", phone: "", college: "" }]);

  useEffect(() => {
    if (!open) return;

    const run = async () => {
      const user = auth.currentUser;
      if (!user) {
        popup.error("Please sign in to register for events.");
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
              fetchJson(`${BASE_API_URL}/delegate/status`, { method: "GET", headers }),
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
    const user = auth.currentUser;
    if (!user) {
      popup.error("Please sign in to register.");
      return;
    }
    if (entitlementsLoading) {
      popup.info("Checking eligibility… please try again in a moment.");
      return;
    }
    if (!eventId) {
      popup.error("Missing/invalid event id. Please contact the team.");
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
      return;
    }

    if (type === "group") {
      if (!Array.isArray(group) || group.length < 2) {
        popup.error("Add at least 2 members for group registration.");
        return;
      }
      for (let i = 0; i < group.length; i += 1) {
        const msg = validateGroupRow(group[i], i);
        if (msg) {
          popup.error(msg);
          return;
        }
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

      const payload = {
        eventId,
        type,
        eventTitle: String(eventTitle || ""),
        eventCategory: String(eventCategory || ""),
        isFreeEligible: Boolean(isEventFreeEligible),
        name: leader.name,
        email: leader.email,
        phone: leader.phone,
        college: leader.college,
        members: [leader],
      };

      if (type === "group") {
        const normalizedGroup = group.map((m) => ({
          name: String(m.name || "").trim(),
          email: String(m.email || "").trim(),
          phone: sanitizePhone(m.phone),
          college: String(m.college || "").trim(),
        }));

        payload.group = normalizedGroup;
        payload.members = [leader, ...normalizedGroup];
      }

      const { resp, data } = await fetchJson(`${BASE_API_URL}/event/book`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        popup.error(data?.message || `Event registration failed (${resp.status}).`);
        return;
      }

      const redirectUrl = data?.paymentUrl || data?.url;
      if (typeof redirectUrl === "string" && redirectUrl.trim()) {
        if (!isEventFreeEligible) {
          window.location.href = redirectUrl;
          return;
        }
      }

      popup.success(
        data?.message || (isEventFreeEligible ? "Event registration submitted (free eligible)." : "Event registration submitted.")
      );
      onClose?.();
    } catch (e) {
      popup.error(e?.message || "Event registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10040] flex items-start justify-center bg-black/70 px-3 py-4 overflow-y-auto sm:px-4 sm:py-6">
      <div className="w-full max-w-2xl rounded-3xl border border-white/12 bg-black/70 p-4 shadow-[0_40px_120px_rgba(0,0,0,0.8)] backdrop-blur-xl max-h-[85vh] overflow-y-auto sm:p-6">
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
          <div className="rounded-2xl border border-white/10 bg-black/40 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white/80">Mode</div>
              <div className="flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setType("solo")}
                  className={`rounded-full px-3 py-2 text-[11px] uppercase tracking-[0.22em] border transition sm:px-4 sm:text-xs ${
                    type === "solo"
                      ? "border-[#ff0045]/50 bg-[#ff0045]/20 text-white"
                      : "border-white/20 bg-white/10 text-white/80 hover:bg-white/20"
                  }`}
                >
                  Solo
                </button>
                <button
                  type="button"
                  onClick={() => setType("group")}
                  className={`rounded-full px-3 py-2 text-[11px] uppercase tracking-[0.22em] border transition sm:px-4 sm:text-xs ${
                    type === "group"
                      ? "border-[#ff0045]/50 bg-[#ff0045]/20 text-white"
                      : "border-white/20 bg-white/10 text-white/80 hover:bg-white/20"
                  }`}
                >
                  Group
                </button>
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
                  onClick={() =>
                    setGroup((prev) => [...prev, { name: "", email: "", phone: "", college: "" }])
                  }
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white hover:bg-white/20 transition"
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
                        disabled={group.length <= 1}
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
            disabled={submitting || loadingProfile}
            onClick={submit}
            className="w-full rounded-full bg-[#ff0045]/90 px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.30em] text-white transition hover:bg-[#ff0045]/80 disabled:opacity-60 sm:py-3 sm:tracking-[0.35em]"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>

          <div className="text-xs text-white/50">
            Auto-filled details can’t be edited here. Click any locked field to update your profile.
          </div>
        </div>
      </div>
    </div>
  );
}
