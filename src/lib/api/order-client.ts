import { type Order, type OrderStatus } from "@/types";
import { isOrder, isOrderList, isRecord } from "@/lib/api/order-guards";

type ApiSuccess<T> = {
  success: true;
  data: T;
};

export class OrdersApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "OrdersApiError";
  }
}

function parseSuccess<T>(
  value: unknown,
  isData: (data: unknown) => data is T,
): ApiSuccess<T> | null {
  if (
    !isRecord(value) ||
    value.success !== true ||
    !isData(value.data)
  ) {
    return null;
  }

  return { success: true, data: value.data };
}

async function requestOrderApi<T>(
  url: string,
  init: RequestInit,
  isData: (data: unknown) => data is T,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url, init);
  } catch (error) {
    if (init.signal?.aborted) {
      throw error;
    }

    throw new OrdersApiError(
      "Unable to reach the order service. Check your connection and try again.",
    );
  }

  let body: unknown;

  try {
    body = await response.json();
  } catch {
    throw new OrdersApiError(
      "The order service returned an unexpected response. Please try again.",
      response.status,
    );
  }

  if (!response.ok) {
    const message =
      response.status === 404
        ? "That order could not be found."
        : "Unable to load or update orders right now. Please try again.";
    throw new OrdersApiError(message, response.status);
  }

  const result = parseSuccess(body, isData);

  if (!result) {
    throw new OrdersApiError(
      "The order service returned an unexpected response. Please try again.",
      response.status,
    );
  }

  return result.data;
}

export function fetchOrders(
  status: OrderStatus | undefined,
  signal?: AbortSignal,
): Promise<Order[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return requestOrderApi(
    `/api/orders${query}`,
    { signal },
    isOrderList,
  );
}

export function fetchOrder(
  id: string,
  signal?: AbortSignal,
): Promise<Order> {
  return requestOrderApi(
    `/api/orders/${encodeURIComponent(id)}`,
    { signal },
    isOrder,
  );
}

export function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order> {
  return requestOrderApi(
    `/api/orders/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    },
    isOrder,
  );
}
