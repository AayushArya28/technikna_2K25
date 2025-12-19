import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEntitlements } from "../context/useEntitlements.jsx";
import { usePopup } from "../context/usePopup.jsx";
import AccommodationForm from "../components/AccomodationForm.jsx";
import { BASE_API_URL, fetchJson, getAuthHeaders } from "../lib/api";

export default function Accommodation() {
  const navigate = useNavigate();
  const popup = usePopup();

  const {
    loading: entitlementsLoading,
    canAccessAccommodation,
    isBitStudent,
  } = useEntitlements();

  const [openForm, setOpenForm] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [accommodationStatus, setAccommodationStatus] = useState(null);

  /* Entitlement Guard*/
  useEffect(() => {
    if (entitlementsLoading) return;

    // BIT students should still be able to see page
    if (!canAccessAccommodation && !isBitStudent) {
      popup.info("Accommodation assistance is not available for your account.");
      navigate("/", { replace: true });
    }
  }, [
    entitlementsLoading,
    canAccessAccommodation,
    isBitStudent,
    popup,
    navigate,
  ]);

  /* Status Check */
  useEffect(() => {
    if (entitlementsLoading) return;

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
  }, [entitlementsLoading]);

  if (entitlementsLoading) return null;

  const isConfirmed = accommodationStatus === "CONFIRMED";

  return (
    <>
      <main className="min-h-screen bg-black text-white pt-28 pb-20 px-6 md:px-12 lg:px-20">
        <div className="mx-auto flex max-w-5xl flex-col gap-8">
          {/*Header */}
          <header className="space-y-3">
            <p className="text-sm uppercase tracking-[0.2em] text-white/60">
              Stay support
            </p>
            <h1 className="text-4xl font-bold sm:text-5xl">
              Accommodation Assistance
            </h1>
            <p className="max-w-3xl text-lg text-white/70">
              Share your travel plans and we will help you secure a comfortable
              stay along with smooth campus access throughout Technika.
            </p>
          </header>

          {/*Content*/}
          <section className="grid gap-6 md:grid-cols-2">
            {/* Info Card */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/40">
              <h2 className="text-2xl font-semibold">What we cover</h2>
              <ul className="mt-4 space-y-2 text-white/75">
                <li>• Clear check-in & check-out guidance</li>
                <li>• Directions and campus entry assistance</li>
                <li>• Dedicated point of contact during stay</li>
              </ul>
            </div>

            {/* Action Card */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/30 via-green-500/20 to-teal-500/25 p-6 shadow-lg shadow-black/40">
              <h2 className="text-2xl font-semibold">Request your stay</h2>
              <p className="mt-3 text-white/80">
                Tell us your dates and preferences. We will guide you through
                the next steps.
              </p>

              {/* CTA */}
              {checkingStatus ? (
                <div className="mt-6 text-sm text-white/60">
                  Checking accommodation status…
                </div>
              ) : (
                <button
                  disabled={isConfirmed}
                  onClick={() => {
                    if (!isConfirmed) setOpenForm(true);
                  }}
                  className={`mt-6 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 font-medium transition
                    ${
                      isConfirmed
                        ? "bg-green-500/20 text-green-300 cursor-not-allowed"
                        : "bg-white text-black hover:-translate-y-[1px] hover:bg-white/90"
                    }`}
                >
                  {isConfirmed
                    ? "Accommodation Confirmed"
                    : "Submit stay request"}
                </button>
              )}

              {/* Confirmed hint */}
              {isConfirmed && (
                <div className="mt-3 text-sm text-green-300">
                  Your accommodation has already been confirmed.
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/*  Modal  */}
      <AccommodationForm
        open={openForm}
        onClose={() => setOpenForm(false)}
      />
    </>
  );
}
