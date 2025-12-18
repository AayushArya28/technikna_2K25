import { createContext } from "react";

export const EntitlementsContext = createContext({
  loading: true,
  isBitStudent: false,
  hasDelegatePass: false,
  hasAlumniPass: false,
  isEventFreeEligible: false,
  canAccessEvents: true,
  canAccessAccommodation: true,
  canAccessDelegate: true,
  canAccessAlumni: true,
});
