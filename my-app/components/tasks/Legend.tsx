export const Legend = () => (
  <div className="flex gap-4 mb-4">
    {[
      { color: "bg-green-600", label: "Verified" },
      { color: "bg-red-600", label: "Unverified" },
    ].map(({ color, label }) => (
      <div key={label} className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full inline-block ${color}`} />
        <span className="text-xs text-white/80 font-medium">{label}</span>
      </div>
    ))}
  </div>
);