export async function POST(req: Request) {
  const { code } = await req.json();

  // fake lookup
  if (code !== "ABC-12345") {
    return new Response("Invalid code", { status: 400 });
  }

  const team = {
    id: "group5",
    name: "Group 5",
    progress: 20,
    members: [
      { name: "Alexio Clive Vandana", taskStatus: "unfinished" },
      { name: "Bryant Evant Mulya", taskStatus: "unfinished" },
      { name: "Christian Jordan Dwisaputra", taskStatus: "unfinished" },
      { name: "Joselyn Patricia Prasetyo", taskStatus: "unverified" },
      { name: "Nathan", taskStatus: "done" },
    ],
  };

  return Response.json(team);
}