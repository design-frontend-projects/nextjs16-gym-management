"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  createExerciseSchema,
  updateExerciseSchema,
  createCategorySchema,
  type CreateExerciseInput,
  type UpdateExerciseInput,
  type CreateCategoryInput,
} from "@/lib/validations/exercise";

// ─── Types ───────────────────────────────────────────────

export type ExerciseRow = {
  id: string;
  name: string;
  categoryId: string | null;
  categoryName: string | null;
  muscleGroup: string | null;
  difficulty: string;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  description: string | null;
  createdAt: Date;
};

export type CategoryRow = {
  id: string;
  name: string;
  exerciseCount: number;
};

// ─── Helpers ─────────────────────────────────────────────

async function getTenantId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const profile = await prisma.profiles.findFirst({
    where: { clerk_user_id: userId },
    select: { tenant_id: true },
  });
  if (!profile) throw new Error("Profile not found");
  return profile.tenant_id;
}

// ─── Exercise Queries ────────────────────────────────────

export async function getExercises(): Promise<ExerciseRow[]> {
  const exercises = await prisma.exercises.findMany({
    include: {
      categories: { select: { name: true } },
    },
    orderBy: { created_at: "desc" },
  });

  return exercises.map((e) => ({
    id: e.id,
    name: e.name,
    categoryId: e.category_id,
    categoryName: e.categories?.name ?? null,
    muscleGroup: e.muscle_group,
    difficulty: e.difficulty,
    videoUrl: e.video_url,
    thumbnailUrl: e.thumbnail_url,
    description: e.description,
    createdAt: e.created_at,
  }));
}

// ─── Category Queries ────────────────────────────────────

export async function getCategories(): Promise<CategoryRow[]> {
  const categories = await prisma.exercise_categories.findMany({
    include: {
      _count: { select: { exercises: true } },
    },
    orderBy: { name: "asc" },
  });

  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    exerciseCount: c._count.exercises,
  }));
}

// ─── Exercise Mutations ──────────────────────────────────

export async function createExercise(raw: CreateExerciseInput) {
  const data = createExerciseSchema.parse(raw);
  const tenantId = await getTenantId();

  await prisma.exercises.create({
    data: {
      tenant_id: tenantId,
      name: data.name,
      category_id: data.categoryId || null,
      muscle_group: data.muscleGroup || null,
      difficulty: data.difficulty as "beginner" | "intermediate" | "advanced",
      video_url: data.videoUrl || null,
      thumbnail_url: data.thumbnailUrl || null,
      description: data.description || null,
    },
  });

  revalidatePath("/admin/exercises");
  return { success: true };
}

export async function updateExercise(
  exerciseId: string,
  raw: UpdateExerciseInput,
) {
  const data = updateExerciseSchema.parse(raw);

  const exercise = await prisma.exercises.findUnique({
    where: { id: exerciseId },
  });
  if (!exercise) throw new Error("Exercise not found");

  await prisma.exercises.update({
    where: { id: exerciseId },
    data: {
      name: data.name,
      category_id: data.categoryId || null,
      muscle_group: data.muscleGroup || null,
      difficulty: data.difficulty as "beginner" | "intermediate" | "advanced",
      video_url: data.videoUrl || null,
      thumbnail_url: data.thumbnailUrl || null,
      description: data.description || null,
    },
  });

  revalidatePath("/admin/exercises");
  return { success: true };
}

export async function deleteExercise(exerciseId: string) {
  const exercise = await prisma.exercises.findUnique({
    where: { id: exerciseId },
  });
  if (!exercise) throw new Error("Exercise not found");

  await prisma.exercises.delete({ where: { id: exerciseId } });

  revalidatePath("/admin/exercises");
  return { success: true };
}

// ─── Category Mutations ──────────────────────────────────

export async function createCategory(raw: CreateCategoryInput) {
  const data = createCategorySchema.parse(raw);
  const tenantId = await getTenantId();

  const category = await prisma.exercise_categories.create({
    data: {
      tenant_id: tenantId,
      name: data.name,
    },
  });

  revalidatePath("/admin/exercises");
  return { success: true, id: category.id, name: category.name };
}

export async function updateCategory(
  categoryId: string,
  raw: CreateCategoryInput,
) {
  const data = createCategorySchema.parse(raw);

  const cat = await prisma.exercise_categories.findUnique({
    where: { id: categoryId },
  });
  if (!cat) throw new Error("Category not found");

  await prisma.exercise_categories.update({
    where: { id: categoryId },
    data: { name: data.name },
  });

  revalidatePath("/admin/exercises");
  return { success: true };
}

export async function deleteCategory(categoryId: string) {
  const cat = await prisma.exercise_categories.findUnique({
    where: { id: categoryId },
    include: { _count: { select: { exercises: true } } },
  });
  if (!cat) throw new Error("Category not found");

  // Unlink exercises from this category first
  await prisma.exercises.updateMany({
    where: { category_id: categoryId },
    data: { category_id: null },
  });

  await prisma.exercise_categories.delete({ where: { id: categoryId } });

  revalidatePath("/admin/exercises");
  return { success: true };
}
