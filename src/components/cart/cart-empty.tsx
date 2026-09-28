export function CartEmpty({ onBrowse }: { onBrowse: () => void }) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center px-5 py-12 text-center">
      <span
        aria-hidden="true"
        className="grid size-16 place-items-center rounded-3xl bg-orange-50 text-3xl"
      >
        🛍
      </span>
      <h3 className="mt-5 text-xl font-semibold text-stone-950">
        Your cart is waiting
      </h3>
      <p className="mt-2 max-w-xs text-sm leading-6 text-stone-600">
        Find something delicious and add it to your order.
      </p>
      <a
        className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-orange-700 px-5 text-sm font-semibold text-white transition hover:bg-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800"
        href="#menu-title"
        onClick={onBrowse}
      >
        Browse Menu
      </a>
    </div>
  );
}
