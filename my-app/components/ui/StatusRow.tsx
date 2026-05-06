export function StatusRow({ label, count, color = "#ef4444" }: { label: string; count: number ; color?:string}) {
  return (
    <div className="flex justify-between items-center px-2">
      <span className="text-gray-700 text-sm">{label}</span>
      <span className="text-sm font-semibold" style={{color}}>{count}</span>
    </div>
  )
}