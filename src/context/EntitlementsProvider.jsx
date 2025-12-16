import { useEffect, useMemo, useState } from "react";
import { EntitlementsContext } from "./entitlementsContext";
import { useAuth } from "./useAuth.jsx";
import { BASE_API_URL, fetchJson, getAuthHeaders } from "../lib/api.js";
import { isBitStudentEmail, isPaidLikeStatus } from "../lib/eligibility.js";

export function EntitlementsProvider({ children }) {
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [hasDelegatePass, setHasDelegatePass] = useState(false);

  const isBitStudent = useMemo(() => isBitStudentEmail(user?.email), [user?.email]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (authLoading) {
        setLoading(true);
        return;
      }

      if (!user) {
        setHasDelegatePass(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const headers = await getAuthHeaders({ json: false });
        const { resp, data } = await fetchJson(`${BASE_API_URL}/delegate/status-self`, {
          method: "GET",
          headers,
        });

        if (cancelled) return;
        if (!resp.ok) {
          setHasDelegatePass(false);
        } else {
          const status = data?.status;
          setHasDelegatePass(isPaidLikeStatus(status));
        }
      } catch {
        if (!cancelled) setHasDelegatePass(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  const value = useMemo(
    () => ({
      loading,
      isBitStudent,
      hasDelegatePass,
      isEventFreeEligible: Boolean(isBitStudent || hasDelegatePass),
    }),
    [loading, isBitStudent, hasDelegatePass]
  );

  return <EntitlementsContext.Provider value={value}>{children}</EntitlementsContext.Provider>;
}
