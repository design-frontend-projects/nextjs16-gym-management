"use client";

// src/app/dashboard/membership-plans/[id]/edit/page.tsx
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

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

export default function EditPlanPage() {
  const params = useParams();
  const planId = params.id as string;
  const router = useRouter();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchPlan() {
      const { data, error } = await supabase
        .from("membership_plans")
        .select("*")
        .eq("id", planId)
        .single();
      if (error) console.error("Error fetching plan:", error);
      else setPlan(data as Plan);
      setLoading(false);
    }
    if (planId) fetchPlan();
  }, [planId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    if (!plan) return;
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setPlan((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      } as Plan;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan) return;
    setSaving(true);
    const { error } = await supabase
      .from("membership_plans")
      .update({
        plan_name: plan.plan_name,
        duration_months: plan.duration_months,
        price: plan.price,
        description: plan.description,
        max_sessions_per_month: plan.max_sessions_per_month,
        includes_personal_training: plan.includes_personal_training,
        includes_group_classes: plan.includes_group_classes,
        status: plan.status,
      })
      .eq("id", plan.id);
    if (error) console.error("Error updating plan:", error);
    else router.push("/dashboard/membership-plans");
    setSaving(false);
  };

  if (loading) return <p>Loading...</p>;
  if (!plan) return <p>Plan not found.</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Membership Plan</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Plan Name</label>
          <input
            name="plan_name"
            value={plan.plan_name}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Duration (months)</label>
          <input
            name="duration_months"
            type="number"
            value={plan.duration_months}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Price</label>
          <input
            name="price"
            type="number"
            step="0.01"
            value={plan.price}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={plan.description ?? ""}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1">Max Sessions / Month</label>
          <input
            name="max_sessions_per_month"
            type="number"
            value={plan.max_sessions_per_month ?? ""}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="includes_personal_training"
            checked={plan.includes_personal_training}
            onChange={handleChange}
          />
          <label>Includes Personal Training</label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="includes_group_classes"
            checked={plan.includes_group_classes}
            onChange={handleChange}
          />
          <label>Includes Group Classes</label>
        </div>
        <div>
          <label className="block mb-1">Status</label>
          <input
            name="status"
            value={plan.status}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {saving ? "Saving..." : "Update Plan"}
        </button>
      </form>
    </div>
  );
}
