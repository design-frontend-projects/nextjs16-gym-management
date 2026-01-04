import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";

interface Progress {
  date: string;
  weight: number;
}

interface Session {
  status: string;
}

interface ChartsProps {
  progressData?: Progress[] | null;
  sessionsData?: Session[] | null;
}

export const Charts: React.FC<ChartsProps> = ({
  progressData,
  sessionsData,
}) => {
  // Prepare data for weight line chart
  const weightData = (progressData ?? []).map((p) => ({
    date: new Date(p.date).toLocaleDateString(),
    weight: p.weight,
  }));

  // Prepare data for sessions bar chart (count by status)
  const statusCounts: Record<string, number> = {};
  (sessionsData ?? []).forEach((s) => {
    const status = s.status ?? "unknown";
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });
  const sessionsBarData = Object.entries(statusCounts).map(
    ([status, count]) => ({
      status,
      count,
    })
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Weight Progress Line Chart */}
      <div className="bg-white/10 backdrop-blur rounded-xl p-4">
        <h2 className="text-lg font-medium text-white/80 mb-2">
          Weight Progress
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weightData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
            />
            <XAxis dataKey="date" stroke="white" />
            <YAxis stroke="white" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#82ca9d"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Sessions per Status Bar Chart */}
      <div className="bg-white/10 backdrop-blur rounded-xl p-4">
        <h2 className="text-lg font-medium text-white/80 mb-2">
          Sessions by Status
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sessionsBarData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
            />
            <XAxis dataKey="status" stroke="white" />
            <YAxis stroke="white" />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
