import { apiFetch } from "./client";
import type { AccountCreate, AccountResponse, AccountUpdate } from "./types";

export function getAccounts(): Promise<AccountResponse[]> {
  return apiFetch<AccountResponse[]>("/api/v1/accounts/");
}

export function getAccount(id: number): Promise<AccountResponse> {
  return apiFetch<AccountResponse>(`/api/v1/accounts/${id}`);
}

export function createAccount(data: AccountCreate): Promise<AccountResponse> {
  return apiFetch<AccountResponse>("/api/v1/accounts/", { method: "POST", body: data });
}

export function updateAccount(id: number, data: AccountUpdate): Promise<AccountResponse> {
  return apiFetch<AccountResponse>(`/api/v1/accounts/${id}`, { method: "PUT", body: data });
}

export function deleteAccount(id: number): Promise<void> {
  return apiFetch<void>(`/api/v1/accounts/${id}`, { method: "DELETE" });
}
