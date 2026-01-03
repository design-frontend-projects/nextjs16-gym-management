"use client";

// src/app/dashboard/members/page.tsx
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMembers() {
      const { data, error } = await supabase.from("members").select("*");
      if (error) console.error("Error fetching members:", error);
      else setMembers(data as Member[]);
      setLoading(false);
    }
    fetchMembers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Members</h1>
      <Link
        href="/dashboard/members/create"
        className="btn-primary mb-4 inline-block"
      >
        Add Member
      </Link>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td className="p-2 border">
                  {m.first_name} {m.last_name}
                </td>
                <td className="p-2 border">{m.email}</td>
                <td className="p-2 border">{m.status}</td>
                <td className="p-2 border">
                  <Link
                    href={`/dashboard/members/${m.id}/edit`}
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
