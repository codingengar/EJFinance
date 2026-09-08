import { apiFetch } from "./client";
import type { CategoryCreate, CategoryResponse } from "./types";

export function getCategories(): Promise<CategoryResponse[]> {
  return apiFetch<CategoryResponse[]>("/api/v1/categories/");
}

export function getCategory(id: number): Promise<CategoryResponse> {
  return apiFetch<CategoryResponse>(`/api/v1/categories/${id}`);
}

export function createCategory(data: CategoryCreate): Promise<CategoryResponse> {
  return apiFetch<CategoryResponse>("/api/v1/categories/", { method: "POST", body: data });
}

export function updateCategory(id: number, data: CategoryCreate): Promise<CategoryResponse> {
  return apiFetch<CategoryResponse>(`/api/v1/categories/${id}`, { method: "PUT", body: data });
}

export function deleteCategory(id: number): Promise<void> {
  return apiFetch<void>(`/api/v1/categories/${id}`, { method: "DELETE" });
}
