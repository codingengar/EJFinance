import { apiFetch, type QueryParams } from "./client";
import type { TransactionCreate, TransactionFilters, TransactionResponse } from "./types";

export function getTransactions(filters: TransactionFilters = {}): Promise<TransactionResponse[]> {
  return apiFetch<TransactionResponse[]>("/api/v1/transactions/", { params: filters as QueryParams });
}

export function getTransaction(id: number): Promise<TransactionResponse> {
  return apiFetch<TransactionResponse>(`/api/v1/transactions/${id}`);
}

export function createTransaction(data: TransactionCreate): Promise<TransactionResponse> {
  return apiFetch<TransactionResponse>("/api/v1/transactions/", { method: "POST", body: data });
}

export function updateTransaction(id: number, data: TransactionCreate): Promise<TransactionResponse> {
  return apiFetch<TransactionResponse>(`/api/v1/transactions/${id}`, { method: "PUT", body: data });
}

export function deleteTransaction(id: number): Promise<void> {
  return apiFetch<void>(`/api/v1/transactions/${id}`, { method: "DELETE" });
}
