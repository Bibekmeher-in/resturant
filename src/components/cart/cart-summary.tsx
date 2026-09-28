"use client";

import { calculateSubtotal, calculateTax, calculateTotal, formatCurrency } from "@/lib/calculations/order-totals";
import { useCartStore } from "@/store/cart-store";

export function CartSummary() {
  const items = useCartStore((state) => state.items);
  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal);
  const total = calculateTotal(subtotal, tax);

  return (
    <section aria-labelledby="cart-summary-title" className="border-t border-stone-200 pt-5">
      <h3 className="sr-only" id="cart-summary-title">
        Cart summary
      </h3>
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between gap-4 text-stone-600">
          <dt>Subtotal</dt>
          <dd className="font-medium tabular-nums text-stone-900">
            {formatCurrency(subtotal)}
          </dd>
        </div>
        <div className="flex justify-between gap-4 text-stone-600">
          <dt>Tax (5%)</dt>
          <dd className="font-medium tabular-nums text-stone-900">
            {formatCurrency(tax)}
          </dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-stone-200 pt-4 text-base font-bold text-stone-950">
          <dt>Grand total</dt>
          <dd className="tabular-nums">{formatCurrency(total)}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs leading-5 text-stone-500">
        Taxes are calculated at 5%.
      </p>
    </section>
  );
}
