export function Legend() {
  return (
    <div className="flex gap-4 items-center mb-4 justify-end">
      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block shadow-[0_0_4px_#ef4444aa]" />
        <span className="text-xs text-white/70">Unfinished task</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block shadow-[0_0_4px_#f97316aa]" />
        <span className="text-xs text-white/70">Awaiting verification</span>
      </div>
    </div>
  );
}