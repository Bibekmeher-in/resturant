import { MenuCard } from "@/components/menu/menu-card";
import type { MenuItem } from "@/types";

type MenuGridProps = {
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  canAddToCart: boolean;
};

export function MenuGrid({ items, onAddToCart, canAddToCart }: MenuGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
      {items.map((item) => (
        <li key={item.id}>
          <MenuCard
            canAddToCart={canAddToCart}
            item={item}
            onAddToCart={onAddToCart}
          />
        </li>
      ))}
    </ul>
  );
}
