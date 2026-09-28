"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CategoryFilter } from "@/components/menu/category-filter";
import { MenuEmpty } from "@/components/menu/menu-empty";
import { MenuError } from "@/components/menu/menu-error";
import { MenuGrid } from "@/components/menu/menu-grid";
import { MenuSearch } from "@/components/menu/menu-search";
import { MenuSkeleton } from "@/components/menu/menu-skeleton";
import { fetchMenuItems } from "@/lib/api/menu-client";
import { useCartStore } from "@/store/cart-store";
import type { MenuItem } from "@/types";

function makeQueryKey(category: string, search: string): string {
  return JSON.stringify([category, search]);
}

export function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [catalogLoaded, setCatalogLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [cartNotice, setCartNotice] = useState("");
  const lastSuccessfulQuery = useRef<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const cartHydrated = useCartStore((state) => state.hasHydrated);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();
    const queryKey = makeQueryKey(selectedCategory, debouncedSearch);

    if (lastSuccessfulQuery.current === queryKey) {
      setError(false);
      setLoading(false);
      return () => controller.abort();
    }

    async function loadMenu() {
      setLoading(true);
      setError(false);

      try {
        if (!catalogLoaded) {
          const allItems = await fetchMenuItems({}, controller.signal);
          if (controller.signal.aborted) return;

          setCategories([...new Set(allItems.map((item) => item.category))]);
          setItems(allItems);
          setCatalogLoaded(true);
          lastSuccessfulQuery.current = queryKey;
          return;
        }

        const filteredItems = await fetchMenuItems(
          { category: selectedCategory, search: debouncedSearch },
          controller.signal,
        );
        if (controller.signal.aborted) return;

        setItems(filteredItems);
        lastSuccessfulQuery.current = queryKey;
      } catch {
        if (!controller.signal.aborted) {
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadMenu();

    return () => controller.abort();
  }, [catalogLoaded, debouncedSearch, retryCount, selectedCategory]);

  const clearFilters = useCallback(() => {
    setSelectedCategory("All");
    setSearch("");
    setDebouncedSearch("");
  }, []);

  const handleAddToCart = useCallback((item: MenuItem) => {
    if (!item.available || !cartHydrated) return;
    addItem(item);
    setCartNotice(`${item.name} added to your cart.`);
  }, [addItem, cartHydrated]);

  const hasFilters =
    selectedCategory !== "All" || debouncedSearch.length > 0 || search.length > 0;

  return (
    <section aria-labelledby="menu-title" className="mx-auto max-w-7xl px-5 py-9 sm:px-8 sm:py-12" id="top">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-800">
            From our kitchen
          </p>
          <h2
            className="mt-2 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl"
            id="menu-title"
          >
            Explore the menu
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-600 sm:text-base">
            Find your next favourite, made fresh to order.
          </p>
        </div>
        <div className="w-full lg:max-w-md">
          <MenuSearch
            disabled={!catalogLoaded}
            onChange={setSearch}
            onClear={clearFilters}
            value={search}
          />
        </div>
      </div>

      <div className="mt-7">
        <CategoryFilter
          categories={categories}
          disabled={!catalogLoaded}
          onSelect={setSelectedCategory}
          selectedCategory={selectedCategory}
        />
      </div>

      <div className="mb-5 mt-7 flex min-h-6 items-center justify-between gap-4">
        <p aria-live="polite" className="text-sm font-medium text-stone-600">
          {loading
            ? "Loading dishes…"
            : error
              ? "Menu unavailable"
              : `${items.length} ${items.length === 1 ? "dish" : "dishes"}`}
        </p>
        {hasFilters && !loading && !error && (
          <button
            className="rounded-md text-sm font-semibold text-orange-800 underline decoration-orange-300 underline-offset-4 hover:text-orange-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
            onClick={clearFilters}
            type="button"
          >
            Clear filters
          </button>
        )}
      </div>

      {error ? (
        <MenuError onRetry={() => setRetryCount((count) => count + 1)} />
      ) : loading ? (
        <MenuSkeleton />
      ) : items.length === 0 ? (
        <MenuEmpty hasFilters={hasFilters} onClearFilters={clearFilters} />
      ) : (
        <MenuGrid
          canAddToCart={cartHydrated}
          items={items}
          onAddToCart={handleAddToCart}
        />
      )}

      <p aria-live="polite" className="sr-only">
        {cartNotice}
      </p>
    </section>
  );
}
