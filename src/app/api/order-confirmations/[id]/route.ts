import { ApiError, handleApiRequest, successResponse } from "@/lib/api/http";
import { getOrderReceipt } from "@/lib/api/order-service";

type OrderConfirmationRouteContext = {
  params: Promise<{ id: string }>;
};

export function GET(
  _request: Request,
  { params }: OrderConfirmationRouteContext,
): Promise<Response> {
  return handleApiRequest(async () => {
    const { id } = await params;
    const receipt = getOrderReceipt(id);

    if (!receipt) {
      throw new ApiError("Order not found", 404);
    }

    const response = successResponse(receipt);
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  });
}
