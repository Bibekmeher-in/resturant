export function MenuSkeleton() {
  return (
    <ul
      aria-label="Loading menu items"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <li
          aria-hidden="true"
          className="overflow-hidden rounded-3xl border border-stone-200 bg-white"
          key={index}
        >
          <div className="aspect-[4/3] animate-pulse bg-stone-200" />
          <div className="space-y-3 p-4 sm:p-5">
            <div className="h-5 w-2/3 animate-pulse rounded bg-stone-200" />
            <div className="h-4 w-full animate-pulse rounded bg-stone-100" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-stone-100" />
            <div className="flex justify-between pt-2">
              <div className="h-6 w-16 animate-pulse rounded bg-stone-200" />
              <div className="h-11 w-28 animate-pulse rounded-xl bg-stone-200" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
