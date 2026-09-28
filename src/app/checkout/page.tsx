import type { Metadata } from "next";
import { CheckoutPage } from "@/components/checkout/checkout-page";

export const metadata: Metadata = {
  title: "Checkout | The Ember Table",
  description: "Review your cart and enter delivery details.",
};

export default function CheckoutRoute() {
  return (
    <main className="min-h-screen bg-[#fffdfa] px-5 py-8 sm:px-8 sm:py-12">
      <CheckoutPage />
    </main>
  );
}
