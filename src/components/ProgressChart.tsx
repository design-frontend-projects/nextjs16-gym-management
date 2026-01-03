// src/components/ProgressChart.tsx
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ProgressData {
  date: string;
  value: number;
}

interface ProgressChartProps {
  data: ProgressData[];
  metricLabel: string;
}

export default function ProgressChart({
  data,
  metricLabel,
}: ProgressChartProps) {
  return (
    <div className="w-full h-64 bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2 text-center">
        {metricLabel} Progress
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            activeDot={{ r: 8 }}
            name={metricLabel}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
