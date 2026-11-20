"use server";

import { revalidatePath } from "next/cache";

// In-memory store for server-side persistence in dev environment
let subVotesStore = [];

/**
 * Next.js Server Action: Fetch all allocated sub-votes
 */
export async function getSubVotesAction() {
  return [...subVotesStore];
}

/**
 * Next.js Server Action: Add a new sub-vote allocation
 */
export async function addSubVoteAction(formData) {
  const newVote = {
    id: Date.now().toString(),
    reference: formData.reference || "REQ-2026-001",
    accountType: formData.accountType,
    accountCategory: formData.accountCategory,
    vote: formData.vote.trim(),
    amount: parseFloat(formData.amount) || 0,
    createdAt: new Date().toISOString(),
  };

  subVotesStore.push(newVote);
  revalidatePath("/allocate-sub-votes");
  revalidatePath("/pending-tasks/allocate-sub-votes");

  return { success: true, data: newVote };
}

/**
 * Next.js Server Action: Delete a sub-vote allocation
 */
export async function deleteSubVoteAction(id) {
  subVotesStore = subVotesStore.filter((v) => v.id !== id);
  revalidatePath("/allocate-sub-votes");
  revalidatePath("/pending-tasks/allocate-sub-votes");

  return { success: true };
}
