/**
 * Thin fetch wrapper for the FastAPI backend. No external dependency —
 * just a typed request helper, a JWT token store, and a typed error.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const TOKEN_KEY = "ejfinance_token";

export class ApiError extends Error {
  status: number;
  detail: unknown;

  constructor(status: number, detail: unknown) {
    super(typeof detail === "string" ? detail : `Request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

/** JWT is stored client-side; the backend issues bearer tokens, not cookies. */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_KEY);
  }
}

export type QueryParams = Record<string, string | number | boolean | undefined | null>;

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** JSON-serialized as the request body. */
  body?: unknown;
  /** application/x-www-form-urlencoded body — only /auth/login needs this (OAuth2PasswordRequestForm). */
  form?: URLSearchParams;
  params?: QueryParams;
  /** Attach the stored bearer token. Defaults to true; auth.ts turns this off for register/login. */
  auth?: boolean;
}

function buildUrl(path: string, params?: QueryParams): string {
  const url = new URL(path, API_URL);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, form, params, auth = true } = options;

  const headers: Record<string, string> = { Accept: "application/json" };
  let requestBody: string | undefined;

  if (form) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    requestBody = form.toString();
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    requestBody = JSON.stringify(body);
  }

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(buildUrl(path, params), { method, headers, body: requestBody });

  // DELETE endpoints return 204 with no body.
  if (res.status === 204) {
    return undefined as T;
  }

  const contentType = res.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json") ? await res.json() : undefined;

  if (!res.ok) {
    // FastAPI's HTTPException body is {"detail": "..."}
    throw new ApiError(res.status, payload && "detail" in payload ? payload.detail : payload);
  }

  return payload as T;
}
