import { z } from "zod";

export const createTrainerSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(75, "First name is too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(75, "Last name is too long"),
  phone: z
    .string()
    .max(50, "Phone number is too long")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(1000, "Bio must be under 1000 characters")
    .optional()
    .or(z.literal("")),
  experienceYears: z.coerce
    .number()
    .int("Must be a whole number")
    .min(0, "Cannot be negative")
    .max(50, "Maximum 50 years")
    .optional(),
  specializations: z
    .array(z.string().min(1).max(100))
    .min(1, "At least one specialization is required")
    .max(10, "Maximum 10 specializations"),
});

export const updateTrainerSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(75, "First name is too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(75, "Last name is too long"),
  phone: z
    .string()
    .max(50, "Phone number is too long")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(1000, "Bio must be under 1000 characters")
    .optional()
    .or(z.literal("")),
  experienceYears: z.coerce
    .number()
    .int("Must be a whole number")
    .min(0, "Cannot be negative")
    .max(50, "Maximum 50 years")
    .optional(),
  specializations: z
    .array(z.string().min(1).max(100))
    .min(1, "At least one specialization is required")
    .max(10, "Maximum 10 specializations"),
});

export type CreateTrainerInput = z.infer<typeof createTrainerSchema>;
export type UpdateTrainerInput = z.infer<typeof updateTrainerSchema>;
