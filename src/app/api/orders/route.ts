import {
  ApiError,
  handleApiRequest,
  parseJsonBody,
  successResponse,
} from "@/lib/api/http";
import { createOrder } from "@/lib/api/order-service";
import { getOrders } from "@/lib/data-access";
import { hasAdminSession } from "@/lib/auth/admin-session";
import { ORDER_STATUSES, type OrderStatus } from "@/types";

function isOrderStatus(value: string): value is OrderStatus {
  return ORDER_STATUSES.some((status) => status === value);
}

export function GET(request: Request): Promise<Response> {
  return handleApiRequest(async () => {
    if (!(await hasAdminSession())) {
      throw new ApiError("Authentication required", 401);
    }

    const status = new URL(request.url).searchParams.get("status");

    if (status !== null && !isOrderStatus(status)) {
      throw new ApiError(
        `status must be one of: ${ORDER_STATUSES.join(", ")}`,
        400,
      );
    }

    const orders = getOrders();
    const filteredOrders = status !== null
      ? orders.filter((order) => order.status === status)
      : orders;

    return successResponse(filteredOrders);
  });
}

export function POST(request: Request): Promise<Response> {
  return handleApiRequest(async () => {
    const body = await parseJsonBody(request);
    return successResponse(createOrder(body), 201);
  });
}
