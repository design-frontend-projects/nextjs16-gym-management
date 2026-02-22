import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Dumbbell } from "lucide-react";
import { ClientDesktopNav } from "./client-nav";

export function ClientHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 items-center px-4 md:px-8">
        <div className="mr-4 flex">
          <Link
            href="/client/dashboard"
            className="mr-6 flex items-center space-x-2"
          >
            <Dumbbell className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              GymMaster AI
            </span>
          </Link>
          <ClientDesktopNav />
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search or notifications could go here */}
          </div>
          <nav className="flex items-center space-x-2">
            <UserButton afterSignOutUrl="/" />
          </nav>
        </div>
      </div>
    </header>
  );
}
