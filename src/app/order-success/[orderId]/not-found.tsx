import Link from "next/link";

export default function OrderNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffdfa] px-5 py-12">
      <section className="w-full max-w-lg rounded-3xl border border-stone-200 bg-white px-6 py-12 text-center shadow-sm sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-800">
          Order not found
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
          We couldn’t find that order
        </h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          The order reference may be invalid or no longer available. You can
          return to the menu to continue browsing.
        </p>
        <Link
          className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-orange-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800 sm:w-auto"
          href="/"
        >
          Back to menu
        </Link>
      </section>
    </main>
  );
}
