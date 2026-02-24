import React from "react";
import {
  getSubscriptions,
  type SubscriptionWithRelations,
} from "@/actions/subscriptions";
import { SubscriptionsClient } from "./subscriptions-client";

export default async function SubscriptionsPage() {
  let subscriptions: SubscriptionWithRelations[] = [];
  let error: string | null = null;

  try {
    subscriptions = await getSubscriptions();
  } catch (e) {
    error =
      e instanceof Error ? e.message : "Failed to load subscriptions data.";
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Subscriptions & Billing
        </h1>
        <p className="text-muted-foreground">
          Manage member subscriptions, plans, and payment history.
        </p>
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <p className="font-medium">Error loading data</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      ) : (
        <SubscriptionsClient subscriptions={subscriptions} />
      )}
    </div>
  );
}
