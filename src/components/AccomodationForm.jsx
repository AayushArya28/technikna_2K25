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
    checkIn: "",
    checkOut: "",
    preferences: "",
  });

  /*PROFILE PREFILL */
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
        // silent fail
      } finally {
        setCheckingStatus(false);
      }
    };

    run();
  }, [open]);

  /*  SUBMIT  */
  const submit = async () => {
    const user = auth.currentUser;

    if (!user) {
      popup.error("Please sign in to continue.");
      return;
    }

    if (!user.emailVerified) {
      popup.error("Please verify your email.");
      return;
    }

    if (entitlementsLoading) {
      popup.info("Checking eligibility…");
      return;
    }

    /* BIT students */
    if (isBitStudent) {
      popup.info("Accommodation is not applicable for BIT students.");
      return;
    }

    /* Already confirmed */
    if (accommodationStatus === "CONFIRMED") {
      popup.info("Your accommodation is already confirmed.");
      return;
    }

    /* Non-BIT must be allowed */
    if (!canAccessAccommodation) {
      popup.error("Accommodation not available for your account.");
      return;
    }

    if (!profile.name || !profile.email || !profile.phone || !profile.college) {
      popup.error("Please complete all personal details.");
      return;
    }

    if (!form.checkIn || !form.checkOut) {
      popup.error("Please select check-in and check-out dates.");
      return;
    }

    if (new Date(form.checkOut) <= new Date(form.checkIn)) {
      popup.error("Check-out must be after check-in.");
      return;
    }

    setSubmitting(true);
    try {
      const headers = await getAuthHeaders({ json: true });

      const payload = {
        seats: 1,

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
        return;
      }

      /*  ALWAYS redirect to payment for non-BIT */
      const redirectUrl = data?.paymentUrl || data?.url;

      if (typeof redirectUrl === "string" && redirectUrl.trim()) {
        window.location.href = redirectUrl;
        return;
      }

      popup.error("Payment link not generated. Please contact support.");
    } catch (e) {
      popup.error(e?.message || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[10040] flex items-start justify-center bg-black/70 px-3 py-4 overflow-y-auto">
      <div className="w-full max-w-3xl max-h-[85vh] rounded-3xl border border-white/12 bg-black/70 backdrop-blur-xl flex flex-col shadow-[0_40px_120px_rgba(0,0,0,0.8)]">

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
            className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 transition"
          >
            Close
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* CONFIRMED STATE */}
          {accommodationStatus === "CONFIRMED" && (
            <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-green-400">
              <div className="text-sm uppercase tracking-wider">
                Accommodation Confirmed
              </div>
              <div className="mt-1 text-sm text-green-300">
                Your stay has been successfully confirmed. No further action is required.
              </div>
            </div>
          )}

          {/* Personal Details */}
          <div className="grid gap-4 md:grid-cols-2">
            {["name", "email", "phone", "college"].map((key) => (
              <div key={key}>
                <div className="mb-1 text-xs uppercase tracking-wider text-white/40">
                  {key}
                </div>
                <input
                  value={profile[key]}
                  onChange={(e) =>
                    setProfile({ ...profile, [key]: e.target.value })
                  }
                  className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-white focus:border-[#ff1744] focus:ring-2 focus:ring-[#ff1744]/40 focus:outline-none"
                />
              </div>
            ))}
          </div>

          {/* Dates */}
          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="date"
              value={form.checkIn}
              onChange={(e) =>
                setForm({ ...form, checkIn: e.target.value })
              }
              className="rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-white"
            />
            <input
              type="date"
              value={form.checkOut}
              onChange={(e) =>
                setForm({ ...form, checkOut: e.target.value })
              }
              className="rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-white"
            />
          </div>

          {/* Preferences */}
          <textarea
            rows={3}
            value={form.preferences}
            onChange={(e) =>
              setForm({ ...form, preferences: e.target.value })
            }
            placeholder="Preferences (optional)"
            className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-white"
          />

          {/* BIT Notice */}
          {isBitStudent && (
            <div className="text-sm text-red-400">
              Accommodation is not applicable for BIT students.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-5">
          <button
            disabled={
              submitting ||
              loadingProfile ||
              isBitStudent ||
              accommodationStatus === "CONFIRMED"
            }
            onClick={submit}
            className="w-full rounded-full bg-[#ff0045]/90 px-6 py-3 text-sm font-semibold uppercase tracking-[0.30em] text-white disabled:opacity-50"
          >
            {submitting
              ? "Redirecting…"
              : accommodationStatus === "CONFIRMED"
              ? "Accommodation Confirmed"
              : "Submit Request"}
          </button>
        </div>
      </div>
    </div>
  );
}
