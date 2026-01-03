"use client";

// src/app/dashboard/members/[id]/edit/page.tsx
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
}

export default function EditMemberPage() {
  const params = useParams();
  const memberId = params.id as string;
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchMember() {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("id", memberId)
        .single();
      if (error) console.error("Error fetching member:", error);
      else setMember(data as Member);
      setLoading(false);
    }
    if (memberId) fetchMember();
  }, [memberId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!member) return;
    setMember({ ...member, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;
    setSaving(true);
    const { error } = await supabase
      .from("members")
      .update({
        first_name: member.first_name,
        last_name: member.last_name,
        email: member.email,
        phone: member.phone,
        status: member.status,
      })
      .eq("id", member.id);
    if (error) console.error("Error updating member:", error);
    else router.push("/dashboard/members");
    setSaving(false);
  };

  if (loading) return <p>Loading...</p>;
  if (!member) return <p>Member not found.</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Member</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">First Name</label>
          <input
            name="first_name"
            value={member.first_name}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Last Name</label>
          <input
            name="last_name"
            value={member.last_name}
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
            value={member.email}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Phone</label>
          <input
            name="phone"
            value={member.phone}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1">Status</label>
          <input
            name="status"
            value={member.status}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {saving ? "Saving..." : "Update Member"}
        </button>
      </form>
    </div>
  );
}
