import Link from "next/link";
import { Dumbbell, Activity, User, Home, Sparkles } from "lucide-react";

export function ClientNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 w-full items-center justify-around border-t bg-background px-2 pb-safe md:hidden">
      <Link
        href="/client/dashboard"
        className="flex flex-col items-center justify-center space-y-1 text-muted-foreground hover:text-primary"
      >
        <Home className="h-5 w-5" />
        <span className="text-[10px] font-medium">Home</span>
      </Link>
      <Link
        href="/client/workout"
        className="flex flex-col items-center justify-center space-y-1 text-muted-foreground hover:text-primary"
      >
        <Dumbbell className="h-5 w-5" />
        <span className="text-[10px] font-medium">Workout</span>
      </Link>
      <Link
        href="/client/progress"
        className="flex flex-col items-center justify-center space-y-1 text-muted-foreground hover:text-primary"
      >
        <Activity className="h-5 w-5" />
        <span className="text-[10px] font-medium">Progress</span>
      </Link>
      <Link
        href="/client/ai-coach"
        className="flex flex-col items-center justify-center space-y-1 text-muted-foreground hover:text-primary"
      >
        <Sparkles className="h-5 w-5 text-primary" />
        <span className="text-[10px] font-medium text-primary">AI Coach</span>
      </Link>
      <Link
        href="/client/profile"
        className="flex flex-col items-center justify-center space-y-1 text-muted-foreground hover:text-primary"
      >
        <User className="h-5 w-5" />
        <span className="text-[10px] font-medium">Profile</span>
      </Link>
    </nav>
  );
}

export function ClientDesktopNav() {
  return (
    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
      <Link
        href="/client/dashboard"
        className="transition-colors hover:text-foreground/80 text-foreground/60"
      >
        Home
      </Link>
      <Link
        href="/client/workout"
        className="transition-colors hover:text-foreground/80 text-foreground/60"
      >
        Workout
      </Link>
      <Link
        href="/client/progress"
        className="transition-colors hover:text-foreground/80 text-foreground/60"
      >
        Progress
      </Link>
      <Link
        href="/client/ai-coach"
        className="transition-colors hover:text-foreground/80 text-primary flex items-center gap-1"
      >
        <Sparkles className="h-4 w-4" /> AI Coach
      </Link>
    </nav>
  );
}
