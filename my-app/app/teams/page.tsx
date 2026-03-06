import MainNavbar from "@/components/layout/Navbar";
import Link from "next/link";

const teams = [
  { id: "team1", name: "Team Alpha" },
  { id: "team2", name: "Team Beta" },
  { id: "team3", name: "Team Gamma" },
];


export default function TeamPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2e2e2e] to-[#b6a88b] p-8">
      
      {/* sementara title pagenya gini dulu, blm ada navbar */}
      <h1 className="text-white text-2xl mb-6">Team Page</h1>
      
      <ul>
        {teams.map((team) => (
          <li key={team.id}>
            <Link href={`/teams/${team.id}`}>
              {team.name}
            </Link>
          </li>
        ))}
      </ul>
      

      
      
    </div>
  )
}


// /* reusable component line 34 */

// function StatusRow({ label, count }: { label: string; count: number }) {
//   return (
//     <div className="flex justify-between items-center">
//       <span className="text-gray-700">{label}</span>
//       <span className="text-red-500 font-semibold">{count}</span>
//     </div>
//   )
// }