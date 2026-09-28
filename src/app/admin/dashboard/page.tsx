import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/auth/admin-session";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  if (!(await hasAdminSession())) {
    redirect("/admin/login");
  }

  redirect("/admin/orders");
}
