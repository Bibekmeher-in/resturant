"use client";

type MenuErrorProps = {
  onRetry: () => void;
};

export function MenuError({ onRetry }: MenuErrorProps) {
  return (
    <div
      aria-live="assertive"
      className="rounded-3xl border border-red-200 bg-white px-5 py-14 text-center sm:py-20"
      role="alert"
    >
      <span
        aria-hidden="true"
        className="mx-auto grid size-14 place-items-center rounded-2xl bg-red-50 text-xl font-bold text-red-800"
      >
        !
      </span>
      <h3 className="mt-5 text-xl font-semibold text-stone-950">
        We couldn’t load the menu
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
        Please check your connection and try again. Your filters will be kept.
      </p>
      <button
        className="mt-5 min-h-11 rounded-xl bg-orange-700 px-5 text-sm font-semibold text-white transition hover:bg-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800"
        onClick={onRetry}
        type="button"
      >
        Try again
      </button>
    </div>
  );
}
