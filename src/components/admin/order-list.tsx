import { OrderStatusBadge } from "@/components/ui/order-status-badge";
import { formatCurrency } from "@/lib/calculations/order-totals";
import { formatDateTime } from "@/lib/formatters/date-time";
import type { Order } from "@/types";

type OrderListProps = {
  orders: Order[];
  selectedOrderId: string | null;
  onSelectOrder: (orderId: string) => void;
};

export function OrderList({
  orders,
  selectedOrderId,
  onSelectOrder,
}: OrderListProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
      <div
        aria-hidden="true"
        className="hidden grid-cols-[minmax(9rem,1.15fr)_minmax(8rem,1fr)_minmax(7rem,0.9fr)_minmax(6rem,0.7fr)_minmax(7rem,0.8fr)_auto] items-center gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-bold uppercase tracking-wide text-stone-500 lg:grid"
      >
        <span>Order</span>
        <span>Customer</span>
        <span>Placed</span>
        <span>Status</span>
        <span>Total</span>
        <span className="sr-only">Actions</span>
      </div>

      <ul className="divide-y divide-stone-100">
        {orders.map((order) => (
          <li key={order.id}>
            <article className="grid min-w-0 gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(9rem,1.15fr)_minmax(8rem,1fr)_minmax(7rem,0.9fr)_minmax(6rem,0.7fr)_minmax(7rem,0.8fr)_auto] lg:items-center lg:gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 lg:hidden">
                  Order
                </p>
                <p className="mt-1 break-all text-sm font-semibold text-stone-950 lg:mt-0">
                  {order.id}
                </p>
                <p className="mt-1 text-xs text-stone-600">
                  {order.items.length}{" "}
                  {order.items.length === 1 ? "item" : "items"}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 lg:hidden">
                  Customer
                </p>
                <p className="mt-1 break-words text-sm font-medium text-stone-900 lg:mt-0">
                  {order.customerName}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 lg:hidden">
                  Placed
                </p>
                <time
                  className="mt-1 block text-sm text-stone-700 lg:mt-0"
                  dateTime={order.createdAt}
                >
                  {formatDateTime(order.createdAt)}
                </time>
              </div>

              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-500 lg:hidden">
                  Status
                </p>
                <OrderStatusBadge status={order.status} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 lg:hidden">
                  Total
                </p>
                <p className="mt-1 text-sm font-bold tabular-nums text-stone-950 lg:mt-0">
                  {formatCurrency(order.total)}
                </p>
              </div>

              <button
                aria-controls={
                  selectedOrderId === order.id
                    ? "selected-order-details"
                    : undefined
                }
                aria-expanded={selectedOrderId === order.id}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-stone-300 px-4 text-sm font-semibold text-stone-800 transition hover:border-orange-400 hover:bg-orange-50 hover:text-orange-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800 lg:w-auto"
                onClick={() => onSelectOrder(order.id)}
                type="button"
              >
                View Details
                <span className="sr-only"> for order {order.id}</span>
              </button>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
