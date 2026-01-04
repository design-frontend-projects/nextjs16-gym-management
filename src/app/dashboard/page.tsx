import React from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/dashboard/Card";
import { Charts } from "@/components/dashboard/Charts";

// Types for Supabase tables (simplified)
interface Member {
  id: string;
  status: string;
  created_at: string;
}

interface Session {
  id: string;
  start_time: string;
  status: string;
}

interface Progress {
  id: string;
  member_id: string;
  date: string;
  weight: number;
}

async function getDashboardData() {
  // Fetch members
  const { data: membersData } = await supabase
    .from("members")
    .select("id,status,created_at");
  // Fetch upcoming sessions
  const { data: sessionsData } = await supabase
    .from("sessions")
    .select("id,start_time,status");
  // Fetch progress entries
  const { data: progressData } = await supabase
    .from("progress")
    .select("id,member_id,date,weight");

  const totalMembers = membersData?.length ?? 0;
  const activeMembers =
    membersData?.filter((m) => m.status === "active").length ?? 0;
  const upcomingSessions =
    sessionsData?.filter((s) => new Date(s.start_time) > new Date()).length ??
    0;

  // Compute average weight per member (latest entry)
  const latestWeightByMember: Record<string, number> = {};
  progressData?.forEach((p) => {
    if (
      !latestWeightByMember[p.member_id] ||
      new Date(p.date) > new Date(p.date)
    ) {
      latestWeightByMember[p.member_id] = p.weight;
    }
  });
  const averageWeight =
    Object.values(latestWeightByMember).reduce((sum, w) => sum + w, 0) /
    (Object.values(latestWeightByMember).length || 1);

  return {
    totalMembers,
    activeMembers,
    upcomingSessions,
    averageWeight,
    progressData,
    sessionsData,
  };
}

export default async function AdminDashboard() {
  const {
    totalMembers,
    activeMembers,
    upcomingSessions,
    averageWeight,
    progressData,
    sessionsData,
  } = await getDashboardData();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-700">
        Gym Management Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Total Members" value={totalMembers} />
        <Card title="Active Members" value={activeMembers} />
        <Card title="Upcoming Sessions" value={upcomingSessions} />
        <Card title="Avg. Weight (kg)" value={averageWeight.toFixed(1)} />
      </div>
      <Charts progressData={progressData} sessionsData={sessionsData} />
    </div>
  );
}
