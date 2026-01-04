"use client";

// src/app/dashboard/coaches/create/page.tsx
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateCoachPage() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    specialization: "",
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
    const { error } = await supabase.from("coaches").insert([form]);
    if (error) console.error("Error creating coach:", error);
    else router.push("/dashboard/coaches");
    setLoading(false);
  };

  return (
    <div className="p-6 grid grid-cols-12 gap-2 mx-auto">
      <div className="col-span-12">
        <h1 className="text-2xl font-bold mb-4">Add New Coach</h1>
      </div>
      <form onSubmit={handleSubmit} className="grid col-span-full gap-2">
        <div className="col-span-12">
          <label className="block mb-1">First Name</label>
          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div className="col-span-12">
          <label className="block mb-1">Last Name</label>
          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div className="col-span-12">
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
        <div className="col-span-12">
          <label className="block mb-1">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div className="col-span-12">
          <label className="block mb-1">Specialization</label>
          <input
            name="specialization"
            value={form.specialization}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Create Coach"}
        </button>
      </form>
    </div>
  );
}
