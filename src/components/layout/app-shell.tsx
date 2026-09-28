import type { ReactNode } from "react";
import { CartHydration } from "@/components/cart/cart-hydration";
import { CartDrawerHost } from "@/components/cart/cart-drawer-host";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fffdfa]">
      <CartHydration />
      <CartDrawerHost />
      {children}
    </div>
  );
}
