export function AddTeamCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl px-[22px] py-5 cursor-pointer border-none flex flex-col items-center justify-center gap-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-[transform,box-shadow] duration-150 ease-in-out min-h-[160px] w-full"
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.14)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)";
      }}
    >
      <div className="w-11 h-11 rounded-full border-2 border-gray-400 flex items-center justify-center text-gray-400 text-2xl font-light">
        +
      </div>
      <span className="text-sm font-semibold text-gray-700">Add Team</span>
    </button>
  );
}