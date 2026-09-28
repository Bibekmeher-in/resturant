import { getMenuItems } from "@/lib/data-access";

export function listMenuItems(category?: string | null, search?: string | null) {
  const normalizedCategory = category?.trim().toLowerCase();
  const normalizedSearch = search?.trim().toLowerCase();

  return getMenuItems().filter((menuItem) => {
    const matchesCategory =
      !normalizedCategory ||
      menuItem.category.toLowerCase() === normalizedCategory;
    const matchesSearch =
      !normalizedSearch || menuItem.name.toLowerCase().includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });
}
