"use client";

// src/app/dashboard/members/create/page.tsx
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateMemberPage() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    status: "active",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("members").insert([form]);
    if (error) {
      console.error("Error creating member:", error);
    } else {
      router.push("/dashboard/members");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Member</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">First Name</label>
          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Last Name</label>
          <input
            name="last_name"
            value={form.last_name}
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
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Create Member"}
        </button>
      </form>
    </div>
  );
}
