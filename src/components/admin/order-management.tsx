"use client";

import { useCallback, useEffect, useState } from "react";
import { OrderDetails } from "@/components/admin/order-details";
import { OrderEmpty } from "@/components/admin/order-empty";
import { OrderError } from "@/components/admin/order-error";
import { OrderList } from "@/components/admin/order-list";
import { OrderLoading } from "@/components/admin/order-loading";
import { fetchOrders, OrdersApiError } from "@/lib/api/order-client";
import type { Order, OrderStatus } from "@/types";
import { ORDER_STATUSES } from "@/types";

type OrderFilter = OrderStatus | "All";

const filters: OrderFilter[] = ["All", ...ORDER_STATUSES];

export function OrderManagement() {
  const [statusFilter, setStatusFilter] = useState<OrderFilter>("All");
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const status = statusFilter === "All" ? undefined : statusFilter;

    fetchOrders(status, controller.signal)
      .then((result) => {
        setOrders(result);
        if (statusFilter === "All") {
          setTotalOrders(result.length);
        }
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setErrorMessage(
          error instanceof OrdersApiError
            ? error.message
            : "Unable to load orders right now. Please try again.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [statusFilter, retryCount]);

  const selectFilter = useCallback(
    (filter: OrderFilter) => {
      if (filter === statusFilter) {
        return;
      }

      setStatusFilter(filter);
      setSelectedOrderId(null);
      setErrorMessage("");
      setIsLoading(true);
    },
    [statusFilter],
  );

  function retryList() {
    setErrorMessage("");
    setIsLoading(true);
    setRetryCount((count) => count + 1);
  }

  function updateListOrder(updatedOrder: Order) {
    setOrders((currentOrders) => {
      if (statusFilter === "All" || updatedOrder.status === statusFilter) {
        return currentOrders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order,
        );
      }

      return currentOrders.filter((order) => order.id !== updatedOrder.id);
    });
  }

  return (
    <>
      <section
        aria-label="Order overview"
        className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white px-5 py-4 shadow-sm"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-stone-500">
            Total orders
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-stone-950">
            {totalOrders}
          </p>
        </div>
        <p className="text-sm text-stone-600">
          Showing{" "}
          <span className="font-semibold text-stone-900">
            {statusFilter === "All" ? totalOrders : orders.length}
          </span>{" "}
          {statusFilter === "All" ? "orders" : `${statusFilter.toLowerCase()} orders`}
        </p>
      </section>

      <nav aria-label="Filter orders by status" className="mb-5">
        <ul className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
          {filters.map((filter) => {
            const isActive = statusFilter === filter;

            return (
              <li className="shrink-0" key={filter}>
                <button
                  aria-pressed={isActive}
                  className={`inline-flex min-h-11 items-center justify-center rounded-full border px-4 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800 ${
                    isActive
                      ? "border-orange-800 bg-orange-800 text-white"
                      : "border-stone-300 bg-white text-stone-700 hover:border-orange-400 hover:bg-orange-50"
                  }`}
                  onClick={() => selectFilter(filter)}
                  type="button"
                >
                  {filter}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <section aria-label="Orders" aria-live="polite">
        {isLoading ? (
          <OrderLoading label="Loading orders" />
        ) : errorMessage ? (
          <OrderError message={errorMessage} onRetry={retryList} />
        ) : orders.length === 0 ? (
          <OrderEmpty
            onClearFilter={() => selectFilter("All")}
            status={statusFilter}
          />
        ) : (
          <OrderList
            onSelectOrder={(orderId) =>
              setSelectedOrderId((currentId) =>
                currentId === orderId ? null : orderId,
              )
            }
            orders={orders}
            selectedOrderId={selectedOrderId}
          />
        )}
      </section>

      {selectedOrderId && !isLoading && !errorMessage && (
        <OrderDetails
          key={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
          onOrderUpdated={updateListOrder}
          orderId={selectedOrderId}
        />
      )}
    </>
  );
}
