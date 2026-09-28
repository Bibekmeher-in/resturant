import type { Metadata } from "next";
import { OrderConfirmation } from "@/components/order-success/order-confirmation";

type OrderSuccessPageProps = {
  params: Promise<{ orderId: string }>;
};

export const metadata: Metadata = {
  title: "Order confirmed | The Ember Table",
  description: "Your order confirmation and order summary.",
};

export default async function OrderSuccessPage({
  params,
}: OrderSuccessPageProps) {
  const { orderId } = await params;

  return <OrderConfirmation orderId={orderId} />;
}
