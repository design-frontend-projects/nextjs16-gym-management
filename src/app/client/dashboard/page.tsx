"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/lib/supabase";
import { AnalyticsCards } from "@/components/AnalyticsCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Progress {
  id: string;
  date: string;
  weight: number;
  body_fat_percentage: number;
}

export default function ClientDashboardPage() {
  const { user } = useAuthStore();
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProgress() {
      if (!user) return;
      const { data, error } = await supabase
        .from("progress")
        .select("*")
        .eq("member_id", user.id); // Assuming user.id links to member_id if we have that logic, or we use profiles.id
      // Wait, members table has user_id, progress links to members.id.
      // We need to get member_id first.

      // Let's first look up the member record
      const { data: memberData } = await supabase
        .from("members")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (memberData) {
        const { data: progressData, error: progressError } = await supabase
          .from("progress")
          .select("*")
          .eq("member_id", memberData.id)
          .order("date", { ascending: false })
          .limit(5);

        if (progressData) setProgress(progressData);
      }
      setLoading(false);
    }
    fetchProgress();
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.user_metadata?.first_name}!
        </h1>
        <p className="text-muted-foreground">Here's your fitness overview.</p>
      </div>

      <AnalyticsCards />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Progress</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Weight (kg)</TableHead>
                    <TableHead>Body Fat %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {progress.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        {new Date(p.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{p.weight}</TableCell>
                      <TableCell>{p.body_fat_percentage}%</TableCell>
                    </TableRow>
                  ))}
                  {progress.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        No progress entries found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Body & Training Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Training Level analysis coming soon...
            </p>
            {/* Placeholder for charts or more stats */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
