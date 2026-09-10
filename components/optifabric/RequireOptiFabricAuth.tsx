"use client";

// Phase 1 frontend auth guard for OptiFabric's protected engineering/product
// routes. Presence-only check (no JWT decoding/expiry, no cookies, no
// middleware — localStorage isn't reachable from either): a
// stored token means the user has signed in; validity is still enforced by
// the backend on any actual API call. Rendered only inside the protected
// layout.tsx files, never on /optifabric/login or /optifabric/signup, so
// there is no redirect loop to guard against.
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredToken } from "@/lib/optifabric/apiClient";

export function RequireOptiFabricAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (getStoredToken()) {
      setIsAuthenticated(true);
    } else {
      router.replace("/optifabric/login");
    }
  }, [router]);

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
