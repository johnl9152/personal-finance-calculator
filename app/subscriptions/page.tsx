"use client";

import { useState, useEffect } from "react";
import {
  Subscription,
  SubscriptionCategory,
  SUBSCRIPTION_CATEGORIES,
  SUBSCRIPTION_CATEGORY_COLORS,
  getSubscriptions,
  saveSubscriptions,
  formatCurrency,
} from "@/app/lib/storage";

function ordinalSuffix(day: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = day % 100;
  return day + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [mounted, setMounted] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [billingDay, setBillingDay] = useState("1");
  const [category, setCategory] = useState<SubscriptionCategory>("Streaming");
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setMounted(true);
    setSubscriptions(getSubscriptions());
  }, []);

  const monthlyTotal = subscriptions.reduce((sum, s) => sum + s.amount, 0);

  // Group by category
  const grouped = SUBSCRIPTION_CATEGORIES.reduce(
    (acc, cat) => {
      const items = subscriptions.filter((s) => s.category === cat);
      if (items.length > 0) {
        acc[cat] = items;
      }
      return acc;
    },
    {} as Partial<Record<SubscriptionCategory, Subscription[]>>
  );

  function handleAddSubscription(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!name.trim()) {
      setFormError("Please enter a subscription name.");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setFormError("Please enter a valid monthly amount.");
      return;
    }

    const parsedDay = parseInt(billingDay, 10);
    if (isNaN(parsedDay) || parsedDay < 1 || parsedDay > 31) {
      setFormError("Billing day must be between 1 and 31.");
      return;
    }

    const newSub: Subscription = {
      id: crypto.randomUUID(),
      name: name.trim(),
      amount: Math.round(parsedAmount * 100) / 100,
      billingDay: parsedDay,
      category,
      notes: notes.trim(),
    };

    const updated = [...subscriptions, newSub];
    setSubscriptions(updated);
    saveSubscriptions(updated);

    // Reset
    setName("");
    setAmount("");
    setBillingDay("1");
    setCategory("Streaming");
    setNotes("");
  }

  function handleDelete(id: string) {
    const updated = subscriptions.filter((s) => s.id !== id);
    setSubscriptions(updated);
    saveSubscriptions(updated);
  }

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
      <div>
        <h1 className="text-2xl font-bold text-white">
          Fixed Costs &amp; Subscriptions
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Track your recurring monthly expenses
        </p>
      </div>

      {/* Add Subscription Form */}
      <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
        <h2 className="text-base font-semibold text-gray-200 mb-4">
          Add Subscription
        </h2>
        <form onSubmit={handleAddSubscription} className="space-y-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs text-gray-400 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Netflix"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Monthly Amount
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
                Billing Day (1–31)
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={billingDay}
                onChange={(e) => setBillingDay(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as SubscriptionCategory)
                }
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              >
                {SUBSCRIPTION_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-400 mb-1">
                Notes (optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional notes"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
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
            Add Subscription
          </button>
        </form>
      </div>

      {/* Monthly Total */}
      <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">Total Monthly Fixed Costs</p>
          <p className="text-4xl font-bold text-white mt-1">
            {formatCurrency(monthlyTotal)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">
            {subscriptions.length} subscription
            {subscriptions.length !== 1 ? "s" : ""}
          </p>
          <p className="text-sm text-gray-400 mt-0.5">
            {formatCurrency(monthlyTotal * 12)}/yr
          </p>
        </div>
      </div>

      {/* Subscriptions grouped by category */}
      {subscriptions.length === 0 ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 px-5 py-10 text-center text-gray-500 text-sm">
          No subscriptions yet. Add your first one above.
        </div>
      ) : (
        <div className="space-y-4">
          {(Object.keys(grouped) as SubscriptionCategory[]).map((cat) => {
            const items = grouped[cat]!;
            const subtotal = items.reduce((sum, s) => sum + s.amount, 0);
            return (
              <div
                key={cat}
                className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
              >
                {/* Category header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-gray-800/40">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${SUBSCRIPTION_CATEGORY_COLORS[cat]}`}
                    >
                      {cat}
                    </span>
                    <span className="text-xs text-gray-500">
                      {items.length} item{items.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-200">
                    {formatCurrency(subtotal)}/mo
                  </span>
                </div>

                {/* Items */}
                <div className="divide-y divide-gray-800">
                  {items.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">
                            {sub.name}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Bills on the {ordinalSuffix(sub.billingDay)}
                          {sub.notes && (
                            <span className="ml-2 text-gray-600">
                              · {sub.notes}
                            </span>
                          )}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-white shrink-0">
                        {formatCurrency(sub.amount)}
                        <span className="text-xs text-gray-500 font-normal">
                          /mo
                        </span>
                      </span>
                      <button
                        onClick={() => handleDelete(sub.id)}
                        aria-label="Delete subscription"
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
