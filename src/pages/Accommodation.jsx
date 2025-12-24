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

    if (canAccessAccommodation) return;

    if (isBitStudent) {
      popup.info("Accommodation page is locked for BIT students.");
    } else {
      popup.info("Accommodation assistance is not available for your account.");
    }
    navigate("/", { replace: true });
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
      <main className="min-h-screen bg-black text-white pt-28 pb-20 px-6 md:px-12 lg:px-20 max-md:mt-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-8">
          {/*Header + Price Section */}
          <div className="relative overflow-hidden rounded-[32px] border border-white/12 bg-black/55 p-8 md:p-12 shadow-[0_42px_120px_rgba(220,38,38,0.28)] backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(220,38,38,0.22),_transparent_60%)]" />
            <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="space-y-4">
                <span className="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.38em] text-white/70">
                  Stay Support
                </span>
                <h1 className="text-4xl font-semibold uppercase tracking-[0.22em] text-white md:text-5xl">
                  Accommodation Assistance
                </h1>
                <p className="max-w-xl text-sm text-white/70 md:text-base">
                  Share your travel plans and we will help you secure a
                  comfortable stay along with smooth campus access throughout
                  Technika.
                </p>
              </div>
              <div className="group relative w-full max-w-xs overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-6 text-center md:text-right transition will-change-transform hover:-translate-y-1 hover:border-white/30 hover:bg-white/10 hover:shadow-[0_22px_80px_rgba(220,38,38,0.18)]">
                <div className="pointer-events-none absolute inset-[-70%] opacity-30 blur-2xl animate-[spin_10s_linear_infinite] bg-[conic-gradient(from_90deg,rgba(220,38,38,0.0),rgba(220,38,38,0.35),rgba(239,68,68,0.35),rgba(220,38,38,0.0))]" />
                <div className="pointer-events-none absolute inset-0 bg-black/15" />
                <div className="pointer-events-none absolute -top-20 right-0 h-48 w-48 rounded-full bg-red-600/10 blur-[120px] transition group-hover:bg-red-600/20" />
                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                  Investment
                </div>
                <div className="mt-3 text-3xl font-semibold text-white">
                  INR 1,499
                </div>
                <div className="mt-2 text-xs uppercase tracking-[0.35em] text-white/60">
                  inclusive of gst & fees
                </div>
                <div className="mt-6 text-left text-sm text-white/70 md:text-right">
                  <span className="font-semibold text-white">Coverage:</span> 3
                  nights accommodation with meals
                </div>
              </div>
            </div>
          </div>

          {/*Content*/}
          <section className="grid gap-6 md:grid-cols-2">
            {/* Info Card */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/40">
              <h2 className="text-2xl font-semibold">What we cover</h2>
              <ul className="mt-4 space-y-2 text-white/75">
                <li>• Clear check-in & check-out guidance</li>
                <li>• Directions and campus entry assistance</li>
                <li>• Dedicated point of contact during stay</li>
                <li>• All basic amenities like pillows, blankets, and beds</li>
                <li>• Food included (Breakfast, Lunch, Snacks, and Dinner)</li>
              </ul>
            </div>

            {/* Action Card */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-red-600/30 via-red-500/20 to-rose-600/25 p-6 shadow-lg shadow-black/40">
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
                        ? "bg-red-600/20 text-red-300 cursor-not-allowed"
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
      <AccommodationForm open={openForm} onClose={() => setOpenForm(false)} />
    </>
  );
}
