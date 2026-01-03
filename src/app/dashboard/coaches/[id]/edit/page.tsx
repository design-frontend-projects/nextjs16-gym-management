"use client";

// src/app/dashboard/coaches/[id]/edit/page.tsx
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface Coach {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  specialization: string;
  status: string;
}

export default function EditCoachPage() {
  const params = useParams();
  const coachId = params.id as string;
  const router = useRouter();
  const [coach, setCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchCoach() {
      const { data, error } = await supabase
        .from("coaches")
        .select("*")
        .eq("id", coachId)
        .single();
      if (error) console.error("Error fetching coach:", error);
      else setCoach(data as Coach);
      setLoading(false);
    }
    if (coachId) fetchCoach();
  }, [coachId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!coach) return;
    setCoach({ ...coach, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coach) return;
    setSaving(true);
    const { error } = await supabase
      .from("coaches")
      .update({
        first_name: coach.first_name,
        last_name: coach.last_name,
        email: coach.email,
        phone: coach.phone,
        specialization: coach.specialization,
        status: coach.status,
      })
      .eq("id", coach.id);
    if (error) console.error("Error updating coach:", error);
    else router.push("/dashboard/coaches");
    setSaving(false);
  };

  if (loading) return <p>Loading...</p>;
  if (!coach) return <p>Coach not found.</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Coach</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">First Name</label>
          <input
            name="first_name"
            value={coach.first_name}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Last Name</label>
          <input
            name="last_name"
            value={coach.last_name}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={coach.email}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Phone</label>
          <input
            name="phone"
            value={coach.phone}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1">Specialization</label>
          <input
            name="specialization"
            value={coach.specialization}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1">Status</label>
          <input
            name="status"
            value={coach.status}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {saving ? "Saving..." : "Update Coach"}
        </button>
      </form>
    </div>
  );
}
