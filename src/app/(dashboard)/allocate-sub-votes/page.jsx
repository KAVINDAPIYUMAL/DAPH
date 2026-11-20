import { Suspense } from "react";
import AllocateSubVotesClient from "./AllocateSubVotesClient";
import { getSubVotesAction } from "./actions";

export const metadata = {
  title: "Allocate Sub Votes | Department of Animal Production and Health",
  description: "Next.js Allocate Sub Votes Page - Department of Animal Production and Health",
};

// Next.js App Router Server Component
export default async function AllocateSubVotesPage() {
  const initialVotes = await getSubVotesAction();

  return (
    <Suspense fallback={<div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>}>
      <AllocateSubVotesClient initialVotes={initialVotes} />
    </Suspense>
  );
}
