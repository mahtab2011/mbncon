"use client";

// Phase 1 frontend auth guard for OptiFabric's protected engineering/product
// routes, extended with local expiry detection and logout. A stored token
// that's missing, malformed, or locally expired is treated as
// unauthenticated and cleared; validity (including server-side revocation)
// is still authoritatively enforced by the backend on any actual API call —
// this guard can only be more restrictive than the backend, never less.
// Rendered only inside the protected layout.tsx files, never on
// /optifabric/login or /optifabric/signup, so there is no redirect loop to
// guard against.
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, clearStoredToken, getStoredToken, isTokenExpired } from "@/lib/optifabric/apiClient";

export function RequireOptiFabricAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getStoredToken();
    if (token && !isTokenExpired(token)) {
      setIsAuthenticated(true);
    } else {
      clearStoredToken();
      router.replace("/optifabric/login");
    }
  }, [router]);

  async function handleLogout() {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {
      // Best-effort only — an unreachable server, or a token that's already
      // expired/revoked, must never prevent logging out locally.
    }
    clearStoredToken();
    router.replace("/optifabric/login");
  }

  if (!isAuthenticated) return null;

  return (
    <>
      <div className="flex justify-end px-4 pt-2">
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
        >
          Log out
        </button>
      </div>
      {children}
    </>
  );
}
