/**
 * Mirrors the Pydantic schemas in backend/app/api/v1/endpoints/*.py and
 * backend/app/schemas/user.py. Keep these in sync by hand — the backend
 * has no OpenAPI-to-TS generation step yet.
 */

export type TransactionType = "expense" | "income";
export type CategoryType = "expense" | "income" | "both";
export type RecurringFrequency = "daily" | "weekly" | "monthly" | "yearly";

// --- Auth / User (schemas/user.py) ---

export interface UserCreate {
  email: string;
  full_name?: string | null;
  password: string;
}

export interface UserUpdate {
  full_name?: string | null;
  email?: string | null;
}

export interface UserResponse {
  id: number;
  email: string;
  full_name: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

// --- Categories (endpoints/categories.py) ---

export interface CategoryCreate {
  name: string;
  type: CategoryType;
  icon?: string | null;
  color?: string | null;
}

export interface CategoryResponse extends CategoryCreate {
  id: number;
  is_default: boolean;
  user_id: number | null;
}

// --- Accounts (endpoints/accounts.py) ---

export interface AccountCreate {
  name: string;
  account_type: string;
  balance?: number;
  currency?: string;
}

export interface AccountUpdate {
  name?: string;
  account_type?: string;
  currency?: string;
  is_active?: boolean;
}

export interface AccountResponse extends AccountCreate {
  id: number;
  user_id: number;
  is_active: boolean;
  balance: number;
  currency: string;
}

// --- Transactions (endpoints/transactions.py) ---

export interface TransactionCreate {
  type: TransactionType;
  amount: number;
  description?: string | null;
  notes?: string | null;
  /** ISO datetime */
  date: string;
  category_id: number;
  account_id: number;
}

export interface TransactionResponse extends TransactionCreate {
  id: number;
  user_id: number;
  receipt_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface TransactionFilters {
  skip?: number;
  limit?: number;
  type?: TransactionType;
  category_id?: number;
  account_id?: number;
  /** YYYY-MM-DD */
  start_date?: string;
  end_date?: string;
  min_amount?: number;
  max_amount?: number;
}

// --- Budgets (endpoints/budgets.py) ---

export interface BudgetCreate {
  amount: number;
  /** YYYY-MM-DD, first day of the month */
  month: string;
  category_id: number;
}

export interface BudgetResponse extends BudgetCreate {
  id: number;
  user_id: number;
}

export interface BudgetFilters {
  month?: string;
  category_id?: number;
}

// --- Recurring transactions (endpoints/recurring_transactions.py) ---

export interface RecurringTransactionCreate {
  type: TransactionType;
  amount: number;
  description?: string | null;
  frequency: RecurringFrequency;
  /** YYYY-MM-DD */
  start_date: string;
  end_date?: string | null;
  category_id: number;
  account_id: number;
}

export interface RecurringTransactionUpdate {
  amount?: number;
  description?: string | null;
  frequency?: RecurringFrequency;
  end_date?: string | null;
  is_active?: boolean;
}

export interface RecurringTransactionResponse extends RecurringTransactionCreate {
  id: number;
  user_id: number;
  next_occurrence: string;
  is_active: boolean;
}
