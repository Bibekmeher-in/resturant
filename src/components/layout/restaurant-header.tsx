import { restaurant } from "@/data/restaurant";
import { CartButton } from "@/components/cart/cart-button";

export function RestaurantHeader() {
  return (
    <header className="relative overflow-hidden border-b border-orange-100 bg-[#fff8ef]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-36 size-96 rounded-full bg-orange-100/70 blur-3xl"
      />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-5 pb-9 pt-6 sm:px-8 sm:pb-12 sm:pt-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12 lg:pb-14">
        <div className="max-w-3xl">
          <div className="flex items-center justify-between gap-4">
            <a
              aria-label={`${restaurant.name} home`}
              className="inline-flex items-center gap-3 rounded-full text-sm font-semibold text-stone-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-700"
              href="#top"
            >
              <span
                aria-hidden="true"
                className="grid size-10 place-items-center rounded-2xl bg-orange-700 text-lg text-white shadow-sm"
              >
                E
              </span>
              {restaurant.name}
            </a>
            <div className="sm:hidden">
              <CartButton />
            </div>
          </div>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-orange-800">
            Good food, good company
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-stone-950 sm:text-5xl lg:text-6xl">
            Made with care.
            <br className="hidden sm:block" /> Served with warmth.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-stone-600 sm:text-lg">
            {restaurant.description}
          </p>
          <ul
            aria-label="Cuisine"
            className="mt-5 flex flex-wrap gap-2"
          >
            {restaurant.cuisines.map((cuisine) => (
              <li
                className="rounded-full border border-orange-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-stone-700"
                key={cuisine}
              >
                {cuisine}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-4 rounded-2xl border border-orange-100 bg-white/80 p-4 shadow-sm sm:flex-row sm:gap-6 lg:min-w-72 lg:flex-col lg:items-start lg:gap-3">
          <div className="hidden sm:block">
            <CartButton />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 lg:flex-col lg:items-start lg:gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-stone-800">
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-emerald-600"
            />
            Open today
          </div>
          <div className="text-sm text-stone-600">
            <p>{restaurant.hours}</p>
            <p className="mt-1">{restaurant.address}</p>
          </div>
          </div>
        </div>
      </div>
    </header>
  );
}
