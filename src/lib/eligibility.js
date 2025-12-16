export function isBitStudentEmail(email) {
  return /^[a-z]+[0-9]{3}\.[12][0-9]@bitmesra\.ac\.in$/.test(String(email || "").toLowerCase());
}

export function isPaidLikeStatus(status) {
  const normalized = String(status || "").toLowerCase();
  return normalized === "paid" || normalized === "confirmed" || normalized === "success";
}
