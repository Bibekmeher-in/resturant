"use client";

type MenuEmptyProps = {
  hasFilters: boolean;
  onClearFilters: () => void;
};

export function MenuEmpty({ hasFilters, onClearFilters }: MenuEmptyProps) {
  return (
    <div className="rounded-3xl border border-dashed border-stone-300 bg-white px-5 py-14 text-center sm:py-20">
      <span
        aria-hidden="true"
        className="mx-auto grid size-14 place-items-center rounded-2xl bg-orange-50 text-2xl"
      >
        🍽
      </span>
      <h3 className="mt-5 text-xl font-semibold text-stone-950">
        {hasFilters ? "No dishes found" : "The menu is taking a little break"}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
        {hasFilters
          ? "Try another dish name or category, or clear your filters to see the full menu."
          : "There are no menu items available to show right now. Please check back soon."}
      </p>
      {hasFilters && (
        <button
          className="mt-5 min-h-11 rounded-xl border border-stone-300 px-4 text-sm font-semibold text-stone-800 transition hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
          onClick={onClearFilters}
          type="button"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
