import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Activity, CalendarDays, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ClientDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Hello, Athlete!</h1>
        <p className="text-muted-foreground">
          Ready to crush your goals today?
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2 border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-primary" />
              Today's Workout
            </CardTitle>
            <CardDescription>Upper Body Power - Week 3</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">4 exercises • 45 mins • Advanced</p>
            <Button className="w-full sm:w-auto">Start Workout</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">Pro Plan</div>
            <p className="text-sm text-muted-foreground mt-1">
              Expires in 12 days
            </p>
            <Button variant="link" className="px-0 mt-2 h-auto">
              Manage <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              AI Body Analysis
            </CardTitle>
            <CardDescription>Last scan: 2 days ago</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 mb-4">
              <div className="text-3xl font-black">18.5%</div>
              <div className="text-sm text-muted-foreground mb-1">Body Fat</div>
            </div>
            <p className="text-sm text-green-500 font-medium">
              ↓ 1.2% since last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Next Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Trainer"
                    alt="Trainer"
                    className="w-10 h-10 object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-sm">Personal Training</p>
                  <p className="text-xs text-muted-foreground">
                    with Coach Mike
                  </p>
                  <p className="text-xs font-medium mt-1">Tomorrow, 10:00 AM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
