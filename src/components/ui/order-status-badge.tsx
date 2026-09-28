import type { OrderStatus } from "@/types";

const statusStyles: Record<OrderStatus, string> = {
  Pending: "border-amber-300 bg-amber-50 text-amber-950",
  Accepted: "border-sky-300 bg-sky-50 text-sky-950",
  Preparing: "border-violet-300 bg-violet-50 text-violet-950",
  Completed: "border-emerald-300 bg-emerald-50 text-emerald-950",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      aria-label={`Order status: ${status}`}
      className={`inline-flex min-h-7 items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
