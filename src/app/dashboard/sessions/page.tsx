"use client";

// src/app/dashboard/sessions/page.tsx
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Session {
  id: string;
  member_id: string | null;
  coach_id: string | null;
  plan_id: string | null;
  session_date: string;
  session_time: string;
  duration: number;
  session_type: string;
  title: string;
  status: string;
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSessions() {
      const { data, error } = await supabase.from("sessions").select("*");
      if (error) console.error("Error fetching sessions:", error);
      else setSessions(data as Session[]);
      setLoading(false);
    }
    fetchSessions();

    const channel = supabase
      .channel("realtime sessions")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "sessions" },
        (payload) => {
          setSessions((prev) => [...prev, payload.new as Session]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sessions</h1>
      <Link
        href="/dashboard/sessions/create"
        className="btn-primary mb-4 inline-block"
      >
        Add Session
      </Link>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Time</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id}>
                <td className="p-2 border">{s.session_date}</td>
                <td className="p-2 border">{s.session_time}</td>
                <td className="p-2 border">{s.session_type}</td>
                <td className="p-2 border">{s.title}</td>
                <td className="p-2 border">{s.status}</td>
                <td className="p-2 border">
                  <Link
                    href={`/dashboard/sessions/${s.id}/edit`}
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
