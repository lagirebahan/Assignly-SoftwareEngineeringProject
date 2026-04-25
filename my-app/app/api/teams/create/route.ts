export async function POST(req: Request) {
  const { name } = await req.json();

  const newTeam = {
    id: crypto.randomUUID(),
    name,
    progress: 0,
    members: [
      {
        name: "You", // replace with logged-in user later
        taskStatus: "unfinished",
      },
    ],
  };

  return Response.json(newTeam);
}