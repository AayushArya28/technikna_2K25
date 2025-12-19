export function isBitStudentEmail(email) {
  return /^[a-z]+15[0-9]{3}\.[12][0-9]@bitmesra\.ac\.in$/.test(String(email || "").toLowerCase());
}

export function isPaidLikeStatus(status) {
  const normalized = String(status || "").toLowerCase();
  return normalized === "paid" || normalized === "confirmed" || normalized === "success";
}

export function computeEntitlements({ email, delegateStatus, alumniStatus } = {}) {
  const isBitStudent = isBitStudentEmail(email);

  // "Booked delegate" = already purchased/confirmed.
  // If you want "started payment" to count, expand this to include "pending"/"pending_payment".
  const hasDelegatePass = isPaidLikeStatus(delegateStatus);

  // Alumni user = has completed alumni payment (confirmed/paid/success)
  const hasAlumniPass = isPaidLikeStatus(alumniStatus);

  return {
    isBitStudent,
    hasDelegatePass,
    hasAlumniPass,

    // Free events for BIT students OR users who already purchased delegate.
    isEventFreeEligible: Boolean(isBitStudent || hasDelegatePass),

    // Access rules
    // 1) BIT student: no accommodation, no delegate, no alumni page
    // 2) Alumni-paid users: alumni section only (no events, no delegate, no accommodation)
    // 3) Delegate-pass users: no alumni page

    canAccessEvents: !hasAlumniPass,
    canAccessAccommodation: !isBitStudent && !hasAlumniPass,
    canAccessDelegate: !isBitStudent && !hasAlumniPass,

    // Alumni page access (for registering/paying): blocked for BIT students and for delegate-pass users.
    canAccessAlumni: !isBitStudent && !hasDelegatePass,
  };
}
