"use client";

// src/app/dashboard/coaches/page.tsx
export const dynamic = "force-dynamic";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Coach {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  specialization: string;
  status: string;
}

export default function CoachesPage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCoaches() {
      const { data, error } = await supabase.from("coaches").select("*");
      if (error) console.error("Error fetching coaches:", error);
      else setCoaches(data as Coach[]);
      setLoading(false);
    }
    fetchCoaches();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Coaches</h1>
      <Link
        href="/dashboard/coaches/create"
        className="btn-primary mb-4 inline-block"
      >
        Add Coach
      </Link>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Specialization</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coaches.map((c) => (
              <tr key={c.id}>
                <td className="p-2 border">
                  {c.first_name} {c.last_name}
                </td>
                <td className="p-2 border">{c.email}</td>
                <td className="p-2 border">{c.specialization}</td>
                <td className="p-2 border">{c.status}</td>
                <td className="p-2 border">
                  <Link
                    href={`/dashboard/coaches/${c.id}/edit`}
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
