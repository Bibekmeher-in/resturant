"use client";

import { useEffect, useState } from "react";
import { fetchOrder, OrdersApiError } from "@/lib/api/order-client";
import { formatCurrency } from "@/lib/calculations/order-totals";
import { formatDateTime } from "@/lib/formatters/date-time";
import type { Order } from "@/types";
import { OrderStatusBadge } from "@/components/ui/order-status-badge";
import { OrderError } from "@/components/admin/order-error";
import { OrderLoading } from "@/components/admin/order-loading";
import { OrderStatusControl } from "@/components/admin/order-status-control";

type OrderDetailsProps = {
  orderId: string;
  onClose: () => void;
  onOrderUpdated: (order: Order) => void;
};

export function OrderDetails({
  orderId,
  onClose,
  onOrderUpdated,
}: OrderDetailsProps) {
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
            : "Unable to load this order right now. Please try again.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [orderId, retryCount]);

  function updateVisibleOrder(updatedOrder: Order) {
    setOrder(updatedOrder);
    onOrderUpdated(updatedOrder);
  }

  return (
    <section
      aria-labelledby="order-details-heading"
      aria-live={isLoading ? "polite" : undefined}
      className="mt-6 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7"
      id="selected-order-details"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-800">
            Order details
          </p>
          <h2
            className="mt-2 break-all text-xl font-semibold text-stone-950"
            id="order-details-heading"
          >
            {orderId}
          </h2>
        </div>
        <button
          aria-label="Close order details"
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-stone-300 px-4 text-sm font-semibold text-stone-800 hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800"
          onClick={onClose}
          type="button"
        >
          Close
        </button>
      </div>

      {isLoading ? (
        <div className="mt-6">
          <OrderLoading label="Loading order details" />
        </div>
      ) : errorMessage ? (
        <div className="mt-6">
          <OrderError
            message={errorMessage}
            onRetry={() => {
              setErrorMessage("");
              setIsLoading(true);
              setRetryCount((count) => count + 1);
            }}
          />
        </div>
      ) : order ? (
        <>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <section aria-labelledby="detail-customer-heading">
              <h3
                className="text-base font-semibold text-stone-950"
                id="detail-customer-heading"
              >
                Customer
              </h3>
              <dl className="mt-3 grid gap-4 sm:grid-cols-2">
                <div className="min-w-0">
                  <dt className="text-xs font-bold uppercase tracking-wide text-stone-500">
                    Name
                  </dt>
                  <dd className="mt-1 break-words text-sm text-stone-900">
                    {order.customerName}
                  </dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-xs font-bold uppercase tracking-wide text-stone-500">
                    Mobile
                  </dt>
                  <dd className="mt-1 break-words text-sm text-stone-900">
                    {order.mobile}
                  </dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-xs font-bold uppercase tracking-wide text-stone-500">
                    Email
                  </dt>
                  <dd className="mt-1 break-all text-sm text-stone-900">
                    {order.email}
                  </dd>
                </div>
                <div className="min-w-0 sm:col-span-2">
                  <dt className="text-xs font-bold uppercase tracking-wide text-stone-500">
                    Delivery address
                  </dt>
                  <dd className="mt-1 break-words text-sm leading-6 text-stone-900">
                    {order.address}
                  </dd>
                </div>
              </dl>
            </section>

            <section aria-labelledby="detail-order-heading">
              <h3
                className="text-base font-semibold text-stone-950"
                id="detail-order-heading"
              >
                Order
              </h3>
              <dl className="mt-3 grid gap-4 sm:grid-cols-2">
                <div className="min-w-0">
                  <dt className="text-xs font-bold uppercase tracking-wide text-stone-500">
                    Created
                  </dt>
                  <dd className="mt-1 text-sm text-stone-900">
                    <time dateTime={order.createdAt}>
                      {formatDateTime(order.createdAt)}
                    </time>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wide text-stone-500">
                    Current status
                  </dt>
                  <dd className="mt-1">
                    <OrderStatusBadge status={order.status} />
                  </dd>
                </div>
              </dl>
            </section>
          </div>

          <section
            aria-labelledby="detail-items-heading"
            className="mt-7 border-t border-stone-200 pt-6"
          >
            <h3
              className="text-base font-semibold text-stone-950"
              id="detail-items-heading"
            >
              Items
            </h3>
            <ul className="mt-3 divide-y divide-stone-100">
              {order.items.map((item) => (
                <li
                  className="flex min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3 first:pt-0"
                  key={item.menuItemId}
                >
                  <div className="min-w-0">
                    <p className="break-words text-sm font-medium text-stone-950">
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs text-stone-600">
                      Qty {item.quantity} · {formatCurrency(item.price)} each
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold tabular-nums text-stone-900">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="ml-auto mt-4 max-w-sm space-y-3 border-t border-stone-200 pt-4 text-sm">
              <div className="flex justify-between gap-4 text-stone-700">
                <dt>Subtotal</dt>
                <dd className="font-medium tabular-nums text-stone-950">
                  {formatCurrency(order.subtotal)}
                </dd>
              </div>
              <div className="flex justify-between gap-4 text-stone-700">
                <dt>Tax</dt>
                <dd className="font-medium tabular-nums text-stone-950">
                  {formatCurrency(order.tax)}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-stone-200 pt-3 text-base font-bold text-stone-950">
                <dt>Grand total</dt>
                <dd className="tabular-nums">{formatCurrency(order.total)}</dd>
              </div>
            </dl>
          </section>

          <div className="mt-6 border-t border-stone-200 pt-6">
            <OrderStatusControl
              onOrderUpdated={updateVisibleOrder}
              order={order}
            />
          </div>
        </>
      ) : null}
    </section>
  );
}
