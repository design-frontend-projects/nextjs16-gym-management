import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Calendar, Trophy, TrendingUp } from "lucide-react";

export default function AnalyticsCards() {
  // Mock data for now - will be replaced with real data fetch
  const stats = [
    {
      title: "Total Sessions",
      value: "12",
      description: "Completed this month",
      icon: Activity,
    },
    {
      title: "Attendance Streak",
      value: "5 Days",
      description: "Keep it up!",
      icon: TrendingUp,
    },
    {
      title: "Next Session",
      value: "Today, 6 PM",
      description: "Yoga Flow",
      icon: Calendar,
    },
    {
      title: "Weight Goal",
      value: "-2 kg",
      description: "Progress this month",
      icon: Trophy,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
