import { apiFetch, setToken } from "./client";
import type { Token, UserCreate, UserResponse } from "./types";

export function register(data: UserCreate): Promise<UserResponse> {
  return apiFetch<UserResponse>("/api/v1/auth/register", {
    method: "POST",
    body: data,
    auth: false,
  });
}

/** Logs in and stores the returned bearer token for subsequent requests. */
export async function login(email: string, password: string): Promise<Token> {
  const form = new URLSearchParams({ username: email, password });
  const token = await apiFetch<Token>("/api/v1/auth/login", {
    method: "POST",
    form,
    auth: false,
  });
  setToken(token.access_token);
  return token;
}

export function logout(): void {
  setToken(null);
}

export function getCurrentUser(): Promise<UserResponse> {
  return apiFetch<UserResponse>("/api/v1/auth/me");
}
