export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gray-700 rounded-full transition-[width] duration-[600ms] ease-in-out"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-gray-700 min-w-[32px]">
        {value}%
      </span>
    </div>
  );
}