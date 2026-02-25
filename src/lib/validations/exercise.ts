import { z } from "zod";

export const difficultyValues = [
  "beginner",
  "intermediate",
  "advanced",
] as const;
export type Difficulty = (typeof difficultyValues)[number];

export const createExerciseSchema = z.object({
  name: z
    .string()
    .min(1, "Exercise name is required")
    .max(150, "Name is too long"),
  categoryId: z.string().uuid("Invalid category").optional().or(z.literal("")),
  muscleGroup: z
    .string()
    .max(100, "Muscle group is too long")
    .optional()
    .or(z.literal("")),
  difficulty: z.enum(difficultyValues, {
    message: "Difficulty is required",
  }),
  videoUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  thumbnailUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  description: z
    .string()
    .max(2000, "Description must be under 2000 characters")
    .optional()
    .or(z.literal("")),
});

export const updateExerciseSchema = createExerciseSchema;

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Category name is too long"),
});

export type CreateExerciseInput = z.infer<typeof createExerciseSchema>;
export type UpdateExerciseInput = z.infer<typeof updateExerciseSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
