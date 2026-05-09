"use client";

import { useState, useEffect } from "react";
import {
  Expense,
  ExpenseCategory,
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_COLORS,
  EXPENSE_CATEGORY_BAR_COLORS,
  getExpenses,
  saveExpenses,
  formatCurrency,
} from "@/app/lib/storage";

function getTodayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDisplayDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTodayLong(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [mounted, setMounted] = useState(false);

  // Form state
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("Food & Dining");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(getTodayISO());
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setMounted(true);
    setExpenses(getExpenses());
  }, []);

  const today = getTodayISO();

  const todayExpenses = expenses.filter((e) => e.date === today);
  const todayTotal = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

  const currentMonth = today.slice(0, 7); // YYYY-MM
  const monthExpenses = expenses.filter((e) => e.date.startsWith(currentMonth));
  const monthTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Per-category totals for today
  const todayCategoryTotals = EXPENSE_CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat] = todayExpenses
        .filter((e) => e.category === cat)
        .reduce((s, e) => s + e.amount, 0);
      return acc;
    },
    {} as Record<ExpenseCategory, number>
  );

  // Per-category totals for month (for bar chart)
  const monthCategoryTotals = EXPENSE_CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat] = monthExpenses
        .filter((e) => e.category === cat)
        .reduce((s, e) => s + e.amount, 0);
      return acc;
    },
    {} as Record<ExpenseCategory, number>
  );

  const maxMonthCategoryValue = Math.max(
    ...Object.values(monthCategoryTotals),
    1
  );

  function handleAddExpense(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setFormError("Please enter a valid amount greater than 0.");
      return;
    }
    if (!description.trim()) {
      setFormError("Please enter a description.");
      return;
    }

    const newExpense: Expense = {
      id: crypto.randomUUID(),
      amount: Math.round(parsedAmount * 100) / 100,
      category,
      description: description.trim(),
      date,
    };

    const updated = [newExpense, ...expenses];
    setExpenses(updated);
    saveExpenses(updated);

    // Reset form
    setAmount("");
    setDescription("");
    setDate(getTodayISO());
    setCategory("Food & Dining");
  }

  function handleDelete(id: string) {
    const updated = expenses.filter((e) => e.id !== id);
    setExpenses(updated);
    saveExpenses(updated);
  }

  function handleClearAll() {
    if (
      confirm(
        "Are you sure you want to delete ALL expense data? This cannot be undone."
      )
    ) {
      setExpenses([]);
      saveExpenses([]);
    }
  }

  // Sort expenses by date desc, then by insertion order (id)
  const sortedExpenses = [...expenses].sort((a, b) => {
    if (b.date !== a.date) return b.date.localeCompare(a.date);
    return 0;
  });

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-40">
        <span className="text-gray-500 text-sm">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Spending Tracker</h1>
          <p className="text-gray-400 text-sm mt-1">{formatTodayLong()}</p>
        </div>
      </div>

      {/* Add Expense Form */}
      <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
        <h2 className="text-base font-semibold text-gray-200 mb-4">
          Add Expense
        </h2>
        <form onSubmit={handleAddExpense} className="space-y-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Amount (USD)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as ExpenseCategory)
                }
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              >
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs text-gray-400 mb-1">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Coffee"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 [color-scheme:dark]"
              />
            </div>
          </div>
          {formError && (
            <p className="text-red-400 text-xs">{formError}</p>
          )}
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
          >
            Add Expense
          </button>
        </form>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Today's Summary */}
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <h2 className="text-sm font-medium text-gray-400 mb-1">
            Today&apos;s Spending
          </h2>
          <p className="text-3xl font-bold text-white mb-4">
            {formatCurrency(todayTotal)}
          </p>
          <div className="space-y-2">
            {EXPENSE_CATEGORIES.map((cat) => {
              const val = todayCategoryTotals[cat];
              if (val === 0) return null;
              return (
                <div key={cat} className="flex items-center justify-between">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${EXPENSE_CATEGORY_COLORS[cat]}`}
                  >
                    {cat}
                  </span>
                  <span className="text-sm text-gray-200">
                    {formatCurrency(val)}
                  </span>
                </div>
              );
            })}
            {todayTotal === 0 && (
              <p className="text-gray-500 text-sm">No spending today.</p>
            )}
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <h2 className="text-sm font-medium text-gray-400 mb-1">
            This Month
          </h2>
          <p className="text-3xl font-bold text-white mb-4">
            {formatCurrency(monthTotal)}
          </p>
          <div className="space-y-2">
            {EXPENSE_CATEGORIES.map((cat) => {
              const val = monthCategoryTotals[cat];
              const pct =
                monthTotal > 0
                  ? Math.round((val / maxMonthCategoryValue) * 100)
                  : 0;
              return (
                <div key={cat} className="space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">{cat}</span>
                    <span className="text-xs text-gray-300">
                      {formatCurrency(val)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${EXPENSE_CATEGORY_BAR_COLORS[cat]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-gray-900 rounded-xl border border-gray-800">
        <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-200">
            All Transactions
          </h2>
          <span className="text-xs text-gray-500">{expenses.length} total</span>
        </div>

        {sortedExpenses.length === 0 ? (
          <div className="px-5 py-10 text-center text-gray-500 text-sm">
            No transactions yet. Add your first expense above.
          </div>
        ) : (
          <div className="divide-y divide-gray-800 max-h-[480px] overflow-y-auto">
            {sortedExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${EXPENSE_CATEGORY_COLORS[expense.category]}`}
                    >
                      {expense.category}
                    </span>
                    <span className="text-sm text-gray-200 truncate">
                      {expense.description}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatDisplayDate(expense.date)}
                  </p>
                </div>
                <span className="text-sm font-semibold text-white shrink-0">
                  {formatCurrency(expense.amount)}
                </span>
                <button
                  onClick={() => handleDelete(expense.id)}
                  aria-label="Delete expense"
                  className="text-gray-600 hover:text-red-400 transition-colors shrink-0 p-1 rounded"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clear all */}
      {expenses.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleClearAll}
            className="text-xs text-gray-500 hover:text-red-400 transition-colors border border-gray-800 hover:border-red-900 px-4 py-2 rounded-lg"
          >
            Clear all data
          </button>
        </div>
      )}
    </div>
  );
}
