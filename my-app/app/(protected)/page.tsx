"use client";

import { StatusRow } from "@/components/ui/StatusRow";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/Calendar";

export default function HomePage() {

const [name, setName] = useState("user");

useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    window.location.href = "/login";
    return;
  }
  const parsed = JSON.parse(storedUser);
  setName(parsed.name);
}, []);

  return (
    <div className="h-full bg-gradient-to-b from-[#2e2e2e] to-[#b6a88b] p-12 overflow-hidden flex flex-col">

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
            {["Group 1", "Group 2", "Group 3", "Group 4", "Group 5", "Group 6", "Group 7", "Group 2", "Group 3", "Group 4", "Group 5", "Group 6", "Group 7",].map((group,i) => (
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
        <div className="flex flex-col min-h-0 gap-8 pt-8">
          <div className="flex-1 overflow-y-auto min-h-0
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-gray-400/100"
          
          >
            <div className="bg-gray-200 rounded-2xl p-6 shadow-md">
              <Calendar/>
              <div className="border-t border-gray-300 my-5"/>

              <h2 className="text-center font-semibold text-sm text-black uppercase tracking-widest mb-4 ">Status</h2>

              <div className="space-y-3">
                <StatusRow label="On Progress" count={3} color="#f97316" />
                <StatusRow label="Validated" count={1} color="#ef4444"/> 
                <StatusRow label="On Progress" count={1} color="#a855f7"/>
              </div>
            </div>
          </div>
          
          

        </div>
      </div>
    </div>
  )
}
