"use client";

import { useAuthStore } from "@/stores/authStore";
import ClientNavbar from "@/components/ClientNavbar";
import AnalyticsCards from "@/components/AnalyticsCards";
import SubscriptionCard from "@/components/SubscriptionCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, isLoading } = useAuthStore();

  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      if (role === "member") {
        router.push("/client/dashboard");
      } else {
        router.push("/dashboard");
      }
    }
  }, [user, isLoading, role, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Redirecting to your dashboard...</p>
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
