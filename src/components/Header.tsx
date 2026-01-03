"use client";

// src/components/Header.tsx
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, signOut, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/login");
  };

  return (
    <header className="bg-gray-800 text-white py-4 px-6 flex items-center justify-between">
      <Link href="/dashboard" className="text-xl font-bold hover:underline">
        Gym Management
      </Link>
      <nav className="flex items-center space-x-4">
        <Link href="/dashboard/members" className="hover:underline">
          Members
        </Link>
        <Link href="/dashboard/coaches" className="hover:underline">
          Coaches
        </Link>
        <Link href="/dashboard/membership-plans" className="hover:underline">
          Plans
        </Link>
        <Link href="/dashboard/sessions" className="hover:underline">
          Sessions
        </Link>
        <Link href="/dashboard/progress" className="hover:underline">
          Progress
        </Link>
        {user && (
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-sm px-3 py-1 rounded"
          >
            Sign Out
          </button>
        )}
      </nav>
    </header>
  );
}
