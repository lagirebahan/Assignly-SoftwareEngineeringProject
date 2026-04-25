import { main } from "framer-motion/client";
import Link from "next/link";

export default async function TeamDetail({ params }: { params: Promise<{ teamId: string }>;}) {
    const { teamId } = await params;
    return (
        // <div>
        //     <h1>Team ID: {teamId}</h1>

        //     <Link href={`/teams/${teamId}/tasks`}>Tasks</Link>

        //     <Link href={`/teams/${teamId}/verification`}>Verification</Link>
        // </div>
        <main>
            
        </main>
  );
}