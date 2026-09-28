import { handleApiRequest, successResponse } from "@/lib/api/http";
import { listMenuItems } from "@/lib/api/menu-service";

export function GET(request: Request): Promise<Response> {
  return handleApiRequest(() => {
    const { searchParams } = new URL(request.url);
    const menuItems = listMenuItems(
      searchParams.get("category"),
      searchParams.get("search"),
    );

    return successResponse(menuItems);
  });
}
