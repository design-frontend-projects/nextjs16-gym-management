import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dumbbell, Activity, CalendarCheck } from "lucide-react";

export default function MarketingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-24 md:py-32 lg:py-40 xl:py-48 bg-linear-to-b from-background to-muted/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Supercharge your gym with{" "}
                <span className="text-primary">AI body analytics</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-2xl/relaxed">
                A premium management SaaS for gym owners, trainers, and clients.
                Track progress, manage subscriptions, and unlock AI-driven
                insights for fitness journeys.
              </p>
            </div>
            <div className="space-x-4 pt-4">
              <Link href="/sign-up">
                <Button size="lg" className="h-12 px-8">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline" className="h-12 px-8">
                  Admin Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Everything you need to scale
              </h2>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 rounded-xl border p-6 shadow-sm">
              <div className="p-3 bg-primary/10 rounded-full">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">AI Body Analytics</h3>
              <p className="text-center text-muted-foreground">
                Track muscle growth and fat loss with intelligent prediction
                models and image analysis.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-xl border p-6 shadow-sm">
              <div className="p-3 bg-primary/10 rounded-full">
                <CalendarCheck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Smart Attendance</h3>
              <p className="text-center text-muted-foreground">
                Seamless check-ins with QR codes and detailed attendance
                tracking for all members.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-xl border p-6 shadow-sm">
              <div className="p-3 bg-primary/10 rounded-full">
                <Dumbbell className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Workout Plans</h3>
              <p className="text-center text-muted-foreground">
                Assign customized workout programs with embedded video
                instructions to your clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="pricing"
        className="w-full py-12 md:py-24 lg:py-32 bg-muted/40"
      >
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Simple, transparent pricing
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-8 w-full">
              <div className="flex flex-col rounded-xl border bg-background p-8 shadow-sm">
                <h3 className="text-2xl font-bold">Basic</h3>
                <div className="mt-4 flex items-baseline text-5xl font-extrabold justify-center">
                  $49
                  <span className="text-xl font-medium text-muted-foreground ml-1">
                    /mo
                  </span>
                </div>
                <ul className="mt-8 space-y-3 text-sm text-left">
                  <li className="flex items-center">
                    <Dumbbell className="w-4 h-4 mr-2 text-primary" /> Up to 100
                    Members
                  </li>
                  <li className="flex items-center">
                    <Dumbbell className="w-4 h-4 mr-2 text-primary" /> Basic
                    Attendance
                  </li>
                  <li className="flex items-center">
                    <Dumbbell className="w-4 h-4 mr-2 text-primary" /> Billing
                    Management
                  </li>
                </ul>
                <Button className="mt-8" variant="outline">
                  Choose Basic
                </Button>
              </div>
              <div className="flex flex-col rounded-xl border border-primary bg-primary/5 p-8 shadow-sm relative">
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Popular
                  </span>
                </div>
                <h3 className="text-2xl font-bold">Pro (AI Powered)</h3>
                <div className="mt-4 flex items-baseline text-5xl font-extrabold justify-center">
                  $149
                  <span className="text-xl font-medium text-muted-foreground ml-1">
                    /mo
                  </span>
                </div>
                <ul className="mt-8 space-y-3 text-sm text-left">
                  <li className="flex items-center">
                    <Dumbbell className="w-4 h-4 mr-2 text-primary" /> Unlimited
                    Members
                  </li>
                  <li className="flex items-center">
                    <Dumbbell className="w-4 h-4 mr-2 text-primary" /> AI Body
                    Analytics
                  </li>
                  <li className="flex items-center">
                    <Dumbbell className="w-4 h-4 mr-2 text-primary" /> Custom
                    Workout Plans
                  </li>
                </ul>
                <Button className="mt-8">Choose Pro</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
