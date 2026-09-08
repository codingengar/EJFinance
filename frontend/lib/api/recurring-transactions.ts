import { apiFetch } from "./client";
import type {
  RecurringTransactionCreate,
  RecurringTransactionResponse,
  RecurringTransactionUpdate,
} from "./types";

export function getRecurringTransactions(isActive?: boolean): Promise<RecurringTransactionResponse[]> {
  return apiFetch<RecurringTransactionResponse[]>("/api/v1/recurring-transactions/", {
    params: { is_active: isActive },
  });
}

export function getRecurringTransaction(id: number): Promise<RecurringTransactionResponse> {
  return apiFetch<RecurringTransactionResponse>(`/api/v1/recurring-transactions/${id}`);
}

export function createRecurringTransaction(
  data: RecurringTransactionCreate
): Promise<RecurringTransactionResponse> {
  return apiFetch<RecurringTransactionResponse>("/api/v1/recurring-transactions/", {
    method: "POST",
    body: data,
  });
}

export function updateRecurringTransaction(
  id: number,
  data: RecurringTransactionUpdate
): Promise<RecurringTransactionResponse> {
  return apiFetch<RecurringTransactionResponse>(`/api/v1/recurring-transactions/${id}`, {
    method: "PUT",
    body: data,
  });
}

export function deleteRecurringTransaction(id: number): Promise<void> {
  return apiFetch<void>(`/api/v1/recurring-transactions/${id}`, { method: "DELETE" });
}
