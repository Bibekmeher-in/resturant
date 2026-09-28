import Image from "next/image";
import { formatCurrency } from "@/lib/calculations/order-totals";
import type { MenuItem } from "@/types";

type MenuCardProps = {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  canAddToCart: boolean;
};

export function MenuCard({
  item,
  onAddToCart,
  canAddToCart,
}: MenuCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <Image
          alt={item.name}
          className={`object-cover transition-transform duration-300 group-hover:scale-[1.03] ${
            item.available ? "" : "grayscale-[30%]"
          }`}
          fill
          sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) 45vw, 360px"
          src={item.image}
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-stone-700 shadow-sm">
          {item.category}
        </span>
        {!item.available && (
          <span className="absolute bottom-3 left-3 rounded-full bg-stone-900/90 px-3 py-1.5 text-xs font-semibold text-white">
            Currently unavailable
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex-1">
          <h3 className="text-lg font-semibold leading-snug text-stone-950">
            {item.name}
          </h3>
          <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-stone-600">
            {item.description}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-lg font-bold tabular-nums text-stone-950">
            <span className="sr-only">Price </span>
            {formatCurrency(item.price)}
          </p>
          <button
            aria-label={
              item.available
                ? `Add ${item.name} to cart`
                : `${item.name} is unavailable`
            }
            className="min-h-11 rounded-xl bg-orange-700 px-4 text-sm font-semibold text-white transition hover:bg-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-500"
            disabled={!item.available || !canAddToCart}
            onClick={() => onAddToCart(item)}
            type="button"
          >
            Add to Cart
          </button>
        </div>
        {!item.available && (
          <p className="mt-2 text-right text-xs text-stone-500">
            Not available to order
          </p>
        )}
      </div>
    </article>
  );
}
