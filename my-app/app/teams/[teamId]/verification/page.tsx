export default async function TeamDetail({ params }: { params: Promise<{ teamId: string }>;}) {
    const { teamId } = await params;
    return (
        <div>
            <h1>Verification Page</h1>
            <p>Team ID: {teamId}</p>

            <button>Approve Member</button>
            <button>Reject Member</button>
        </div>
  );
}