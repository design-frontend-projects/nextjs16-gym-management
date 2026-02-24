import React from "react";
import { getMembers, type MemberRow } from "@/actions/members";
import { MembersClient } from "./members-client";

export default async function MembersPage() {
  let members: MemberRow[] = [];
  let error: string | null = null;

  try {
    members = await getMembers();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load members.";
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Members</h1>
        <p className="text-muted-foreground">
          Manage your gym members, activate or deactivate accounts, and track
          subscriptions.
        </p>
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <p className="font-medium">Error loading members</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      ) : (
        <MembersClient members={members} />
      )}
    </div>
  );
}
