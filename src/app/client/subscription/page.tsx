"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Check, CreditCard } from "lucide-react";

interface Plan {
  id: string;
  plan_name: string;
  price: number;
  duration_months: number;
  description: string;
  includes_personal_training: boolean;
  includes_group_classes: boolean;
}

// Mock subscription data since we don't have a subscriptions table yet or logic for it
// We will assume for now we might fetch it or show available plans
export default function SubscriptionPage() {
  const { user } = useAuthStore();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<any>(null); // Placeholder for current sub
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlans() {
      setLoading(true);
      const { data } = await supabase
        .from("membership_plans")
        .select("*")
        .eq("status", "active");
      if (data) setPlans(data);

      // Mock current subscription fetch
      // In real app, fetch from specialized table
      setCurrentPlan({
        status: "active",
        plan_name: "Silver Membership", // Example
        end_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      });

      setLoading(false);
    }
    fetchPlans();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subscription</h1>
        <p className="text-muted-foreground">
          Manage your membership and billing.
        </p>
      </div>

      {/* Current Subscription Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Current Plan
            <Badge
              variant={
                currentPlan?.status === "active" ? "default" : "destructive"
              }
            >
              {currentPlan?.status?.toUpperCase()}
            </Badge>
          </CardTitle>
          <CardDescription>Your active membership details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <CreditCard className="text-muted-foreground w-5 h-5" />
              <span className="font-semibold">{currentPlan?.plan_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="text-muted-foreground w-5 h-5" />
              <span>
                Renews on:{" "}
                {currentPlan?.end_date
                  ? new Date(currentPlan.end_date).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline">Manage Billing</Button>
        </CardFooter>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{plan.plan_name}</CardTitle>
                <CardDescription className="text-2xl font-bold">
                  ${plan.price}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    / {plan.duration_months} month(s)
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-2">
                <p className="text-sm text-gray-600">{plan.description}</p>
                <div className="text-sm space-y-1">
                  {plan.includes_personal_training && (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" /> Personal
                      Training
                    </div>
                  )}
                  {plan.includes_group_classes && (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" /> Group Classes
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Upgrade</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
