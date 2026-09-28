import type { Order } from "@/types";
import type { CheckoutValues } from "@/lib/validations/checkout";
import { isOrder, isRecord } from "@/lib/api/order-guards";

export type CreateOrderPayload = CheckoutValues;

type CreateOrderSuccess = {
  success: true;
  data: Order;
};

type ApiErrorResponse = {
  success: false;
  error: string;
};

export class CreateOrderError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "CreateOrderError";
  }
}

function isSuccessResponse(value: unknown): value is CreateOrderSuccess {
  return (
    isRecord(value) &&
    value.success === true &&
    isOrder(value.data)
  );
}

function isErrorResponse(value: unknown): value is ApiErrorResponse {
  return (
    isRecord(value) &&
    value.success === false &&
    typeof value.error === "string"
  );
}

export async function createOrder(
  payload: CreateOrderPayload,
): Promise<Order> {
  let response: Response;

  try {
    response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new CreateOrderError(
      "Unable to reach the ordering service. Check your connection and try again.",
    );
  }

  let body: unknown;

  try {
    body = await response.json();
  } catch {
    throw new CreateOrderError(
      "The ordering service returned an unexpected response. Please try again.",
      response.status,
    );
  }

  if (!response.ok) {
    const message =
      response.status === 400
        ? "Some checkout details or cart items could not be accepted. Review them and try again."
        : response.status === 404
          ? "A menu item in your cart could not be found. Return to the menu and review your cart."
          : "Unable to place your order right now. Please try again.";

    throw new CreateOrderError(message, response.status);
  }

  if (!isSuccessResponse(body)) {
    if (isErrorResponse(body)) {
      throw new CreateOrderError(
        "The ordering service could not confirm your order. Please try again.",
        response.status,
      );
    }

    throw new CreateOrderError(
      "The ordering service returned an unexpected response. Please try again.",
      response.status,
    );
  }

  return body.data;
}
