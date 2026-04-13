import Link from "next/link";
export default function HomePage() {
  return (
    <div className="h-full bg-gradient-to-b from-[#2e2e2e] to-[#b6a88b] p-12 overflow-hidden flex flex-col">
      
      {/* sementara title pagenya gini dulu, blm ada navbar */}
      {/* <h1 className="text-white text-2xl mb-6 flex-shrink-0">Home Page</h1> */}

      <div className="grid grid-cols-[1fr_1.4fr] gap-8 flex-1 min-h-0">

        {/* Upcoming Tasks */}
        <div className= "flex flex-col min-h-0">
          <h2 className="text-white text-2xl font-semibold mb-4 text-center flex-shrink-0">Upcoming Task</h2>
          {/* blm buat script untuk scrolling and flexible group amount*/}
          <div className="flex-1 overflow-y-auto pr-2 min-h-0 space-y-6
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-white
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-gray-400/100"
          
          >
            {["Group 1", "Group 2", "Group 3", "Group 4", "Group 5", "Group 6", "Group 7"].map((group,i) => (
              <Link href="/teams" className="block">
                <div
                  key={i}
                  className="bg-gray-200 hover:bg-gray-300 transition-colors rounded-2xl p-6 shadow-md cursor-pointer"
                >
                  <p className="text-gray-800 font-medium">{group}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-8 overflow-hidden vertical-align-middle py-8">

          {/* STATUS CARD */}
          <div className="bg-gray-200 rounded-2xl p-10 shadow-md">
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