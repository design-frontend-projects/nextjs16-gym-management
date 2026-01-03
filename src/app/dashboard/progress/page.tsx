"use client";

// src/app/dashboard/progress/page.tsx
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProgressChart from "@/components/ProgressChart";

interface ProgressEntry {
  id: string;
  date: string;
  metric: string;
  value: number;
  photo_url?: string;
}

export default function ProgressPage() {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProgress() {
      const { data, error } = await supabase
        .from("progress")
        .select("*")
        .order("date", { ascending: true });

      if (error) console.error("Error fetching progress:", error);
      else setEntries(data as ProgressEntry[]);
      setLoading(false);
    }
    fetchProgress();
  }, []);

  // Filter for weight data for the chart
  const weightData = entries
    .filter((e) => e.metric.toLowerCase() === "weight")
    .map((e) => ({ date: e.date, value: e.value }));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Progress Tracking</h1>
      <Link
        href="/dashboard/progress/create"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6 inline-block"
      >
        Add Entry
      </Link>

      {weightData.length > 0 && (
        <div className="mb-8">
          <ProgressChart data={weightData} metricLabel="Weight (kg)" />
        </div>
      )}

      <div className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-semibold mb-4">History</h2>
        {loading ? (
          <p>Loading...</p>
        ) : entries.length === 0 ? (
          <p>No progress entries found.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Date</th>
                <th className="py-2">Metric</th>
                <th className="py-2">Value</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="py-2">{entry.date}</td>
                  <td className="py-2">{entry.metric}</td>
                  <td className="py-2">{entry.value}</td>
                  <td className="py-2">
                    <Link
                      href={`/dashboard/progress/${entry.id}/edit`}
                      className="text-blue-600 hover:underline mr-4"
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
    </div>
  );
}
