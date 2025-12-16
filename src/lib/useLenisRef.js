import { useContext } from "react";
import { LenisContext } from "./lenisContext";

export function useLenisRef() {
  const ref = useContext(LenisContext);
  if (!ref) throw new Error("useLenisRef must be used inside LenisProvider");
  return ref;
}
