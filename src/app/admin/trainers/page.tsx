import React from "react";
import { getTrainers, type TrainerRow } from "@/actions/trainers";
import { TrainersClient } from "./trainers-client";

export default async function TrainersPage() {
  let trainers: TrainerRow[] = [];
  let error: string | null = null;

  try {
    trainers = await getTrainers();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load trainers.";
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Trainers</h1>
        <p className="text-muted-foreground">
          Manage gym trainers, their specializations, and client assignments.
        </p>
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <p className="font-medium">Error loading trainers</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      ) : (
        <TrainersClient trainers={trainers} />
      )}
    </div>
  );
}
