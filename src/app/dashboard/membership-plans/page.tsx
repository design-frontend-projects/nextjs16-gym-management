"use client";

// src/app/dashboard/membership-plans/page.tsx
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Plan {
  id: string;
  plan_name: string;
  duration_months: number;
  price: number;
  description: string | null;
  max_sessions_per_month: number | null;
  includes_personal_training: boolean;
  includes_group_classes: boolean;
  status: string;
}

export default function MembershipPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlans() {
      const { data, error } = await supabase
        .from("membership_plans")
        .select("*");
      if (error) console.error("Error fetching plans:", error);
      else setPlans(data as Plan[]);
      setLoading(false);
    }
    fetchPlans();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Membership Plans</h1>
      <Link
        href="/dashboard/membership-plans/create"
        className="btn-primary mb-4 inline-block"
      >
        Add Plan
      </Link>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Duration (months)</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Personal Training</th>
              <th className="p-2 border">Group Classes</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id}>
                <td className="p-2 border">{plan.plan_name}</td>
                <td className="p-2 border">{plan.duration_months}</td>
                <td className="p-2 border">${plan.price}</td>
                <td className="p-2 border">
                  {plan.includes_personal_training ? "Yes" : "No"}
                </td>
                <td className="p-2 border">
                  {plan.includes_group_classes ? "Yes" : "No"}
                </td>
                <td className="p-2 border">{plan.status}</td>
                <td className="p-2 border">
                  <Link
                    href={`/dashboard/membership-plans/${plan.id}/edit`}
                    className="text-blue-600 underline mr-2"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
