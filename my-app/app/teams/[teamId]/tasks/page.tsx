export default async function TeamDetail({ params }: { params: Promise<{ teamId: string }>;}) {
    const { teamId } = await params;
    return (
        <div>
            <h1>Tasks Page</h1>
            <p>Team ID: {teamId}</p>

            <ul>
                <li>Task 1 for team {teamId}</li>
                <li>Task 2 for team {teamId}</li>
            </ul>
        </div>
    );
}