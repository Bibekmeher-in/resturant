import type { OrderStatus } from "@/types";

type OrderEmptyProps = {
  status: OrderStatus | "All";
  onClearFilter: () => void;
};

export function OrderEmpty({ status, onClearFilter }: OrderEmptyProps) {
  return (
    <div className="rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center">
      <h2 className="text-lg font-semibold text-stone-950">
        {status === "All" ? "No orders found" : `No ${status} orders found`}
      </h2>
      <p className="mt-2 text-sm leading-6 text-stone-600">
        {status === "All"
          ? "Orders will appear here when customers place them."
          : `There are no orders with ${status.toLowerCase()} status right now.`}
      </p>
      {status !== "All" && (
        <button
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl border border-stone-300 px-4 text-sm font-semibold text-stone-800 hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800"
          onClick={onClearFilter}
          type="button"
        >
          Show all orders
        </button>
      )}
    </div>
  );
}
