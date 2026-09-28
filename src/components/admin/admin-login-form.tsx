"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type LoginResponse = {
  success?: boolean;
  error?: string;
};

function isLoginResponse(value: unknown): value is LoginResponse {
  return typeof value === "object" && value !== null;
}

export function AdminLoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || typeof password !== "string") {
      setErrorMessage("Enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let result: unknown;
      try {
        result = await response.json();
      } catch {
        throw new Error("Sign-in service returned an unexpected response.");
      }

      if (response.ok && isLoginResponse(result) && result.success === true) {
        router.replace("/admin/orders");
        router.refresh();
        return;
      }

      setErrorMessage(
        isLoginResponse(result) && typeof result.error === "string"
          ? result.error
          : "Unable to sign in. Please try again.",
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error &&
          error.message === "Sign-in service returned an unexpected response."
          ? error.message
          : "Unable to reach the sign-in service. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-7 space-y-5" onSubmit={submitLogin}>
      <div>
        <label
          className="block text-sm font-semibold text-stone-800"
          htmlFor="admin-email"
        >
          Email
        </label>
        <input
          autoComplete="username"
          className="mt-2 min-h-12 w-full rounded-xl border border-stone-300 bg-white px-4 text-base text-stone-950 outline-none focus-visible:border-orange-600 focus-visible:ring-4 focus-visible:ring-orange-100"
          disabled={isSubmitting}
          id="admin-email"
          maxLength={254}
          name="email"
          required
          type="email"
        />
      </div>
      <div>
        <label
          className="block text-sm font-semibold text-stone-800"
          htmlFor="admin-password"
        >
          Password
        </label>
        <input
          autoComplete="current-password"
          className="mt-2 min-h-12 w-full rounded-xl border border-stone-300 bg-white px-4 text-base text-stone-950 outline-none focus-visible:border-orange-600 focus-visible:ring-4 focus-visible:ring-orange-100"
          disabled={isSubmitting}
          id="admin-password"
          maxLength={1024}
          name="password"
          required
          type="password"
        />
      </div>

      {errorMessage && (
        <p
          aria-live="assertive"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
          role="alert"
        >
          {errorMessage}
        </p>
      )}

      <button
        className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-orange-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800 disabled:cursor-wait disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
