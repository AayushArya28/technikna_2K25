export function isBitStudentEmail(email) {
  return /^[a-z]+[0-9]{3}\.[12][0-9]@bitmesra\.ac\.in$/.test(String(email || "").toLowerCase());
}

export function isPaidLikeStatus(status) {
  const normalized = String(status || "").toLowerCase();
  return normalized === "paid" || normalized === "confirmed" || normalized === "success";
}

export function computeEntitlements({ email, delegateStatus } = {}) {
  const isBitStudent = isBitStudentEmail(email);

  // "Booked delegate" = already purchased/confirmed.
  // If you want "started payment" to count, expand this to include "pending"/"pending_payment".
  const hasDelegatePass = isPaidLikeStatus(delegateStatus);

  return {
    isBitStudent,
    hasDelegatePass,

    // Free events for BIT students OR users who already purchased delegate.
    isEventFreeEligible: Boolean(isBitStudent || hasDelegatePass),

    // Access rules
    // 1) BIT student: no accommodation, no delegate
    canAccessAccommodation: !isBitStudent,
    canAccessDelegate: !isBitStudent,
    // 2) Booked delegate: no alumni
    canAccessAlumni: !hasDelegatePass,
  };
}
