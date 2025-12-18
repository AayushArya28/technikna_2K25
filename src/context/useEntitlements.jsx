import { useContext } from "react";
import { EntitlementsContext } from "./entitlementsContext";

export function useEntitlements() {
  return useContext(EntitlementsContext);
}
