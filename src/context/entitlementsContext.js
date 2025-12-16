import { createContext } from "react";

export const EntitlementsContext = createContext({
  loading: true,
  isBitStudent: false,
  hasDelegatePass: false,
  isEventFreeEligible: false,
});
