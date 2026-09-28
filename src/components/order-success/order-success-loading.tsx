export function OrderSuccessLoading() {
  return (
    <main
      aria-label="Loading order confirmation"
      className="min-h-screen bg-[#fffdfa] px-4 py-8 sm:px-8 sm:py-12"
    >
      <div className="mx-auto max-w-4xl animate-pulse">
        <div className="rounded-3xl border border-stone-200 bg-white px-5 py-10 text-center sm:px-10">
          <div className="mx-auto size-14 rounded-full bg-stone-200" />
          <div className="mx-auto mt-5 h-4 w-48 rounded bg-stone-200" />
          <div className="mx-auto mt-3 h-9 max-w-sm rounded bg-stone-200" />
          <div className="mx-auto mt-3 h-4 max-w-md rounded bg-stone-100" />
          <div className="mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-3">
            <div className="h-12 rounded bg-stone-100" />
            <div className="h-12 rounded bg-stone-100" />
            <div className="h-12 rounded bg-stone-100" />
          </div>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
          <div className="h-80 rounded-3xl border border-stone-200 bg-white" />
          <div className="h-64 rounded-3xl border border-stone-200 bg-white" />
        </div>
      </div>
    </main>
  );
}
