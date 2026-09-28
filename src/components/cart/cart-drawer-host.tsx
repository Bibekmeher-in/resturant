"use client";

import { CartDrawer } from "@/components/cart/cart-drawer";
import { useCartStore } from "@/store/cart-store";

export function CartDrawerHost() {
  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const closeCart = useCartStore((state) => state.closeCart);

  return isCartOpen ? <CartDrawer onClose={closeCart} /> : null;
}
