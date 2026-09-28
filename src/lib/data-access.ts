import { menuItems } from "@/data/menu-items";
import { orders } from "@/data/orders";
import type { MenuItem, Order, OrderStatus } from "@/types";

export function getMenuItems(): readonly MenuItem[] {
  return menuItems;
}

export function getMenuItemById(id: number): MenuItem | undefined {
  return menuItems.find((menuItem) => menuItem.id === id);
}

export function getOrders(): readonly Order[] {
  return orders;
}

export function getOrderById(id: string): Order | undefined {
  return orders.find((order) => order.id === id);
}

export function addOrder(order: Order): void {
  orders.push(order);
}

export function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Order | undefined {
  const order = orders.find((currentOrder) => currentOrder.id === id);

  if (order) {
    order.status = status;
  }

  return order;
}
