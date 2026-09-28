export function CheckoutLoading() {
  return (
    <div
      aria-label="Restoring your cart"
      className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_0.8fr]"
      role="status"
    >
      <div className="h-96 animate-pulse rounded-3xl bg-stone-200" />
      <div className="h-96 animate-pulse rounded-3xl bg-stone-200" />
      <span className="sr-only">Restoring your cart…</span>
    </div>
  );
}
