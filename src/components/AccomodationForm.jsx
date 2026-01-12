import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { BASE_API_URL, fetchJson, getAuthHeaders } from "../lib/api";
import { usePopup } from "../context/usePopup";
import { useEntitlements } from "../context/useEntitlements";

export default function AccommodationForm({ open, onClose }) {
  const popup = usePopup();
  const {
    loading: entitlementsLoading,
    canAccessAccommodation,
    isBitStudent,
  } = useEntitlements();

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [checkingStatus, setCheckingStatus] = useState(false);
  const [accommodationStatus, setAccommodationStatus] = useState(null);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
  });

  const [form, setForm] = useState({
    checkIn: "2026-01-16",
    checkOut: "2026-01-18",
    preferences: "",
  });

  const [seats, setSeats] = useState(1);

  /* PROFILE PREFILL */
  useEffect(() => {
    if (!open) return;

    const run = async () => {
      const user = auth.currentUser;

      if (!user) {
        popup.error("Please sign in to continue.");
        onClose?.();
        return;
      }

      if (!user.emailVerified) {
        popup.error("Please verify your email.");
        onClose?.();
        return;
      }

      setLoadingProfile(true);
      try {
        const snap = await getDoc(doc(db, "auth", user.uid));
        const data = snap.exists() ? snap.data() : {};

        setProfile({
          name: data?.name || user.displayName || "",
          email: data?.email || user.email || "",
          phone: data?.phone || "",
          college: data?.college || "",
        });
      } catch {
        popup.error("Failed to load profile.");
      } finally {
        setLoadingProfile(false);
      }
    };

    run();
  }, [open, popup, onClose]);

  /* STATUS CHECK */
  useEffect(() => {
    if (!open) return;

    const run = async () => {
      try {
        setCheckingStatus(true);
        const headers = await getAuthHeaders({ json: false });

        const { resp, data } = await fetchJson(
          `${BASE_API_URL}/accommodation/status`,
          { method: "GET", headers }
        );

        if (resp.ok) {
          setAccommodationStatus(data?.status || null);
        }
      } catch {
        // silent
      } finally {
        setCheckingStatus(false);
      }
    };

    run();
  }, [open]);

  /* SUBMIT */
  const submit = async () => {
    const user = auth.currentUser;

    // Pre-open payment tab to avoid popup blockers; we'll navigate it after API response.
    const paymentTab = window.open("about:blank", "_blank");
    const closePaymentTab = () => {
      if (paymentTab && !paymentTab.closed) paymentTab.close();
    };
    try {
      if (paymentTab) paymentTab.opener = null;
    } catch {
      // ignore
    }

    const tryNavigatePaymentTab = (url) => {
      if (!paymentTab || paymentTab.closed) return false;
      try {
        paymentTab.location.href = url;
        return true;
      } catch {
        return false;
      }
    };

    const willUseNewTab = Boolean(paymentTab);
    if (!willUseNewTab) {
      popup.info("Popup blocked in your browser. Continuing to payment in this tab…");
    }

    if (!user) {
      popup.error("Please sign in to continue.");
      closePaymentTab();
      return;
    }

    if (!user.emailVerified) {
      popup.error("Please verify your email.");
      closePaymentTab();
      return;
    }

    if (entitlementsLoading) {
      popup.info("Checking eligibility…");
      closePaymentTab();
      return;
    }

    if (isBitStudent) {
      popup.info("Accommodation is not applicable for BIT students.");
      closePaymentTab();
      return;
    }

    if (accommodationStatus === "CONFIRMED") {
      popup.info("Your accommodation is already confirmed.");
      closePaymentTab();
      return;
    }

    if (!canAccessAccommodation) {
      popup.error("Accommodation not available for your account.");
      closePaymentTab();
      return;
    }

    if (!profile.name || !profile.email || !profile.phone || !profile.college) {
      popup.error("Please complete all personal details.");
      closePaymentTab();
      return;
    }

    setSubmitting(true);
    try {
      const headers = await getAuthHeaders({ json: true });

      const payload = {
        seats,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        preferences: form.preferences,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        college: profile.college,
        isBitStudent: false,
        callbackUrl: window.location.href,
      };

      const { resp, data } = await fetchJson(
        `${BASE_API_URL}/accommodation/book`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        }
      );

      if (!resp.ok) {
        popup.error(data?.message || "Accommodation request failed.");
        closePaymentTab();
        return;
      }

      const redirectUrl = data?.paymentUrl || data?.url;
      if (redirectUrl) {
        if (willUseNewTab) {
          const ok = tryNavigatePaymentTab(redirectUrl);
          if (ok) return;
          // Could not navigate the opened tab (some browsers restrict it). Close it and fallback.
          closePaymentTab();
        }

        window.location.href = redirectUrl;
        return;
      }

      closePaymentTab();
      popup.error("Payment link not generated. Please contact support.");
    } catch (e) {
      closePaymentTab();
      popup.error(e?.message || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10040] flex items-start justify-center bg-black/70 px-3 py-4">
      <div className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-3xl border border-white/12 bg-black/70 backdrop-blur-xl shadow-[0_40px_120px_rgba(0,0,0,0.8)]">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <div>
            <div className="text-xs uppercase tracking-[0.35em] text-white/50">
              Accommodation
            </div>
            <div className="text-lg font-semibold text-white">
              Request Stay
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white"
          >
            Close
          </button>
        </div>

        {/* Body (SCROLLS) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          <div className="grid gap-4 md:grid-cols-2 text-sm text-white/70">
            <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
              <div className="text-xs uppercase text-white/40">Check-in</div>
              16 January 2026
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
              <div className="text-xs uppercase text-white/40">Check-out</div>
              18 January 2026
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {["name", "email", "phone", "college"].map((key) => (
              <input
                key={key}
                value={profile[key]}
                onChange={(e) =>
                  setProfile({ ...profile, [key]: e.target.value })
                }
                className="rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-white"
                placeholder={key}
              />
            ))}
          </div>

          <select
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
            className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-white"
          >
            <option value={1}>1</option>
          </select>

          <textarea
            rows={3}
            value={form.preferences}
            onChange={(e) =>
              setForm({ ...form, preferences: e.target.value })
            }
            placeholder="Preferences (optional)"
            className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-white"
          />
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-5">
          <button
            onClick={submit}
            disabled={submitting || loadingProfile || isBitStudent}
            className="w-full rounded-full bg-[#ff0045]/90 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white"
          >
            {submitting ? "Redirecting…" : "Submit Request"}
          </button>
        </div>
      </div>
    </div>
  );
}
