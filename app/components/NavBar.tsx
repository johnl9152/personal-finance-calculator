"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 flex items-center gap-1 h-14">
        <span className="text-emerald-400 font-semibold text-sm mr-4 tracking-wide uppercase">
          Spend
        </span>
        <Link
          href="/"
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            pathname === "/"
              ? "bg-emerald-600 text-white"
              : "text-gray-400 hover:text-white hover:bg-gray-800"
          }`}
        >
          Dashboard
        </Link>
        <Link
          href="/subscriptions"
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            pathname === "/subscriptions"
              ? "bg-emerald-600 text-white"
              : "text-gray-400 hover:text-white hover:bg-gray-800"
          }`}
        >
          Subscriptions
        </Link>
      </div>
    </nav>
  );
}
