import { MOCK_TEAMS } from "@/data/mockTeam";

export async function POST(req: Request) {
  const { code } = await req.json();
  

  // const team = await getTeamByJoinCode(joinCode);
  const team = MOCK_TEAMS.find((t) => t.joinCode === code);

  if (!team) {
    return new Response("Invalid code", { status: 400 });
  }

  return Response.json(team);
}

// function getTeamByJoinCode(joinCode: string) : team {

// }