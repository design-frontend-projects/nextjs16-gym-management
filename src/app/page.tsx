"use client";

import { useAuthStore } from "@/stores/authStore";
import ClientNavbar from "@/components/ClientNavbar";
import AnalyticsCards from "@/components/AnalyticsCards";
import SubscriptionCard from "@/components/SubscriptionCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";

export default function Home() {
  const { user, isLoading } = useAuthStore();

  // Prevent flash of content if needed, but for now simple conditional is fine
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
        <ClientNavbar />
        <main className="container mx-auto p-6 space-y-8">
          {/* Welcome Section */}
          <section>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back,{" "}
              {user.user_metadata?.name || user.email?.split("@")[0]}!
            </h1>
            <p className="text-muted-foreground mt-2">
              Heres whats happening today.
            </p>
          </section>

          {/* Analytics Overview */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Your Activity</h2>
            <AnalyticsCards />
          </section>

          {/* Detailed Content Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Quick Actions / Recent Activity Placeholder */}
              <div className="bg-white dark:bg-zinc-900 rounded-lg border p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">
                  Upcoming Schedule
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">Yoga Flow</p>
                      <p className="text-sm text-muted-foreground">
                        Today · 6:00 PM - 7:00 PM
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">HIIT Blast</p>
                      <p className="text-sm text-muted-foreground">
                        Tomorrow · 7:00 AM - 8:00 AM
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
                <Button variant="link" className="mt-4 p-0 h-auto" asChild>
                  <Link href="/dashboard/sessions">View full schedule</Link>
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Subscription Management */}
              <SubscriptionCard />

              {/* Profile / Details Summary */}
              <div className="bg-white dark:bg-zinc-900 rounded-lg border p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Member Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member Since</span>
                    <span className="font-medium">Jan 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Home Gym</span>
                    <span className="font-medium">Downtown</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="text-green-600 font-bold flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                    </span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-6" asChild>
                  <Link href="/dashboard/settings">Edit Profile</Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Public Landing Page
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 py-4 flex items-center justify-between border-b">
        <Link href="/" className="font-bold text-2xl flex items-center gap-2">
          <span className="text-blue-600">Gym</span>Sys
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/auth/login"
            className="text-sm font-medium hover:underline"
          >
            Log in
          </Link>
          <Button asChild>
            <Link href="/auth/register">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-24 px-6 text-center bg-linear-to-b from-blue-50 to-white dark:from-zinc-900 dark:to-zinc-950">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Manage Your Fitness Journey <br className="hidden md:block" /> Like
            a Pro.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Track your progress, schedule classes, and manage your membership
            all in one place.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/auth/register">
                Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </section>

        <section id="features" className="py-24 px-6 bg-white dark:bg-black">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-16">
              Everything you need to succeed
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Smart Scheduling",
                  desc: "Book classes and PT sessions instantly from your dashboard.",
                },
                {
                  title: "Progress Tracking",
                  desc: "Visualize your gains with intuitive charts and photo logs.",
                },
                {
                  title: "Member Community",
                  desc: "Connect with coaches and other members to stay motivated.",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl border bg-slate-50 dark:bg-zinc-900"
                >
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t">
        &copy; {new Date().getFullYear()} GymSys Management. All rights
        reserved.
      </footer>
    </div>
  );
}
