import { apiFetch, type QueryParams } from "./client";
import type { BudgetCreate, BudgetFilters, BudgetResponse } from "./types";

export function getBudgets(filters: BudgetFilters = {}): Promise<BudgetResponse[]> {
  return apiFetch<BudgetResponse[]>("/api/v1/budgets/", { params: filters as QueryParams });
}

export function getBudget(id: number): Promise<BudgetResponse> {
  return apiFetch<BudgetResponse>(`/api/v1/budgets/${id}`);
}

export function createBudget(data: BudgetCreate): Promise<BudgetResponse> {
  return apiFetch<BudgetResponse>("/api/v1/budgets/", { method: "POST", body: data });
}

export function updateBudget(id: number, data: BudgetCreate): Promise<BudgetResponse> {
  return apiFetch<BudgetResponse>(`/api/v1/budgets/${id}`, { method: "PUT", body: data });
}

export function deleteBudget(id: number): Promise<void> {
  return apiFetch<void>(`/api/v1/budgets/${id}`, { method: "DELETE" });
}
