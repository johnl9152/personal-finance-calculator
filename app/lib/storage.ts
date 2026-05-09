export type ExpenseCategory =
  | "Food & Dining"
  | "Transport"
  | "Shopping"
  | "Entertainment"
  | "Other";

export type SubscriptionCategory =
  | "Housing"
  | "Utilities"
  | "Streaming"
  | "Software"
  | "Insurance"
  | "Health"
  | "Other";

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string; // ISO date string YYYY-MM-DD
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingDay: number; // 1-31
  category: SubscriptionCategory;
  notes: string;
}

const EXPENSES_KEY = "spending_dashboard_expenses";
const SUBSCRIPTIONS_KEY = "spending_dashboard_subscriptions";

export function getExpenses(): Expense[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(EXPENSES_KEY);
    return raw ? (JSON.parse(raw) as Expense[]) : [];
  } catch {
    return [];
  }
}

export function saveExpenses(expenses: Expense[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
}

export function getSubscriptions(): Subscription[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SUBSCRIPTIONS_KEY);
    return raw ? (JSON.parse(raw) as Subscription[]) : [];
  } catch {
    return [];
  }
}

export function saveSubscriptions(subscriptions: Subscription[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(subscriptions));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "Food & Dining",
  "Transport",
  "Shopping",
  "Entertainment",
  "Other",
];

export const SUBSCRIPTION_CATEGORIES: SubscriptionCategory[] = [
  "Housing",
  "Utilities",
  "Streaming",
  "Software",
  "Insurance",
  "Health",
  "Other",
];

export const EXPENSE_CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  "Food & Dining": "bg-orange-500 text-white",
  Transport: "bg-blue-500 text-white",
  Shopping: "bg-purple-500 text-white",
  Entertainment: "bg-pink-500 text-white",
  Other: "bg-gray-500 text-white",
};

export const EXPENSE_CATEGORY_BAR_COLORS: Record<ExpenseCategory, string> = {
  "Food & Dining": "bg-orange-500",
  Transport: "bg-blue-500",
  Shopping: "bg-purple-500",
  Entertainment: "bg-pink-500",
  Other: "bg-gray-500",
};

export const SUBSCRIPTION_CATEGORY_COLORS: Record<
  SubscriptionCategory,
  string
> = {
  Housing: "bg-amber-600 text-white",
  Utilities: "bg-cyan-600 text-white",
  Streaming: "bg-violet-500 text-white",
  Software: "bg-blue-600 text-white",
  Insurance: "bg-teal-600 text-white",
  Health: "bg-rose-500 text-white",
  Other: "bg-gray-500 text-white",
};
