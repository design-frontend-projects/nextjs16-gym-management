import Link from "next/link";
import {
  Home,
  Users,
  CreditCard,
  Activity,
  Calendar,
  Settings,
  Dumbbell,
  UserCheck,
  Building,
  ClipboardList,
} from "lucide-react";

export function AdminSidebar({ isMobile = false }: { isMobile?: boolean }) {
  const content = (
    <>
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <Dumbbell className="h-6 w-6" />
          <span className="">GymMaster AI</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/admin/members"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <Users className="h-4 w-4" />
            Members
          </Link>
          <Link
            href="/admin/subscriptions"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <CreditCard className="h-4 w-4" />
            Subscriptions & Billing
          </Link>
          <Link
            href="/admin/analytics"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <Activity className="h-4 w-4" />
            AI Body Analytics
          </Link>
          <Link
            href="/admin/trainers"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <UserCheck className="h-4 w-4" />
            Trainers
          </Link>
          <Link
            href="/admin/exercises"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <Dumbbell className="h-4 w-4" />
            Exercises
          </Link>
          <Link
            href="/admin/programs"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <ClipboardList className="h-4 w-4" />
            Programs
          </Link>
          <Link
            href="/admin/attendance"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <Calendar className="h-4 w-4" />
            Attendance
          </Link>
          <Link
            href="/admin/branches"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <Building className="h-4 w-4" />
            Branches
          </Link>
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </>
  );

  if (isMobile) {
    return content;
  }

  return (
    <div className="hidden border-r bg-muted/40 md:block md:w-[220px] lg:w-[280px]">
      <div className="flex h-full max-h-screen flex-col gap-2">{content}</div>
    </div>
  );
}
