import { Suspense } from "react";
import AllocateSubVotesClient from "../../allocate-sub-votes/AllocateSubVotesClient";
import { getSubVotesAction } from "../../allocate-sub-votes/actions";

export const metadata = {
  title: "Allocate Sub Votes | Pending Tasks | DAPH",
  description: "Pending Tasks - Allocate Sub Votes",
};

// Next.js App Router Server Component
export default async function PendingTasksAllocateSubVotesPage() {
  const initialVotes = await getSubVotesAction();

  return (
    <Suspense fallback={<div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>}>
      <AllocateSubVotesClient initialVotes={initialVotes} />
    </Suspense>
  );
}
