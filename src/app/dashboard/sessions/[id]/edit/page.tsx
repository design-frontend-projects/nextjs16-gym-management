"use client";

// src/app/dashboard/sessions/[id]/edit/page.tsx
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditSessionPage() {
  const params = useParams();
  const sessionId = params?.id as string;
  const router = useRouter();
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
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!sessionId) return;
    const fetchSession = async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("id", sessionId)
        .single();
      if (error) {
        console.error("Error fetching session:", error);
      } else if (data) {
        setForm({
          member_id: data.member_id ?? "",
          coach_id: data.coach_id ?? "",
          plan_id: data.plan_id ?? "",
          session_date: data.session_date ?? "",
          session_time: data.session_time ?? "",
          duration: data.duration ?? 60,
          session_type: data.session_type ?? "personal_training",
          title: data.title ?? "",
          description: data.description ?? "",
          status: data.status ?? "scheduled",
        });
      }
      setFetching(false);
    };
    fetchSession();
  }, [sessionId]);

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
    const { error } = await supabase
      .from("sessions")
      .update(form)
      .eq("id", sessionId);
    if (error) console.error("Error updating session:", error);
    else router.push("/dashboard/sessions");
    setLoading(false);
  };

  if (fetching) return <p className="p-6">Loading session data...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Session</h1>
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
          {loading ? "Saving..." : "Update Session"}
        </button>
      </form>
    </div>
  );
}
