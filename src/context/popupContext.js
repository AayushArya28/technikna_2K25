import { createContext } from "react";

export const PopupContext = createContext({
  push: () => {},
  error: () => {},
  success: () => {},
  info: () => {},
});
