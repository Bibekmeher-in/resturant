import { TAX_RATE } from "@/lib/constants";
import type { OrderItem } from "@/types";

export function calculateSubtotal(
  items: readonly Pick<OrderItem, "price" | "quantity">[],
): number {
  return items.reduce((subtotal, item) => subtotal + item.price * item.quantity, 0);
}

export function calculateTax(subtotal: number): number {
  return Math.round((subtotal * TAX_RATE + Number.EPSILON) * 100) / 100;
}

export function calculateTotal(subtotal: number, tax: number): number {
  return subtotal + tax;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}
