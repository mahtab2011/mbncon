// Client for OptiFabric's new auth/subscription backend (server/optifabric-api),
// built at the user's explicit request to mirror OptiSewing's subscription
// system. Bearer-token auth stored in localStorage — no cookies, no CSRF
// surface, same decision made for OptiSewing.
const API_BASE = process.env.NEXT_PUBLIC_OPTIFABRIC_API_URL ?? "http://localhost:3011/api/v1";
const TOKEN_STORAGE_KEY = "optifabric_access_token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    // Ignore storage failures (private browsing, disabled storage).
  }
}

export function clearStoredToken(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // Ignore storage failures.
  }
}

// Decode-only, no signature verification (the browser has no way to verify
// a signature without the server's secret anyway) — this can only make a
// caller MORE cautious than the backend, never less, since the backend
// independently re-checks signature, expiry, and revocation on every real
// request regardless of what this returns. Any missing/malformed payload or
// exp claim is treated as expired (fail closed).
export function isTokenExpired(token: string): boolean {
  try {
    const payloadSegment = token.split(".")[1];
    if (!payloadSegment) return true;

    const base64 = payloadSegment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const payload = JSON.parse(atob(padded)) as { exp?: unknown };

    if (typeof payload.exp !== "number") return true;
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!response.ok) {
    // A 401 means the token is no longer good for any reason (expired,
    // revoked, malformed) — clear it so it isn't resent. Never navigate
    // here: apiFetch is also used by login/signup, where a 401 just means
    // "wrong credentials," not "session invalid," and must not redirect.
    if (response.status === 401) {
      clearStoredToken();
    }
    const body = await response.text();
    throw new Error(`API request failed (${response.status}): ${body}`);
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
