"use client";

type MenuSearchProps = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  disabled: boolean;
};

export function MenuSearch({
  value,
  onChange,
  onClear,
  disabled,
}: MenuSearchProps) {
  return (
    <div className="relative">
      <label className="sr-only" htmlFor="menu-search">
        Search menu by dish name
      </label>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-stone-400"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="m16 16 4 4"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      </svg>
      <input
        autoComplete="off"
        className="h-14 w-full rounded-2xl border border-stone-200 bg-white pl-12 pr-12 text-base text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 hover:border-stone-300 focus-visible:border-orange-600 focus-visible:ring-4 focus-visible:ring-orange-100 disabled:cursor-wait disabled:bg-stone-100"
        disabled={disabled}
        id="menu-search"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search dishes by name"
        type="search"
        value={value}
      />
      {value && (
        <button
          aria-label="Clear search"
          className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-lg text-stone-500 transition hover:bg-stone-100 hover:text-stone-900 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-orange-700 disabled:cursor-not-allowed"
          disabled={disabled}
          onClick={onClear}
          type="button"
        >
          <span aria-hidden="true">×</span>
        </button>
      )}
    </div>
  );
}
