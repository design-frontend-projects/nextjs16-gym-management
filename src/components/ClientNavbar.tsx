"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  User,
  Dumbbell,
  Calendar,
  LogOut,
  Settings,
  LayoutDashboard,
} from "lucide-react";

export default function ClientNavbar() {
  const { user, signOut } = useAuthStore();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/login");
  };

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Sessions", href: "/dashboard/sessions", icon: Calendar },
    { name: "Progress", href: "/dashboard/progress", icon: Dumbbell },
  ];

  const userInitials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : "U";

  return (
    <nav className="border-b bg-white dark:bg-black px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-xl font-bold flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-blue-600" />
          <span>GymSys</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium hover:text-blue-600 transition-colors flex items-center gap-2"
            >
              <link.icon className="h-4 w-4" />
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
                <AvatarImage src="" />
                <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/settings")}
              >
                <User className="mr-2 h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/settings")}
              >
                <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/auth/login">
              <span className="text-sm font-medium hover:underline">
                Log in
              </span>
            </Link>
            <Link href="/auth/register">
              <span className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                Get Started
              </span>
            </Link>
          </div>
        )}

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium flex items-center gap-2 py-2 border-b"
                  >
                    <link.icon className="h-5 w-5" />
                    {link.name}
                  </Link>
                ))}
                {!user && (
                  <div className="flex flex-col gap-2 mt-4">
                    <Link
                      href="/auth/login"
                      className="w-full text-center py-2 border rounded-md"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/auth/register"
                      className="w-full text-center py-2 bg-blue-600 text-white rounded-md"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
