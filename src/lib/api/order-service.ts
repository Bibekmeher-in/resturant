import {
  calculateSubtotal,
  calculateTax,
  calculateTotal,
} from "@/lib/calculations/order-totals";
import { ApiError, isRecord } from "@/lib/api/http";
import { checkoutSchema, type CheckoutValues } from "@/lib/validations/checkout";
import {
  addOrder,
  getMenuItemById,
  getOrderById,
  updateOrderStatus,
} from "@/lib/data-access";
import {
  ORDER_STATUSES,
  type Order,
  type OrderItem,
  type OrderReceipt,
  type OrderStatus,
} from "@/types";

function isOrderStatus(value: unknown): value is OrderStatus {
  return (
    typeof value === "string" &&
    ORDER_STATUSES.some((status) => status === value)
  );
}

function parseNewOrder(value: unknown): CheckoutValues {
  const result = checkoutSchema.safeParse(value);

  if (!result.success) {
    throw new ApiError(
      result.error.issues[0]?.message ?? "Order details are invalid",
      400,
    );
  }

  return result.data;
}

function buildOrderItems(items: CheckoutValues["items"]): OrderItem[] {
  return items.map(({ menuItemId, quantity }) => {
    const menuItem = getMenuItemById(menuItemId);

    if (!menuItem || !menuItem.available) {
      throw new ApiError(`Menu item ${menuItemId} is no longer available`, 400);
    }

    return {
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity,
      image: menuItem.image,
    };
  });
}

export function createOrder(value: unknown): Order {
  const details = parseNewOrder(value);
  const items = buildOrderItems(details.items);
  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal);
  const createdAt = new Date().toISOString();

  const order: Order = {
    id: `ORD-${createdAt.replace(/\D/g, "")}-${crypto.randomUUID()}`,
    ...details,
    items,
    status: "Pending",
    subtotal,
    tax,
    total: calculateTotal(subtotal, tax),
    createdAt,
  };

  addOrder(order);
  return order;
}

export function getOrderReceipt(id: string): OrderReceipt | undefined {
  const order = getOrderById(id);

  if (!order) {
    return undefined;
  }

  return {
    id: order.id,
    items: order.items,
    status: order.status,
    subtotal: order.subtotal,
    tax: order.tax,
    total: order.total,
    createdAt: order.createdAt,
  };
}

export function changeOrderStatus(
  id: string,
  value: unknown,
): Order {
  if (!isRecord(value) || !isOrderStatus(value.status)) {
    throw new ApiError(
      `status must be one of: ${ORDER_STATUSES.join(", ")}`,
      400,
    );
  }

  const order = getOrderById(id);

  if (!order) {
    throw new ApiError("Order not found", 404);
  }

  const updatedOrder = updateOrderStatus(id, value.status);

  if (!updatedOrder) {
    throw new ApiError("Order not found", 404);
  }

  return updatedOrder;
}
