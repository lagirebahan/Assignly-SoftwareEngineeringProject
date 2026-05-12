export function EmptyState({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <button
        onClick={onClick}
        className="w-full max-w-[900px] py-[120px] px-10 rounded-[32px] border-2 border-dotted border-black/25 bg-transparent cursor-pointer flex flex-col items-center gap-5 transition-colors duration-200"
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(0,0,0,0.05)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
      >
        <div className="w-[100px] h-[100px] rounded-full border-[2.5px] border-[#1a1a1a] flex items-center justify-center">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="6" width="8" height="36" rx="2" fill="#1a1a1a" />
            <rect x="6" y="20" width="36" height="8" rx="2" fill="#1a1a1a" />
          </svg>
        </div>
        <span className="text-lg font-bold text-[#1a1a1a]">Create Team / Join Team</span>
      </button>
    </div>
  );
}