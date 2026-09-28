"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { CartEmpty } from "@/components/cart/cart-empty";
import { CartItems } from "@/components/cart/cart-items";
import { CartSummary } from "@/components/cart/cart-summary";
import { selectCartItemCount, useCartStore } from "@/store/cart-store";

type CartDrawerProps = {
  onClose: () => void;
};

export function CartDrawer({ onClose }: CartDrawerProps) {
  const items = useCartStore((state) => state.items);
  const itemCount = useCartStore(selectCartItemCount);
  const clearCart = useCartStore((state) => state.clearCart);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not(:disabled), [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements.item(0);
      const lastElement = focusableElements.item(focusableElements.length - 1);

      if (
        event.shiftKey &&
        (document.activeElement === firstElement ||
          document.activeElement === dialogRef.current)
      ) {
        event.preventDefault();
        lastElement?.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === lastElement ||
          document.activeElement === dialogRef.current)
      ) {
        event.preventDefault();
        firstElement?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Close cart"
        className="absolute inset-0 cursor-default bg-stone-950/40"
        onClick={onClose}
        tabIndex={-1}
        type="button"
      />
      <section
        aria-labelledby="cart-title"
        aria-modal="true"
        className="relative flex h-full w-full max-w-lg flex-col bg-white shadow-2xl"
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <header className="flex items-center justify-between border-b border-stone-200 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-xl font-semibold text-stone-950" id="cart-title">
              Your cart
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              {items.length === 0
                ? "No items yet"
                : `${itemCount} ${itemCount === 1 ? "item" : "items"}`}
            </p>
          </div>
          <button
            aria-label="Close cart"
            className="grid size-11 place-items-center rounded-xl border border-stone-200 text-xl text-stone-600 transition hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
            onClick={onClose}
            type="button"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        {items.length === 0 ? (
          <CartEmpty onBrowse={onClose} />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 sm:px-6">
              <CartItems items={items} />
            </div>
            <footer className="space-y-5 border-t border-stone-200 bg-white px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
              <CartSummary />
              <div className="grid gap-3">
                <button
                  className="min-h-12 rounded-xl border border-stone-300 px-4 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
                  onClick={onClose}
                  type="button"
                >
                  Continue browsing
                </button>
                <Link
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-orange-700 px-4 text-sm font-semibold text-white transition hover:bg-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800"
                  href="/checkout"
                  onClick={onClose}
                >
                  Proceed to checkout
                </Link>
                <button
                  className="min-h-11 rounded-xl px-4 text-sm font-semibold text-stone-500 transition hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
                  onClick={clearCart}
                  type="button"
                >
                  Clear cart
                </button>
              </div>
            </footer>
          </>
        )}
      </section>
    </div>,
    document.body,
  );
}
