import { RestaurantHeader } from "@/components/layout/restaurant-header";
import { MenuPage } from "@/components/menu/menu-page";

export default function Home() {
  return (
    <>
      <RestaurantHeader />
      <main>
        <MenuPage />
      </main>
    </>
  );
}
