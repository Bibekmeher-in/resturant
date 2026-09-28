type OrderErrorProps = {
  message: string;
  onRetry: () => void;
};

export function OrderError({ message, onRetry }: OrderErrorProps) {
  return (
    <div
      aria-live="assertive"
      className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-950"
      role="alert"
    >
      <p className="text-sm font-semibold">{message}</p>
      <button
        className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl border border-red-300 bg-white px-4 text-sm font-semibold text-red-900 hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800"
        onClick={onRetry}
        type="button"
      >
        Try again
      </button>
    </div>
  );
}
