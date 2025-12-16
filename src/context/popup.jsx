import React, { useCallback, useMemo, useRef, useState } from "react";

import { PopupContext } from "./popupContext";

function typeStyles(type) {
  if (type === "success") {
    return "border-emerald-500/40 bg-emerald-900/30 text-emerald-200";
  }
  if (type === "info") {
    return "border-white/20 bg-black/60 text-white/90";
  }
  return "border-red-500/40 bg-red-900/30 text-red-200";
}

export function PopupProvider({ children }) {
  const [items, setItems] = useState([]);
  const timersRef = useRef(new Map());

  const dismiss = useCallback((id) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
    const t = timersRef.current.get(id);
    if (t) {
      clearTimeout(t);
      timersRef.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (message, opts = {}) => {
      const type = opts.type || "error";
      const ttlMs = typeof opts.ttlMs === "number" ? opts.ttlMs : 4200;
      const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;

      setItems((prev) => [{ id, type, message: String(message || "") }, ...prev].slice(0, 4));

      const t = setTimeout(() => dismiss(id), ttlMs);
      timersRef.current.set(id, t);
      return id;
    },
    [dismiss]
  );

  const api = useMemo(
    () => ({
      push,
      error: (msg, opts) => push(msg, { ...(opts || {}), type: "error" }),
      success: (msg, opts) => push(msg, { ...(opts || {}), type: "success" }),
      info: (msg, opts) => push(msg, { ...(opts || {}), type: "info" }),
    }),
    [push]
  );

  return (
    <PopupContext.Provider value={api}>
      {children}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-4 z-[10050] flex w-[min(92vw,380px)] flex-col gap-3 pointer-events-none">
        {items.map((item) => (
          <div
            key={item.id}
            className={`pointer-events-auto rounded-2xl border px-4 py-3 text-sm shadow-[0_24px_60px_rgba(0,0,0,0.7)] backdrop-blur-xl ${typeStyles(
              item.type
            )}`}
            role="status"
            onClick={() => dismiss(item.id)}
          >
            {item.message}
          </div>
        ))}
      </div>
    </PopupContext.Provider>
  );
}
