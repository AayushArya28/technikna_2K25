import { useEffect, useMemo, useState } from "react";
import { EntitlementsContext } from "./entitlementsContext";
import { useAuth } from "./useAuth.jsx";
import { BASE_API_URL, fetchJson, getAuthHeaders } from "../lib/api.js";
import { computeEntitlements } from "../lib/eligibility.js";

export function EntitlementsProvider({ children }) {
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [delegateStatus, setDelegateStatus] = useState("");

  const email = user?.email;

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (authLoading) {
        setLoading(true);
        return;
      }

      if (!user) {
        setDelegateStatus("");
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
          setDelegateStatus("");
        } else {
          setDelegateStatus(String(data?.status || ""));
        }
      } catch {
        if (!cancelled) setDelegateStatus("");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  const value = useMemo(() => {
    const computed = computeEntitlements({ email, delegateStatus });
    return {
      loading,
      ...computed,
    };
  }, [delegateStatus, email, loading]);

  return <EntitlementsContext.Provider value={value}>{children}</EntitlementsContext.Provider>;
}
