import { useContext } from "react";
import { PopupContext } from "./popupContext";

export function usePopup() {
  return useContext(PopupContext);
}
