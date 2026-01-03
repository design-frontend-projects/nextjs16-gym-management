"use client";

// src/app/dashboard/sessions/create/page.tsx
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateSessionPage() {
  const [form, setForm] = useState({
    member_id: "",
    coach_id: "",
    plan_id: "",
    session_date: "",
    session_time: "",
    duration: 60,
    session_type: "personal_training",
    title: "",
    description: "",
    status: "scheduled",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("sessions").insert([form]);
    if (error) console.error("Error creating session:", error);
    else router.push("/dashboard/sessions");
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Session</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Date</label>
          <input
            name="session_date"
            type="date"
            value={form.session_date}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Time</label>
          <input
            name="session_time"
            type="time"
            value={form.session_time}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Duration (minutes)</label>
          <input
            name="duration"
            type="number"
            value={form.duration}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Type</label>
          <select
            name="session_type"
            value={form.session_type}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="personal_training">Personal Training</option>
            <option value="group_class">Group Class</option>
            <option value="open_gym">Open Gym</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded p-2"
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
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Create Session"}
        </button>
      </form>
    </div>
  );
}
