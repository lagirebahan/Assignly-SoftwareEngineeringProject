export async function POST(req: Request) {
  const { name } = await req.json();

  const joinCode = generateJoinCode();

  const newTeam = {
    id: crypto.randomUUID(),
    name,
    joinCode,
    members: [
      {
        name: "You", // replace with logged-in user later
        taskStatus: "unfinished",
        tasks:[]
      },
    ],
  };

  return Response.json(newTeam);
}

function generateJoinCode(): string {
  const letters = Array.from({length:3},() =>
    String.fromCharCode(65+Math.floor(Math.random()*26))
  ).join("");
  const numbers = Math.floor(10000+Math.random()*90000).toString();
  return `${letters}-${numbers}`;
}