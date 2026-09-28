"use client";

type QuantityControlsProps = {
  itemName: string;
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

export function QuantityControls({
  itemName,
  quantity,
  onDecrease,
  onIncrease,
}: QuantityControlsProps) {
  return (
    <div
      aria-label={`Quantity for ${itemName}`}
      className="inline-flex h-10 items-center rounded-xl border border-stone-200 bg-white"
      role="group"
    >
      <button
        aria-label={
          quantity === 1
            ? `Remove one ${itemName} from cart`
            : `Decrease ${itemName} quantity`
        }
        className="grid size-10 place-items-center rounded-l-xl text-lg font-semibold text-stone-700 transition hover:bg-stone-100 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-orange-700"
        onClick={onDecrease}
        type="button"
      >
        {quantity === 1 ? "×" : "−"}
      </button>
      <span
        aria-live="polite"
        className="min-w-8 text-center text-sm font-semibold tabular-nums text-stone-900"
      >
        {quantity}
      </span>
      <button
        aria-label={`Increase ${itemName} quantity`}
        className="grid size-10 place-items-center rounded-r-xl text-lg font-semibold text-stone-700 transition hover:bg-stone-100 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-orange-700"
        onClick={onIncrease}
        type="button"
      >
        +
      </button>
    </div>
  );
}
