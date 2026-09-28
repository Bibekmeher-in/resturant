import type { MenuItem } from "@/types";

type MenuApiResponse = {
  success: true;
  data: MenuItem[];
};

type MenuFilters = {
  category?: string;
  search?: string;
};

function isMenuItem(value: unknown): value is MenuItem {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "number" &&
    typeof item.name === "string" &&
    typeof item.description === "string" &&
    typeof item.category === "string" &&
    typeof item.price === "number" &&
    typeof item.image === "string" &&
    typeof item.available === "boolean"
  );
}

function isMenuResponse(value: unknown): value is MenuApiResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const response = value as Record<string, unknown>;

  return (
    response.success === true &&
    Array.isArray(response.data) &&
    response.data.every(isMenuItem)
  );
}

export async function fetchMenuItems(
  filters: MenuFilters = {},
  signal?: AbortSignal,
): Promise<MenuItem[]> {
  const query = new URLSearchParams();
  const category = filters.category?.trim();
  const search = filters.search?.trim();

  if (category && category !== "All") {
    query.set("category", category);
  }

  if (search) {
    query.set("search", search);
  }

  const queryString = query.toString();
  const response = await fetch(
    queryString ? `/api/menu?${queryString}` : "/api/menu",
    { cache: "no-store", signal },
  );

  if (!response.ok) {
    throw new Error("Menu request failed");
  }

  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    throw new Error("Menu response was not valid JSON");
  }

  if (!isMenuResponse(payload)) {
    throw new Error("Menu response had an unexpected format");
  }

  return payload.data;
}
