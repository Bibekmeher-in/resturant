"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { MenuItem, CartItem } from "@/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCartItem(value: unknown): value is CartItem {
  return (
    isRecord(value) &&
    typeof value.menuItemId === "number" &&
    Number.isSafeInteger(value.menuItemId) &&
    value.menuItemId > 0 &&
    typeof value.name === "string" &&
    value.name.trim().length > 0 &&
    typeof value.price === "number" &&
    Number.isFinite(value.price) &&
    value.price >= 0 &&
    typeof value.image === "string" &&
    value.image.length > 0 &&
    typeof value.quantity === "number" &&
    Number.isSafeInteger(value.quantity) &&
    value.quantity > 0
  );
}

function restoreCartItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const seenIds = new Set<number>();

  return value.filter((item): item is CartItem => {
    if (!isCartItem(item) || seenIds.has(item.menuItemId)) {
      return false;
    }

    seenIds.add(item.menuItemId);
    return true;
  });
}

type CartState = {
  items: CartItem[];
  hasHydrated: boolean;
  addItem: (item: MenuItem) => void;
  removeItem: (menuItemId: number) => void;
  increaseQuantity: (menuItemId: number) => void;
  decreaseQuantity: (menuItemId: number) => void;
  clearCart: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      hasHydrated: false,
      addItem: (menuItem) => {
        if (!menuItem.available) return;

        set((state) => {
          const existingItem = state.items.find(
            (item) => item.menuItemId === menuItem.id,
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.menuItemId === menuItem.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                menuItemId: menuItem.id,
                name: menuItem.name,
                price: menuItem.price,
                image: menuItem.image,
                quantity: 1,
              },
            ],
          };
        });
      },
      removeItem: (menuItemId) =>
        set((state) => ({
          items: state.items.filter((item) => item.menuItemId !== menuItemId),
        })),
      increaseQuantity: (menuItemId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.menuItemId === menuItemId
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        })),
      decreaseQuantity: (menuItemId) =>
        set((state) => ({
          items: state.items.flatMap((item) => {
            if (item.menuItemId !== menuItemId) return [item];
            if (item.quantity <= 1) return [];
            return [{ ...item, quantity: item.quantity - 1 }];
          }),
        })),
      clearCart: () => set({ items: [] }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "ember-table-cart",
      storage: createJSONStorage(() =>
        typeof window === "undefined"
          ? {
              getItem: () => null,
              setItem: () => undefined,
              removeItem: () => undefined,
            }
          : window.localStorage,
      ),
      skipHydration: true,
      partialize: (state) => ({ items: state.items }),
      merge: (persistedState, currentState) => {
        if (!isRecord(persistedState)) {
          return currentState;
        }

        return {
          ...currentState,
          items: restoreCartItems(persistedState.items),
        };
      },
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Unable to restore the saved cart:", error);
        }
        state?.setHasHydrated(true);
      },
    },
  ),
);

export function selectCartItemCount(state: CartState): number {
  return state.items.reduce((count, item) => count + item.quantity, 0);
}
