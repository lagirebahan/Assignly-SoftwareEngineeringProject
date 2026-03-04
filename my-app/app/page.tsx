import MainNavbar from "@/components/layout/Navbar";
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2e2e2e] to-[#b6a88b] p-8">
      
      {/* sementara title pagenya gini dulu, blm ada navbar */}
      <h1 className="text-white text-2xl mb-6">Home Page</h1>

      <div className="grid grid-cols-2 gap-8">

        {/* Upcoming Tasks */}
        <div>
          <h2 className="text-white text-xl mb-4 text-center">Upcoming Task</h2>
          {/* blm buat script untuk scrolling and flexible group amount*/}
          <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
            {["Group 1", "Group 2", "Group 3", "Group 4"].map((group) => (
              <div
                key={group}
                className="bg-gray-200 rounded-2xl p-6 shadow-md"
              >
                <p className="text-gray-800 font-medium">{group}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-8">

          {/* STATUS CARD */}
          <div className="bg-gray-200 rounded-2xl p-6 shadow-md">
            <h2 className="text-center font-semibold text-lg text-black mb-4 " color-black>Status</h2>

            <div className="space-y-4">
              <StatusRow label="Waiting for validation" count={1} />
              <StatusRow label="Validated" count={1} />
              <StatusRow label="On Progress" count={1} />
            </div>
          </div>

          {/* RECENT TEAMS */}
          <div className="bg-gray-200 rounded-2xl p-6 shadow-md">
            <h2 className="text-center font-semibold text-lg text-black mb-6">
              Recent Teams
            </h2>
            {/*logic recency blm ada, and jg gambar tim kl pake jg blm*/}
            <div className="flex gap-6 justify-center">
              {[1, 2, 3].map((team) => (
                <div
                  key={team}
                  className="w-24 h-24 border border-gray-400 rounded-md"
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

/* reusable component line 34 */

function StatusRow({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex justify-between items-center px-5"> {/* border border-black rounded-md */}
      <span className="text-gray-700 ">{label}</span>
      <span className="text-red-500 font-semibold">{count}</span>
    </div>
  )
}