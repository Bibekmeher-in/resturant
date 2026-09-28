"use client";

import Image from "next/image";
import { QuantityControls } from "@/components/cart/quantity-controls";
import { formatCurrency } from "@/lib/calculations/order-totals";
import { useCartStore } from "@/store/cart-store";
import type { CartItem as CartItemType } from "@/types";

type CartItemProps = {
  item: CartItemType;
};

export function CartItem({ item }: CartItemProps) {
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <li className="flex gap-3 border-b border-stone-100 py-4 last:border-b-0 sm:gap-4">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-stone-100">
        <Image
          alt=""
          className="object-cover"
          fill
          sizes="80px"
          src={item.image}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-stone-950">
              {item.name}
            </h3>
            <p className="mt-1 text-sm font-medium text-stone-700">
              {formatCurrency(item.price)}
            </p>
          </div>
          <button
            aria-label={`Remove ${item.name} from cart`}
            className="grid size-9 shrink-0 place-items-center rounded-lg text-sm font-medium text-stone-500 transition hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-orange-700"
            onClick={() => removeItem(item.menuItemId)}
            type="button"
          >
            <span aria-hidden="true">Remove</span>
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <QuantityControls
            itemName={item.name}
            onDecrease={() => decreaseQuantity(item.menuItemId)}
            onIncrease={() => increaseQuantity(item.menuItemId)}
            quantity={item.quantity}
          />
          <p className="text-sm font-bold tabular-nums text-stone-950">
            {formatCurrency(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </li>
  );
}
