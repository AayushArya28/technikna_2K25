import { createContext } from "react";

export const EntitlementsContext = createContext({
  loading: true,
  isBitStudent: false,
  hasDelegatePass: false,
  isEventFreeEligible: false,
  canAccessAccommodation: true,
  canAccessDelegate: true,
  canAccessAlumni: true,
});
