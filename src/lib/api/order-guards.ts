import {
  ORDER_STATUSES,
  type Order,
  type OrderItem,
  type OrderReceipt,
} from "@/types";

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isOrderItem(value: unknown): value is OrderItem {
  return (
    isRecord(value) &&
    typeof value.menuItemId === "number" &&
    Number.isInteger(value.menuItemId) &&
    value.menuItemId > 0 &&
    typeof value.name === "string" &&
    typeof value.price === "number" &&
    Number.isFinite(value.price) &&
    value.price >= 0 &&
    typeof value.quantity === "number" &&
    Number.isSafeInteger(value.quantity) &&
    value.quantity > 0 &&
    typeof value.image === "string"
  );
}

export function isOrder(value: unknown): value is Order {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    value.id.length > 0 &&
    typeof value.customerName === "string" &&
    typeof value.mobile === "string" &&
    typeof value.email === "string" &&
    typeof value.address === "string" &&
    Array.isArray(value.items) &&
    value.items.length > 0 &&
    value.items.every(isOrderItem) &&
    typeof value.status === "string" &&
    ORDER_STATUSES.some((status) => status === value.status) &&
    typeof value.subtotal === "number" &&
    Number.isFinite(value.subtotal) &&
    value.subtotal >= 0 &&
    typeof value.tax === "number" &&
    Number.isFinite(value.tax) &&
    value.tax >= 0 &&
    typeof value.total === "number" &&
    Number.isFinite(value.total) &&
    value.total >= 0 &&
    typeof value.createdAt === "string" &&
    !Number.isNaN(Date.parse(value.createdAt))
  );
}

export function isOrderReceipt(value: unknown): value is OrderReceipt {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    value.id.length > 0 &&
    Array.isArray(value.items) &&
    value.items.length > 0 &&
    value.items.every(isOrderItem) &&
    typeof value.status === "string" &&
    ORDER_STATUSES.some((status) => status === value.status) &&
    typeof value.subtotal === "number" &&
    Number.isFinite(value.subtotal) &&
    value.subtotal >= 0 &&
    typeof value.tax === "number" &&
    Number.isFinite(value.tax) &&
    value.tax >= 0 &&
    typeof value.total === "number" &&
    Number.isFinite(value.total) &&
    value.total >= 0 &&
    typeof value.createdAt === "string" &&
    !Number.isNaN(Date.parse(value.createdAt))
  );
}

export function isOrderList(value: unknown): value is Order[] {
  return Array.isArray(value) && value.every(isOrder);
}
