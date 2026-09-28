"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { BaseSyntheticEvent } from "react";
import { CartItems } from "@/components/cart/cart-items";
import { CheckoutEmpty } from "@/components/checkout/checkout-empty";
import { CartSummary } from "@/components/cart/cart-summary";
import { CheckoutLoading } from "@/components/checkout/checkout-loading";
import { createOrder, CreateOrderError } from "@/lib/api/orders";
import {
  checkoutSchema,
  customerInformationResolverSchema,
  type CheckoutFormValues,
} from "@/lib/validations/checkout";
import { useCartStore } from "@/store/cart-store";

type CustomerField = keyof CheckoutFormValues;

const submittingForms = new WeakSet<HTMLFormElement>();

const fields: {
  name: CustomerField;
  label: string;
  placeholder: string;
  type: "text" | "tel" | "email" | "textarea";
  autoComplete: string;
}[] = [
  {
    name: "customerName",
    label: "Customer name",
    placeholder: "e.g. Ananya Rao",
    type: "text",
    autoComplete: "name",
  },
  {
    name: "mobile",
    label: "Mobile number",
    placeholder: "10-digit Indian mobile number",
    type: "tel",
    autoComplete: "tel",
  },
  {
    name: "email",
    label: "Email address",
    placeholder: "you@example.com",
    type: "email",
    autoComplete: "email",
  },
  {
    name: "address",
    label: "Delivery address",
    placeholder: "House, street, locality, city, and PIN code",
    type: "textarea",
    autoComplete: "street-address",
  },
];

export function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const clearCart = useCartStore((state) => state.clearCart);
  const [submissionError, setSubmissionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(customerInformationResolverSchema),
    mode: "onBlur",
    defaultValues: {
      customerName: "",
      mobile: "",
      email: "",
      address: "",
    },
  });

  async function submitOrder(
    customer: CheckoutFormValues,
    event?: BaseSyntheticEvent,
  ) {
    const form = event?.target;

    if (
      !(form instanceof HTMLFormElement) ||
      submittingForms.has(form) ||
      isSubmitting ||
      !hasHydrated
    ) {
      return;
    }

    submittingForms.add(form);
    setIsSubmitting(true);
    setSubmissionError("");

    const result = checkoutSchema.safeParse({
      ...customer,
      items: items.map(({ menuItemId, quantity }) => ({
        menuItemId,
        quantity,
      })),
    });

    if (!result.success) {
      setSubmissionError(
        "Your cart has changed or contains an invalid quantity. Review your cart and try again.",
      );
      submittingForms.delete(form);
      setIsSubmitting(false);
      return;
    }

    try {
      const order = await createOrder(result.data);
      clearCart();
      router.push(`/order-success/${encodeURIComponent(order.id)}`);
    } catch (error) {
      setSubmissionError(
        error instanceof CreateOrderError
          ? error.message
          : "Unable to place your order right now. Please try again.",
      );
      submittingForms.delete(form);
      setIsSubmitting(false);
    }
  }

  if (!hasHydrated) {
    return <CheckoutLoading />;
  }

  if (items.length === 0) {
    return <CheckoutEmpty />;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-stone-600 hover:text-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
        href="/#menu-title"
      >
        <span aria-hidden="true">←</span> Back to menu
      </Link>

      <header className="mt-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-800">
          Almost there
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
          Checkout
        </h1>
        <p className="mt-2 text-sm leading-6 text-stone-600 sm:text-base">
          Add your contact and delivery details, then review your order.
        </p>
      </header>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.78fr)] lg:gap-8">
        <form
          aria-label="Customer information"
          className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7"
          noValidate
          onSubmit={handleSubmit(submitOrder)}
        >
          <h2 className="text-xl font-semibold text-stone-950">
            Customer information
          </h2>
          <p className="mt-1 text-sm leading-6 text-stone-600">
            We’ll use these details to confirm and deliver your order.
          </p>

          <div className="mt-6 space-y-5">
            {fields.map((field) => {
              const error = errors[field.name];
              const inputClassName = `mt-2 min-h-12 w-full rounded-xl border bg-white px-4 text-base text-stone-950 outline-none transition placeholder:text-stone-400 focus-visible:border-orange-600 focus-visible:ring-4 focus-visible:ring-orange-100 ${
                error
                  ? "border-red-500"
                  : "border-stone-300 hover:border-stone-400"
              }`;
              const commonProps = {
                autoComplete: field.autoComplete,
                "aria-describedby": error ? `${field.name}-error` : undefined,
                "aria-invalid": error ? true : undefined,
                className: inputClassName,
                disabled: isSubmitting,
                placeholder: field.placeholder,
                ...register(field.name),
              };

              return (
                <div key={field.name}>
                  <label
                    className="text-sm font-semibold text-stone-800"
                    htmlFor={field.name}
                  >
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      {...commonProps}
                      className={`${inputClassName} min-h-28 resize-y py-3`}
                      id={field.name}
                      rows={3}
                    />
                  ) : (
                    <input
                      {...commonProps}
                      id={field.name}
                      type={field.type}
                    />
                  )}
                  {error?.message && (
                    <p
                      className="mt-2 text-sm font-medium text-red-800"
                      id={`${field.name}-error`}
                    >
                      {error.message}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {submissionError && (
            <div
              aria-live="assertive"
              className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-900"
              role="alert"
            >
              {submissionError}
            </div>
          )}

          <div className="mt-7">
            <button
              className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-orange-700 px-5 py-3 text-base font-semibold text-white transition hover:bg-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800 disabled:cursor-wait disabled:bg-orange-400"
              disabled={isSubmitting || items.length === 0}
              type="submit"
            >
              {isSubmitting && (
                <span
                  aria-hidden="true"
                  className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                />
              )}
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </button>
            <p className="mt-3 text-center text-xs leading-5 text-stone-500">
              No payment is collected in this assessment checkout.
            </p>
          </div>
        </form>

        <aside
          aria-labelledby="order-review-title"
          className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7 lg:sticky lg:top-6"
        >
          <div className="flex items-center justify-between gap-3">
            <h2
              className="text-xl font-semibold text-stone-950"
              id="order-review-title"
            >
              Review your order
            </h2>
            <Link
              className="text-sm font-semibold text-orange-800 underline decoration-orange-300 underline-offset-4 hover:text-orange-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
              href="/#menu-title"
            >
              Edit cart
            </Link>
          </div>
          <div className="mt-3 max-h-[25rem] overflow-y-auto">
            <CartItems items={items} />
          </div>
          <div className="mt-2">
            <CartSummary />
          </div>
        </aside>
      </div>
    </div>
  );
}
