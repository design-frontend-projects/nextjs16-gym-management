"use server";

import { prisma } from "@/lib/prisma";
import type { subscription_status } from "@prisma/client";

export type SubscriptionWithRelations = {
  id: string;
  status: subscription_status;
  start_date: Date;
  end_date: Date;
  remaining_sessions: number | null;
  created_at: Date | null;
  clients: {
    id: string;
    profiles: {
      full_name: string | null;
      email: string;
    } | null;
  };
  membership_plans: {
    id: string;
    name: string;
    price: number;
    duration_days: number;
    sessions_limit: number | null;
  };
  payments: {
    id: string;
    amount: number;
    status: string;
    payment_method: string;
    paid_at: Date | null;
  }[];
};

export async function getSubscriptions(): Promise<SubscriptionWithRelations[]> {
  const subs = await prisma.subscriptions.findMany({
    include: {
      clients: {
        include: {
          profiles: {
            select: {
              full_name: true,
              email: true,
            },
          },
        },
      },
      membership_plans: {
        select: {
          id: true,
          name: true,
          price: true,
          duration_days: true,
          sessions_limit: true,
        },
      },
      payments: {
        select: {
          id: true,
          amount: true,
          status: true,
          payment_method: true,
          paid_at: true,
        },
        orderBy: { created_at: "desc" },
        take: 5,
      },
    },
    orderBy: { created_at: "desc" },
  });

  // Serialize Decimal fields to numbers for client components
  return subs.map((sub) => ({
    ...sub,
    membership_plans: {
      ...sub.membership_plans,
      price: Number(sub.membership_plans.price),
    },
    payments: sub.payments.map((p) => ({
      ...p,
      amount: Number(p.amount),
      status: String(p.status),
      payment_method: String(p.payment_method),
    })),
  }));
}

export async function getMembershipPlans() {
  return prisma.membership_plans.findMany({
    where: { deleted_at: null },
    orderBy: { name: "asc" },
  });
}
