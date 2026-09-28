export function OrderLoading({ label }: { label: string }) {
  return (
    <div aria-label={label} className="space-y-3" role="status">
      <span className="sr-only">{label}</span>
      {Array.from({ length: 4 }, (_, index) => (
        <div
          aria-hidden="true"
          className="grid animate-pulse gap-4 rounded-2xl border border-stone-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-6"
          key={index}
        >
          <div className="h-10 rounded-lg bg-stone-100" />
          <div className="h-10 rounded-lg bg-stone-100" />
          <div className="h-10 rounded-lg bg-stone-100" />
          <div className="h-10 rounded-lg bg-stone-100" />
          <div className="h-10 rounded-lg bg-stone-100" />
          <div className="h-10 rounded-lg bg-stone-100" />
        </div>
      ))}
    </div>
  );
}
