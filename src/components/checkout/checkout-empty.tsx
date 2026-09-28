import Link from "next/link";

export function CheckoutEmpty() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-stone-200 bg-white px-6 py-14 text-center shadow-sm sm:py-16">
      <span
        aria-hidden="true"
        className="grid size-16 place-items-center rounded-3xl bg-orange-50 text-3xl"
      >
        🛍
      </span>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-stone-950">
        Your cart is empty
      </h1>
      <p className="mt-2 max-w-sm text-sm leading-6 text-stone-600">
        Add a few favourites from the menu before continuing to checkout.
      </p>
      <Link
        className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-orange-700 px-5 text-sm font-semibold text-white transition hover:bg-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800"
        href="/#menu-title"
      >
        Browse Menu
      </Link>
    </section>
  );
}
