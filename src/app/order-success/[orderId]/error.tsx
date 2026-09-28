"use client";

import Link from "next/link";

type OrderErrorProps = {
  reset: () => void;
};

export default function OrderError({ reset }: OrderErrorProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffdfa] px-5 py-12">
      <section
        aria-labelledby="order-error-heading"
        className="w-full max-w-lg rounded-3xl border border-stone-200 bg-white px-6 py-12 text-center shadow-sm sm:px-10"
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-800">
          Confirmation unavailable
        </p>
        <h1
          className="mt-3 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl"
          id="order-error-heading"
        >
          We couldn’t load your order
        </h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          Your order details are temporarily unavailable. Please try again, or
          return to the menu.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800"
            onClick={reset}
            type="button"
          >
            Try again
          </button>
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-orange-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800"
            href="/"
          >
            Back to menu
          </Link>
        </div>
      </section>
    </main>
  );
}
