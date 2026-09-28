import {
  calculateSubtotal,
  calculateTax,
  calculateTotal,
} from "@/lib/calculations/order-totals";
import type { Order, OrderItem } from "@/types";

type OrderDetails = Omit<Order, "subtotal" | "tax" | "total">;

function createOrder(details: OrderDetails): Order {
  const subtotal = calculateSubtotal(details.items);
  const tax = calculateTax(subtotal);

  return {
    ...details,
    subtotal,
    tax,
    total: calculateTotal(subtotal, tax),
  };
}

function item(
  menuItemId: number,
  name: string,
  price: number,
  quantity: number,
  image: string,
): OrderItem {
  return { menuItemId, name, price, quantity, image };
}

export const orders: Order[] = [
  createOrder({
    id: "ORD-20260928-001",
    customerName: "Aarav Mehta",
    mobile: "+91 98765 43210",
    email: "aarav.mehta@example.com",
    address: "14, Indiranagar 12th Main, Bengaluru, Karnataka 560038",
    items: [
      item(
        1,
        "Margherita Classic",
        399,
        1,
        "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=800&q=80",
      ),
      item(
        11,
        "Cold Brew Coffee",
        169,
        2,
        "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80",
      ),
    ],
    status: "Pending",
    createdAt: "2026-09-28T13:42:00.000Z",
  }),
  createOrder({
    id: "ORD-20260928-002",
    customerName: "Priya Nair",
    mobile: "+91 98450 12345",
    email: "priya.nair@example.com",
    address: "22, Koramangala 5th Block, Bengaluru, Karnataka 560095",
    items: [
      item(
        3,
        "Smoky Paneer Tikka Pizza",
        499,
        1,
        "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=800&q=80",
      ),
      item(
        12,
        "Masala Chai",
        79,
        2,
        "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=800&q=80",
      ),
    ],
    status: "Accepted",
    createdAt: "2026-09-28T13:18:00.000Z",
  }),
  createOrder({
    id: "ORD-20260928-003",
    customerName: "Kabir Shah",
    mobile: "+91 98201 67890",
    email: "kabir.shah@example.com",
    address: "8, Linking Road, Bandra West, Mumbai, Maharashtra 400050",
    items: [
      item(
        6,
        "Smash Cheeseburger",
        349,
        2,
        "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
      ),
      item(
        9,
        "Fresh Lime Soda",
        99,
        2,
        "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80",
      ),
    ],
    status: "Preparing",
    createdAt: "2026-09-28T12:56:00.000Z",
  }),
  createOrder({
    id: "ORD-20260928-004",
    customerName: "Ananya Iyer",
    mobile: "+91 99860 24680",
    email: "ananya.iyer@example.com",
    address: "31, Adyar, Chennai, Tamil Nadu 600020",
    items: [
      item(
        2,
        "Garden Veggie Pizza",
        449,
        1,
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
      ),
      item(
        14,
        "New York Cheesecake",
        229,
        1,
        "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
      ),
    ],
    status: "Completed",
    createdAt: "2026-09-28T12:21:00.000Z",
  }),
  createOrder({
    id: "ORD-20260927-005",
    customerName: "Rohan Desai",
    mobile: "+91 98980 54321",
    email: "rohan.desai@example.com",
    address: "5, Satellite Road, Ahmedabad, Gujarat 380015",
    items: [
      item(
        5,
        "Classic Chicken Burger",
        279,
        2,
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
      ),
      item(
        10,
        "Mango Lassi",
        149,
        2,
        "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80",
      ),
    ],
    status: "Completed",
    createdAt: "2026-09-27T14:05:00.000Z",
  }),
  createOrder({
    id: "ORD-20260927-006",
    customerName: "Sneha Kulkarni",
    mobile: "+91 97654 32109",
    email: "sneha.kulkarni@example.com",
    address: "17, Koregaon Park, Pune, Maharashtra 411001",
    items: [
      item(
        4,
        "Four Cheese Pizza",
        529,
        1,
        "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80",
      ),
      item(
        13,
        "Chocolate Fudge Brownie",
        179,
        2,
        "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
      ),
    ],
    status: "Accepted",
    createdAt: "2026-09-27T13:37:00.000Z",
  }),
  createOrder({
    id: "ORD-20260927-007",
    customerName: "Ishaan Verma",
    mobile: "+91 98111 22334",
    email: "ishaan.verma@example.com",
    address: "42, Sector 18, Noida, Uttar Pradesh 201301",
    items: [
      item(
        7,
        "Crispy Aloo Tikki Burger",
        199,
        2,
        "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=800&q=80",
      ),
      item(
        15,
        "Gulab Jamun Sundae",
        199,
        1,
        "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80",
      ),
    ],
    status: "Pending",
    createdAt: "2026-09-27T12:49:00.000Z",
  }),
];
