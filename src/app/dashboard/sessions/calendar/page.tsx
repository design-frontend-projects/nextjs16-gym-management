"use client";

// src/app/dashboard/sessions/calendar/page.tsx
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Session {
  id: string;
  member_id: string;
  coach_id: string;
  plan_id: string;
  session_date: string; // ISO date string
  session_time: string; // HH:MM
  duration: number;
  session_type: string;
  title: string;
  status: string;
}

export default function SessionCalendarPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .order("session_date", { ascending: true })
        .order("session_time", { ascending: true });
      if (error) console.error("Error fetching sessions:", error);
      else setSessions(data as Session[]);
      setLoading(false);
    };
    fetchSessions();
  }, []);

  const groupedByDate = sessions.reduce((acc, session) => {
    const date = session.session_date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(session);
    return acc;
  }, {} as Record<string, Session[]>);

  if (loading) return <p className="p-6">Loading sessions...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Session Calendar</h1>
      {Object.keys(groupedByDate).length === 0 ? (
        <p>No sessions scheduled.</p>
      ) : (
        Object.entries(groupedByDate).map(([date, daySessions]) => (
          <div key={date} className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{date}</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Time</th>
                  <th className="border p-2 text-left">Title</th>
                  <th className="border p-2 text-left">Type</th>
                  <th className="border p-2 text-left">Status</th>
                  <th className="border p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {daySessions.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="border p-2">{s.session_time}</td>
                    <td className="border p-2">{s.title || "Untitled"}</td>
                    <td className="border p-2">
                      {s.session_type.replace("_", " ")}
                    </td>
                    <td className="border p-2">{s.status}</td>
                    <td className="border p-2">
                      <button
                        onClick={() =>
                          router.push(`/dashboard/sessions/${s.id}/edit`)
                        }
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}
