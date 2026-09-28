"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function logout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });

      if (!response.ok) {
        setErrorMessage("Unable to sign out. Please try again.");
        setIsLoggingOut(false);
        return;
      }

      router.replace("/admin/login");
      router.refresh();
    } catch {
      setErrorMessage("Unable to reach the sign-out service. Please try again.");
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <button
        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 disabled:cursor-wait disabled:opacity-60"
        disabled={isLoggingOut}
        onClick={() => void logout()}
        type="button"
      >
        {isLoggingOut ? "Signing out…" : "Sign out"}
      </button>
      {errorMessage && (
        <p className="text-sm font-medium text-red-800" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
