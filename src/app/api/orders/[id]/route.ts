import {
  ApiError,
  handleApiRequest,
  parseJsonBody,
  successResponse,
} from "@/lib/api/http";
import { changeOrderStatus } from "@/lib/api/order-service";
import { getOrderById } from "@/lib/data-access";
import { hasAdminSession } from "@/lib/auth/admin-session";

type OrderRouteContext = {
  params: Promise<{ id: string }>;
};

export function GET(
  _request: Request,
  { params }: OrderRouteContext,
): Promise<Response> {
  return handleApiRequest(async () => {
    if (!(await hasAdminSession())) {
      throw new ApiError("Authentication required", 401);
    }

    const { id } = await params;
    const order = getOrderById(id);

    if (!order) {
      return Response.json(
        { success: false, error: "Order not found" },
        { status: 404 },
      );
    }

    return successResponse(order);
  });
}

export function PATCH(
  request: Request,
  { params }: OrderRouteContext,
): Promise<Response> {
  return handleApiRequest(async () => {
    if (!(await hasAdminSession())) {
      throw new ApiError("Authentication required", 401);
    }

    const [{ id }, body] = await Promise.all([params, parseJsonBody(request)]);
    return successResponse(changeOrderStatus(id, body));
  });
}
