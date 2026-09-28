"use client";

type CategoryFilterProps = {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
  disabled: boolean;
};

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelect,
  disabled,
}: CategoryFilterProps) {
  const options = ["All", ...categories];

  return (
    <nav aria-label="Menu categories" className="min-w-0">
      <ul className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
        {options.map((category) => {
          const selected = category === selectedCategory;

          return (
            <li className="shrink-0" key={category}>
              <button
                aria-pressed={selected}
                className={`min-h-11 rounded-full px-5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 disabled:cursor-wait disabled:opacity-60 ${
                  selected
                    ? "bg-stone-900 text-white shadow-sm"
                    : "border border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-100"
                }`}
                disabled={disabled}
                onClick={() => onSelect(category)}
                type="button"
              >
                {category}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
