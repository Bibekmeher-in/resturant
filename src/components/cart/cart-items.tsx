import { CartItem } from "@/components/cart/cart-item";
import type { CartItem as CartItemType } from "@/types";

type CartItemsProps = {
  items: CartItemType[];
};

export function CartItems({ items }: CartItemsProps) {
  return (
    <ul aria-label="Items in your cart" className="divide-y-0">
      {items.map((item) => (
        <CartItem item={item} key={item.menuItemId} />
      ))}
    </ul>
  );
}
