import React from "react";
import {
  getExercises,
  getCategories,
  type ExerciseRow,
  type CategoryRow,
} from "@/actions/exercises";
import { ExercisesClient } from "./exercises-client";

export default async function ExercisesPage() {
  let exercises: ExerciseRow[] = [];
  let categories: CategoryRow[] = [];
  let error: string | null = null;

  try {
    [exercises, categories] = await Promise.all([
      getExercises(),
      getCategories(),
    ]);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load exercises.";
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Exercise Library</h1>
        <p className="text-muted-foreground">
          Manage exercises, categories, muscle groups, and instructional videos.
        </p>
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <p className="font-medium">Error loading exercises</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      ) : (
        <ExercisesClient exercises={exercises} categories={categories} />
      )}
    </div>
  );
}
