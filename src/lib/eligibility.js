export function isBitStudentEmail(email) {
  return /^[a-z]+15[0-9]{3}\.[12][0-9]@bitmesra\.ac\.in$/.test(String(email || "").toLowerCase());
}

export function isPaidLikeStatus(status) {
  const normalized = String(status || "").toLowerCase();
  return normalized === "paid" || normalized === "confirmed" || normalized === "success";
}

// Event IDs that are free for Delegates and Alumni (Solo events)
export const FREE_SOLO_EVENT_IDS = [
  2, 9, 10, 11, 101, 104, 107, 111, 112, 119, 120, 121, 303, 304,
];

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

    // Base free eligibility: ONLY BIT students get everything free by default.
    // Delegates and Alumni have conditional free access (checked in EventForm).
    isEventFreeEligible: isBitStudent,

    // Access rules
    // 1) BIT student: no accommodation, no delegate, no alumni page
    // 2) Alumni-paid users: alumni section, AND now events logic (mixed free/paid)
    // 3) Delegate-pass users: no alumni page, events logic (mixed free/paid)

    // Allow everyone (including Alumni) to access/view events
    canAccessEvents: true,

    canAccessAccommodation: !isBitStudent && !hasAlumniPass,
    canAccessDelegate: !isBitStudent && !hasAlumniPass,

    // Alumni page access (for registering/paying): blocked for BIT students and for delegate-pass users.
    canAccessAlumni: !isBitStudent && !hasDelegatePass,
  };
}
