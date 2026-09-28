export const ORDER_STATUSES = [
  "Pending",
  "Accepted",
  "Preparing",
  "Completed",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type OrderItem = {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export type Order = {
  id: string;
  customerName: string;
  mobile: string;
  email: string;
  address: string;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
};
