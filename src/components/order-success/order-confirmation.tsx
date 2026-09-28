"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchOrder, OrdersApiError } from "@/lib/api/order-client";
import { formatCurrency } from "@/lib/calculations/order-totals";
import { formatDateTime } from "@/lib/formatters/date-time";
import { OrderStatusBadge } from "@/components/ui/order-status-badge";
import type { Order } from "@/types";
import { OrderSuccessLoading } from "@/components/order-success/order-success-loading";

type OrderConfirmationProps = {
  orderId: string;
};

export function OrderConfirmation({ orderId }: OrderConfirmationProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetchOrder(orderId, controller.signal)
      .then(setOrder)
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setErrorMessage(
          error instanceof OrdersApiError
            ? error.message
            : "Unable to load your order right now. Please try again.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [orderId, retryCount]);

  if (isLoading) {
    return <OrderSuccessLoading />;
  }

  if (!order) {
    const isNotFound = errorMessage === "That order could not be found.";

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffdfa] px-5 py-12">
        <section
          aria-labelledby="order-load-error-heading"
          className="w-full max-w-lg rounded-3xl border border-stone-200 bg-white px-6 py-12 text-center shadow-sm sm:px-10"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-800">
            {isNotFound ? "Order not found" : "Confirmation unavailable"}
          </p>
          <h1
            className="mt-3 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl"
            id="order-load-error-heading"
          >
            {isNotFound
              ? "We couldn’t find that order"
              : "We couldn’t load your order"}
          </h1>
          <p
            aria-live="assertive"
            className="mt-3 text-sm leading-6 text-stone-600"
            role="alert"
          >
            {isNotFound
              ? "The order reference may be invalid or no longer available."
              : "Your order details are temporarily unavailable. Please try again."}
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            {!isNotFound && (
              <button
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800"
                onClick={() => {
                  setErrorMessage("");
                  setIsLoading(true);
                  setRetryCount((count) => count + 1);
                }}
                type="button"
              >
                Try again
              </button>
            )}
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

  return (
    <main className="min-h-screen bg-[#fffdfa] px-4 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <header className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-8 text-center sm:px-10 sm:py-10">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
            <svg
              aria-hidden="true"
              className="size-7"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="m5 12.5 4.5 4.5L19 7"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
              />
            </svg>
          </span>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
            Thanks for ordering with us
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Order Placed Successfully
          </h1>
          <p className="mt-3 text-sm leading-6 text-stone-700 sm:text-base">
            Your order is confirmed. We’ll get it ready with care.
          </p>
          <dl className="mx-auto mt-6 grid max-w-2xl gap-4 border-t border-emerald-200 pt-5 text-left sm:grid-cols-3 sm:text-center">
            <div className="min-w-0">
              <dt className="text-xs font-semibold uppercase tracking-wide text-stone-600">
                Order ID
              </dt>
              <dd className="mt-1 break-all text-sm font-semibold text-stone-950">
                {order.id}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-stone-600">
                Order status
              </dt>
              <dd className="mt-1">
                <OrderStatusBadge status={order.status} />
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-stone-600">
                Placed on
              </dt>
              <dd className="mt-1 text-sm font-medium text-stone-950">
                <time dateTime={order.createdAt}>
                  {formatDateTime(order.createdAt)}
                </time>
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-stone-600">
            This page shows the latest order status when loaded. It does not
            update in real time.
          </p>
        </header>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
          <section
            aria-labelledby="order-summary-heading"
            className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  className="text-xl font-semibold text-stone-950"
                  id="order-summary-heading"
                >
                  Order summary
                </h2>
                <p className="mt-1 text-sm text-stone-600">
                  {order.items.length}{" "}
                  {order.items.length === 1 ? "item" : "items"} in your order
                </p>
              </div>
            </div>

            <ul className="mt-5 divide-y divide-stone-100">
              {order.items.map((item) => (
                <li
                  className="flex min-w-0 gap-4 py-4 first:pt-0 last:pb-0"
                  key={item.menuItemId}
                >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-stone-100 sm:size-20">
                    <Image
                      alt={item.name}
                      className="object-cover"
                      fill
                      sizes="80px"
                      src={item.image}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="break-words text-sm font-semibold text-stone-950 sm:text-base">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-sm text-stone-600">
                      Qty {item.quantity} · {formatCurrency(item.price)} each
                    </p>
                  </div>
                  <p className="shrink-0 self-center text-right text-sm font-semibold text-stone-900 sm:text-base">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-3 border-t border-stone-200 pt-5 text-sm">
              <div className="flex justify-between gap-4 text-stone-700">
                <dt>Subtotal</dt>
                <dd className="font-medium text-stone-950">
                  {formatCurrency(order.subtotal)}
                </dd>
              </div>
              <div className="flex justify-between gap-4 text-stone-700">
                <dt>Tax</dt>
                <dd className="font-medium text-stone-950">
                  {formatCurrency(order.tax)}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-stone-200 pt-4 text-base font-bold text-stone-950">
                <dt>Grand total</dt>
                <dd>{formatCurrency(order.total)}</dd>
              </div>
            </dl>
          </section>

          <section
            aria-labelledby="customer-information-heading"
            className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7"
          >
            <h2
              className="text-xl font-semibold text-stone-950"
              id="customer-information-heading"
            >
              Delivery details
            </h2>
            <dl className="mt-5 space-y-5">
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-stone-500">
                  Customer
                </dt>
                <dd className="mt-1 break-words text-sm font-medium text-stone-900">
                  {order.customerName}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-stone-500">
                  Mobile number
                </dt>
                <dd className="mt-1 break-words text-sm font-medium text-stone-900">
                  {order.mobile}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-stone-500">
                  Email
                </dt>
                <dd className="mt-1 break-all text-sm font-medium text-stone-900">
                  {order.email}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-stone-500">
                  Delivery address
                </dt>
                <dd className="mt-1 break-words text-sm leading-6 text-stone-900">
                  {order.address}
                </dd>
              </div>
            </dl>
          </section>
        </div>

        <div className="mt-7 flex justify-center">
          <Link
            className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-orange-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800 sm:w-auto sm:min-w-52"
            href="/"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
