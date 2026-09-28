import type { Metadata } from "next";
import { OrderManagement } from "@/components/admin/order-management";

export const metadata: Metadata = {
  title: "Order Management | The Ember Table",
  description: "View and update restaurant orders.",
};

export default function AdminOrdersPage() {
  return (
    <main className="min-h-screen bg-[#fffdfa] px-4 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-800">
            The Ember Table
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Order Management
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
            Review incoming orders, see customer and item details, and keep
            order statuses up to date.
          </p>
        </header>

        <OrderManagement />
      </div>
    </main>
  );
}
