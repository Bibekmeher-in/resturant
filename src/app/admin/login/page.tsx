import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { hasAdminSession } from "@/lib/auth/admin-session";

export const metadata: Metadata = {
  title: "Admin sign in | The Ember Table",
  description: "Sign in to manage restaurant orders.",
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await hasAdminSession()) {
    redirect("/admin/orders");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffdfa] px-5 py-10">
      <section
        aria-labelledby="admin-login-title"
        className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-9"
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-800">
          The Ember Table
        </p>
        <h1
          className="mt-3 text-3xl font-semibold tracking-tight text-stone-950"
          id="admin-login-title"
        >
          Admin sign in
        </h1>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Sign in to review and manage restaurant orders.
        </p>
        <AdminLoginForm />
      </section>
    </main>
  );
}
