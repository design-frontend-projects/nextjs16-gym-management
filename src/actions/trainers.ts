"use server";

import { prisma } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  createTrainerSchema,
  updateTrainerSchema,
  type CreateTrainerInput,
  type UpdateTrainerInput,
} from "@/lib/validations/trainer";

// --------------- Types ---------------

export type TrainerRow = {
  id: string;
  profileId: string;
  fullName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  bio: string | null;
  experienceYears: number | null;
  isActive: boolean;
  specializations: string[];
  activeClients: number;
  createdAt: Date;
};

// --------------- Queries ---------------

export async function getTrainers(): Promise<TrainerRow[]> {
  const trainers = await prisma.trainers.findMany({
    include: {
      profiles: {
        select: {
          id: true,
          full_name: true,
          email: true,
          phone: true,
          avatar_url: true,
          is_active: true,
        },
      },
      specializations: {
        select: { name: true },
      },
      client_trainers: {
        where: { status: "active" },
        select: { id: true },
      },
    },
    orderBy: { created_at: "desc" },
  });

  return trainers.map((t) => ({
    id: t.id,
    profileId: t.profiles.id,
    fullName: t.profiles.full_name ?? "Unknown",
    email: t.profiles.email,
    phone: t.profiles.phone,
    avatarUrl: t.profiles.avatar_url,
    bio: t.bio,
    experienceYears: t.experience_years,
    isActive: t.profiles.is_active,
    specializations: t.specializations.map((s) => s.name),
    activeClients: t.client_trainers.length,
    createdAt: t.created_at,
  }));
}

// --------------- Specialization Catalog ---------------

export async function getAvailableSpecializations(): Promise<string[]> {
  const rows = await prisma.trainer_specializations.findMany({
    select: { name: true },
    distinct: ["name"],
    orderBy: { name: "asc" },
  });
  return rows.map((r) => r.name);
}

export async function deleteSpecializationByName(name: string) {
  await prisma.trainer_specializations.deleteMany({
    where: { name },
  });
  revalidatePath("/admin/trainers");
  return { success: true };
}

// --------------- Mutations ---------------

export async function createTrainer(raw: CreateTrainerInput) {
  const data = createTrainerSchema.parse(raw);

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const adminProfile = await prisma.profiles.findFirst({
    where: { clerk_user_id: userId },
    select: { tenant_id: true },
  });
  if (!adminProfile) throw new Error("Admin profile not found");
  const tenantId = adminProfile.tenant_id;

  // 1) Create Clerk user
  const clerk = await clerkClient();
  const clerkUser = await clerk.users.createUser({
    emailAddress: [data.email],
    firstName: data.firstName,
    lastName: data.lastName,
    skipPasswordChecks: true,
    password: crypto.randomUUID(),
  });

  // 2) Create profile with trainer role
  const profile = await prisma.profiles.create({
    data: {
      tenant_id: tenantId,
      clerk_user_id: clerkUser.id,
      email: data.email,
      full_name: `${data.firstName} ${data.lastName}`.trim(),
      phone: data.phone || null,
      role: "trainer",
      is_active: true,
    },
  });

  // 3) Create trainer record
  const trainer = await prisma.trainers.create({
    data: {
      tenant_id: tenantId,
      profile_id: profile.id,
      bio: data.bio || null,
      experience_years: data.experienceYears ?? null,
    },
  });

  // 4) Create specializations
  if (data.specializations.length > 0) {
    await prisma.trainer_specializations.createMany({
      data: data.specializations.map((name) => ({
        trainer_id: trainer.id,
        name,
      })),
    });
  }

  revalidatePath("/admin/trainers");
  return { success: true };
}

export async function updateTrainer(
  trainerId: string,
  raw: UpdateTrainerInput,
) {
  const data = updateTrainerSchema.parse(raw);

  const trainer = await prisma.trainers.findUnique({
    where: { id: trainerId },
    include: { profiles: true },
  });
  if (!trainer) throw new Error("Trainer not found");

  const fullName = `${data.firstName} ${data.lastName}`.trim();

  // 1) Update profile
  await prisma.profiles.update({
    where: { id: trainer.profiles.id },
    data: {
      full_name: fullName,
      phone: data.phone || null,
    },
  });

  // 2) Update trainer record
  await prisma.trainers.update({
    where: { id: trainerId },
    data: {
      bio: data.bio || null,
      experience_years: data.experienceYears ?? null,
    },
  });

  // 3) Sync specializations (delete all, re-create)
  await prisma.trainer_specializations.deleteMany({
    where: { trainer_id: trainerId },
  });
  if (data.specializations.length > 0) {
    await prisma.trainer_specializations.createMany({
      data: data.specializations.map((name) => ({
        trainer_id: trainerId,
        name,
      })),
    });
  }

  // 4) Sync name to Clerk
  const clerk = await clerkClient();
  await clerk.users.updateUser(trainer.profiles.clerk_user_id, {
    firstName: data.firstName,
    lastName: data.lastName,
  });

  revalidatePath("/admin/trainers");
  return { success: true };
}

export async function deleteTrainer(trainerId: string) {
  const trainer = await prisma.trainers.findUnique({
    where: { id: trainerId },
    include: { profiles: true },
  });
  if (!trainer) throw new Error("Trainer not found");

  // 1) Soft-delete profile
  const now = new Date();
  await prisma.profiles.update({
    where: { id: trainer.profiles.id },
    data: { deleted_at: now, is_active: false },
  });

  // 2) Delete trainer (cascades specializations & client_trainers)
  await prisma.trainers.delete({
    where: { id: trainerId },
  });

  // 3) Delete Clerk user
  const clerk = await clerkClient();
  await clerk.users.deleteUser(trainer.profiles.clerk_user_id);

  revalidatePath("/admin/trainers");
  return { success: true };
}

export async function toggleTrainerStatus(trainerId: string) {
  const trainer = await prisma.trainers.findUnique({
    where: { id: trainerId },
    include: { profiles: true },
  });
  if (!trainer) throw new Error("Trainer not found");

  const newStatus = !trainer.profiles.is_active;

  await prisma.profiles.update({
    where: { id: trainer.profiles.id },
    data: { is_active: newStatus },
  });

  const clerk = await clerkClient();
  if (newStatus) {
    await clerk.users.unbanUser(trainer.profiles.clerk_user_id);
  } else {
    await clerk.users.banUser(trainer.profiles.clerk_user_id);
  }

  revalidatePath("/admin/trainers");
  return { success: true, isActive: newStatus };
}
