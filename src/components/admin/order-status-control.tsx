"use client";

import { useState } from "react";
import { OrdersApiError, updateOrderStatus } from "@/lib/api/order-client";
import type { Order } from "@/types";
import { ORDER_STATUSES } from "@/types";

type OrderStatusControlProps = {
  order: Order;
  onOrderUpdated: (order: Order) => void;
};

export function OrderStatusControl({
  order,
  onOrderUpdated,
}: OrderStatusControlProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmation, setConfirmation] = useState("");

  async function changeStatus(value: string) {
    const nextStatus = ORDER_STATUSES.find((status) => status === value);

    if (!nextStatus || nextStatus === order.status || isUpdating) {
      return;
    }

    setIsUpdating(true);
    setErrorMessage("");
    setConfirmation("");

    try {
      const updatedOrder = await updateOrderStatus(order.id, nextStatus);
      onOrderUpdated(updatedOrder);
      setConfirmation(`Order status updated to ${updatedOrder.status}.`);
    } catch (error) {
      setErrorMessage(
        error instanceof OrdersApiError
          ? error.message
          : "Unable to update the order status. Please try again.",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
      <label
        className="block text-sm font-semibold text-stone-800"
        htmlFor="order-status"
      >
        Update order status
      </label>
      <select
        className="mt-2 min-h-12 w-full rounded-xl border border-stone-300 bg-white px-3 text-base text-stone-950 outline-none focus-visible:border-orange-600 focus-visible:ring-4 focus-visible:ring-orange-100 disabled:cursor-wait disabled:bg-stone-100 sm:max-w-xs"
        disabled={isUpdating}
        id="order-status"
        onChange={(event) => void changeStatus(event.target.value)}
        value={order.status}
      >
        {ORDER_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      {isUpdating && (
        <p className="mt-2 text-sm text-stone-600" role="status">
          Updating status…
        </p>
      )}
      {confirmation && (
        <p className="mt-2 text-sm font-medium text-emerald-800" role="status">
          {confirmation}
        </p>
      )}
      {errorMessage && (
        <p
          aria-live="assertive"
          className="mt-2 text-sm font-medium text-red-800"
          role="alert"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}
