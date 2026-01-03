"use client";

// src/app/dashboard/membership-plans/create/page.tsx
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePlanPage() {
  const [form, setForm] = useState({
    plan_name: "",
    duration_months: 0,
    price: 0,
    description: "",
    max_sessions_per_month: null as number | null,
    includes_personal_training: false,
    includes_group_classes: true,
    status: "active",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("membership_plans").insert([form]);
    if (error) console.error("Error creating plan:", error);
    else router.push("/dashboard/membership-plans");
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Membership Plan</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Plan Name</label>
          <input
            name="plan_name"
            value={form.plan_name}
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
            value={form.duration_months}
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
            value={form.price}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1">Max Sessions / Month</label>
          <input
            name="max_sessions_per_month"
            type="number"
            value={form.max_sessions_per_month ?? ""}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="includes_personal_training"
            checked={form.includes_personal_training}
            onChange={handleChange}
          />
          <label>Includes Personal Training</label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="includes_group_classes"
            checked={form.includes_group_classes}
            onChange={handleChange}
          />
          <label>Includes Group Classes</label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Create Plan"}
        </button>
      </form>
    </div>
  );
}
