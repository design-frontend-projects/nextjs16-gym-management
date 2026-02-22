export type UserRole = "super_admin" | "gym_admin" | "trainer" | "client";
export type SubscriptionStatus = "active" | "expired" | "cancelled" | "pending";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentMethodType = "cash" | "card" | "online";
export type WorkoutStatus = "scheduled" | "completed" | "cancelled";
export type MediaType = "video" | "image";
export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  subscription_plan: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  tenant_id: string;
  clerk_user_id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_active: boolean;
}

export interface Client {
  id: string;
  tenant_id: string;
  profile_id: string;
  gender: string | null;
  birth_date: string | null;
  height_cm: number | null;
  initial_weight: number | null;
  fitness_goal: string | null;
  medical_notes: string | null;
}
