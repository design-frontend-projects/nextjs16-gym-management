"use server";

import { prisma } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { user_role_type } from "@prisma/client";

// --------------- Types ---------------

export type MemberRow = {
  id: string;
  profileId: string | null;
  fullName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  gender: string | null;
  fitnessGoal: string | null;
  isActive: boolean;
  role: string;
  joinedAt: Date;
  subscriptionStatus: string | null;
  planName: string | null;
};

// --------------- Queries ---------------

export async function getRoles(): Promise<string[]> {
  return Object.values(user_role_type);
}

export async function getMembers(): Promise<MemberRow[]> {
  const clients = await prisma.clients.findMany({
    where: { deleted_at: null },
    include: {
      profiles: {
        select: {
          id: true,
          full_name: true,
          email: true,
          phone: true,
          avatar_url: true,
          is_active: true,
          role: true,
        },
      },
      subscriptions: {
        where: { status: "active" },
        take: 1,
        orderBy: { created_at: "desc" },
        include: {
          membership_plans: {
            select: { name: true },
          },
        },
      },
    },
    orderBy: { created_at: "desc" },
  });

  return clients.map((c) => ({
    id: c.id,
    profileId: c.profile_id,
    fullName: c.profiles?.full_name ?? "Unknown",
    email: c.profiles?.email ?? "",
    phone: c.profiles?.phone ?? null,
    avatarUrl: c.profiles?.avatar_url ?? null,
    gender: c.gender,
    fitnessGoal: c.fitness_goal,
    isActive: c.profiles?.is_active ?? false,
    role: c.profiles?.role ?? "client",
    joinedAt: c.created_at,
    subscriptionStatus: c.subscriptions[0]?.status ?? null,
    planName: c.subscriptions[0]?.membership_plans?.name ?? null,
  }));
}

// --------------- Mutations ---------------

export async function createMember(data: {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  gender?: string;
  fitnessGoal?: string;
  role?: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // 1) Find admin's tenant
  const adminProfile = await prisma.profiles.findFirst({
    where: { clerk_user_id: userId },
    select: { tenant_id: true, role: true },
  });
  if (!adminProfile) throw new Error("Admin profile not found");
  const tenantId = adminProfile.tenant_id;
  const adminRole = adminProfile.role;

  // Determine role based on permissions
  let assignedRole: user_role_type = user_role_type.client;
  if (
    data.role &&
    Object.values(user_role_type).includes(data.role as user_role_type) &&
    (adminRole === user_role_type.super_admin ||
      adminRole === user_role_type.gym_admin)
  ) {
    assignedRole = data.role as user_role_type;
  }

  // 2) Create Clerk user (invitation-style with a random password)
  const clerk = await clerkClient();
  const clerkUser = await clerk.users.createUser({
    emailAddress: [data.email],
    firstName: data.firstName,
    lastName: data.lastName,
    skipPasswordChecks: true,
    password: crypto.randomUUID(), // temp password, user resets on first login
  });

  // 3) Create profile record
  const profile = await prisma.profiles.create({
    data: {
      tenant_id: tenantId,
      clerk_user_id: clerkUser.id,
      email: data.email,
      full_name: `${data.firstName} ${data.lastName}`.trim(),
      phone: data.phone || null,
      role: assignedRole,
      is_active: true,
    },
  });

  // 4) Create client record
  await prisma.clients.create({
    data: {
      tenant_id: tenantId,
      profile_id: profile.id,
      gender: data.gender || null,
      fitness_goal: data.fitnessGoal || null,
    },
  });

  revalidatePath("/admin/members");
  return { success: true };
}

export async function updateMember(
  clientId: string,
  data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    gender?: string;
    fitnessGoal?: string;
    role?: string;
  },
) {
  const client = await prisma.clients.findUnique({
    where: { id: clientId },
    include: { profiles: true },
  });
  if (!client || !client.profiles) throw new Error("Member not found");

  const fullName =
    data.firstName || data.lastName
      ? `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim()
      : undefined;

  const { userId } = await auth();
  const executingUser = await prisma.profiles.findFirst({
    where: { clerk_user_id: userId || "" },
  });

  const canUpdateRole =
    executingUser &&
    (executingUser.role === user_role_type.super_admin ||
      executingUser.role === user_role_type.gym_admin);

  let newRole = undefined;
  if (
    data.role &&
    canUpdateRole &&
    Object.values(user_role_type).includes(data.role as user_role_type)
  ) {
    newRole = data.role as user_role_type;
  }

  // Update profile
  await prisma.profiles.update({
    where: { id: client.profiles.id },
    data: {
      full_name: fullName,
      phone: data.phone,
      ...(newRole && { role: newRole }),
    },
  });

  // Update client
  await prisma.clients.update({
    where: { id: clientId },
    data: {
      gender: data.gender,
      fitness_goal: data.fitnessGoal,
    },
  });

  // Sync to Clerk
  if (fullName) {
    const clerk = await clerkClient();
    const nameParts = fullName.split(" ");
    await clerk.users.updateUser(client.profiles.clerk_user_id, {
      firstName: nameParts[0],
      lastName: nameParts.slice(1).join(" ") || undefined,
    });
  }

  revalidatePath("/admin/members");
  return { success: true };
}

export async function toggleMemberStatus(clientId: string) {
  const client = await prisma.clients.findUnique({
    where: { id: clientId },
    include: { profiles: true },
  });
  if (!client || !client.profiles) throw new Error("Member not found");

  const newStatus = !client.profiles.is_active;

  await prisma.profiles.update({
    where: { id: client.profiles.id },
    data: { is_active: newStatus },
  });

  // Block/unblock in Clerk
  const clerk = await clerkClient();
  if (newStatus) {
    await clerk.users.unbanUser(client.profiles.clerk_user_id);
  } else {
    await clerk.users.banUser(client.profiles.clerk_user_id);
  }

  revalidatePath("/admin/members");
  return { success: true, isActive: newStatus };
}

export async function deleteMember(clientId: string) {
  const client = await prisma.clients.findUnique({
    where: { id: clientId },
    include: { profiles: true },
  });
  if (!client || !client.profiles) throw new Error("Member not found");

  // Soft-delete in DB
  const now = new Date();
  await prisma.clients.update({
    where: { id: clientId },
    data: { deleted_at: now },
  });
  await prisma.profiles.update({
    where: { id: client.profiles.id },
    data: { deleted_at: now, is_active: false },
  });

  // Delete from Clerk entirely
  const clerk = await clerkClient();
  await clerk.users.deleteUser(client.profiles.clerk_user_id);

  revalidatePath("/admin/members");
  return { success: true };
}
