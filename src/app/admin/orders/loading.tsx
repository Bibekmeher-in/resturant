export default function AdminOrdersLoading() {
  return (
    <main
      aria-label="Loading order management"
      className="min-h-screen bg-[#fffdfa] px-4 py-8 sm:px-8 sm:py-12"
    >
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="h-4 w-36 rounded bg-stone-200" />
        <div className="mt-3 h-10 max-w-sm rounded bg-stone-200" />
        <div className="mt-3 h-5 max-w-2xl rounded bg-stone-100" />
        <div className="mt-8 h-20 rounded-2xl bg-stone-100" />
        <div className="mt-6 flex gap-2">
          {Array.from({ length: 5 }, (_, index) => (
            <div className="h-11 w-24 rounded-full bg-stone-100" key={index} />
          ))}
        </div>
        <div className="mt-4 space-y-3">
          {Array.from({ length: 4 }, (_, index) => (
            <div className="h-24 rounded-2xl bg-white" key={index} />
          ))}
        </div>
      </div>
    </main>
  );
}
