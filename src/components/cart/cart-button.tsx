"use client";

import { selectCartItemCount, useCartStore } from "@/store/cart-store";

export function CartButton() {
  const itemCount = useCartStore(selectCartItemCount);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const openCart = useCartStore((state) => state.openCart);

  return (
    <>
      <button
        aria-label={
          hasHydrated
            ? `Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`
            : "Cart is restoring"
        }
        className="relative inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold text-stone-900 shadow-sm transition hover:border-stone-400 hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 disabled:cursor-wait disabled:opacity-60"
        onClick={openCart}
        disabled={!hasHydrated}
        type="button"
      >
        <svg
          aria-hidden="true"
          className="size-5"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L20 8H6"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
          <circle cx="10" cy="20" r="1" fill="currentColor" />
          <circle cx="17" cy="20" r="1" fill="currentColor" />
        </svg>
        <span>Cart</span>
        <span className="min-w-6 rounded-full bg-orange-100 px-1.5 py-1 text-center text-xs font-bold tabular-nums text-orange-900">
          {hasHydrated ? itemCount : "–"}
        </span>
      </button>
    </>
  );
}
