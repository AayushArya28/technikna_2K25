import { useEffect, useMemo, useState } from "react";
import { EntitlementsContext } from "./entitlementsContext";
import { useAuth } from "./useAuth.jsx";
import { BASE_API_URL, fetchJson, getAuthHeaders } from "../lib/api.js";
import { computeEntitlements } from "../lib/eligibility.js";

export function EntitlementsProvider({ children }) {
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [delegateStatus, setDelegateStatus] = useState("");
  const [alumniStatus, setAlumniStatus] = useState("");

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
        setAlumniStatus("");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const headers = await getAuthHeaders({ json: false });
        const [delegateRes, alumniRes] = await Promise.all([
          fetchJson(`${BASE_API_URL}/delegate/status-self`, { method: "GET", headers }),
          fetchJson(`${BASE_API_URL}/alumni/status`, { method: "GET", headers }),
        ]);

        const { resp: delegateResp, data: delegateData } = delegateRes;
        const { resp: alumniResp, data: alumniData } = alumniRes;

        if (cancelled) return;

        setDelegateStatus(delegateResp.ok ? String(delegateData?.status || "") : "");
        setAlumniStatus(alumniResp.ok ? String(alumniData?.status || "") : "");
      } catch {
        if (!cancelled) {
          setDelegateStatus("");
          setAlumniStatus("");
        }
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
    const computed = computeEntitlements({ email, delegateStatus, alumniStatus });
    return {
      loading,
      ...computed,
    };
  }, [alumniStatus, delegateStatus, email, loading]);

  return <EntitlementsContext.Provider value={value}>{children}</EntitlementsContext.Provider>;
}
