const CSRF_COOKIE = "XSRF-TOKEN";
const CSRF_HEADER = "X-XSRF-TOKEN";
const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const AUTH_ENDPOINTS_WITHOUT_RETRY = [
  "/api/v1/auth/login",
  "/api/v1/auth/refresh",
  "/api/v1/auth/me/password",
];
const ENDPOINTS_WITH_BUSINESS_UNAUTHORIZED = ["/api/v1/auth/login", "/api/v1/auth/me/password"];
const CSRF_PRIMING_PATH = "/api/v1/auth/csrf";

type RefreshResult = "refreshed" | "expired" | "unavailable";

// Refresh tokens rotate on every successful use.  Sharing this promise is
// therefore essential when several API calls receive 401 at the same time:
// otherwise the second request would reuse the now-revoked refresh token and
// incorrectly close the user's session.
let refreshInFlight: Promise<RefreshResult> | null = null;

export class ApiClientError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    super(`La API respondio con estado ${status}`);
    this.status = status;
    this.body = body;
  }
}

type Listener = () => void;
const sessionExpiredListeners = new Set<Listener>();

export function onSessionExpired(listener: Listener): () => void {
  sessionExpiredListeners.add(listener);
  return () => sessionExpiredListeners.delete(listener);
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function buildRequest(
  method: string,
  init: Omit<RequestInit, "body"> & { body?: unknown },
): RequestInit {
  const headers = new Headers(init.headers);
  let body = init.body as BodyInit | undefined;

  if (init.body !== undefined && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(init.body);
  }
  if (MUTATING_METHODS.has(method)) {
    const csrf = readCookie(CSRF_COOKIE);
    if (csrf) headers.set(CSRF_HEADER, csrf);
  }

  return { ...init, method, headers, body, credentials: "include" };
}

async function ensureCsrfCookie(): Promise<string | null> {
  const existing = readCookie(CSRF_COOKIE);
  if (existing) return existing;

  await fetch(CSRF_PRIMING_PATH, { method: "GET", credentials: "include" }).catch(() => undefined);
  return readCookie(CSRF_COOKIE);
}

async function refreshSession(): Promise<RefreshResult> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    try {
      const csrf = await ensureCsrfCookie();
      const response = await fetch("/api/v1/auth/refresh", {
        method: "POST",
        headers: csrf ? { [CSRF_HEADER]: csrf } : undefined,
        credentials: "include",
      });

      if (response.ok) return "refreshed";
      return response.status === 401 ? "expired" : "unavailable";
    } catch {
      return "unavailable";
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

export async function apiFetch<T = void>(
  path: string,
  init: Omit<RequestInit, "body"> & { body?: unknown } = {},
): Promise<T> {
  const method = (init.method ?? "GET").toUpperCase();
  if (MUTATING_METHODS.has(method)) await ensureCsrfCookie();
  const request = buildRequest(method, init);

  let response = await fetch(path, request);

  const canRetryAfterRefresh = !AUTH_ENDPOINTS_WITHOUT_RETRY.some((endpoint) =>
    path.startsWith(endpoint),
  );
  let shouldNotifySessionExpired = response.status === 401 && !canRetryAfterRefresh;
  if (response.status === 401 && canRetryAfterRefresh) {
    const refreshResult = await refreshSession();
    if (refreshResult === "refreshed") {
      response = await fetch(path, request);
      shouldNotifySessionExpired = response.status === 401;
    } else {
      // A 429, a network error, or a 5xx from refresh is temporary and must
      // not turn a valid session into a forced logout.  Only a definitive
      // 401 from refresh means that the refresh token is no longer usable.
      shouldNotifySessionExpired = refreshResult === "expired";
    }
  }

  const isBusinessUnauthorized = ENDPOINTS_WITH_BUSINESS_UNAUTHORIZED.some((endpoint) =>
    path.startsWith(endpoint),
  );
  if (response.status === 401 && !isBusinessUnauthorized && shouldNotifySessionExpired) {
    sessionExpiredListeners.forEach((listener) => listener());
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new ApiClientError(response.status, errorBody);
  }

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
