"use client";

// src/components/Sidebar.tsx
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const { user, signOut, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/login");
  };

  return (
    <aside className="w-64 bg-gray-100 h-screen p-4 flex flex-col justify-between">
      <nav className="space-y-2">
        <Link
          href="/dashboard"
          className="block py-2 px-3 rounded hover:bg-gray-200"
        >
          Dashboard
        </Link>
        <Link
          href="/dashboard/members"
          className="block py-2 px-3 rounded hover:bg-gray-200"
        >
          Members
        </Link>
        <Link
          href="/dashboard/coaches"
          className="block py-2 px-3 rounded hover:bg-gray-200"
        >
          Coaches
        </Link>
        <Link
          href="/dashboard/membership-plans"
          className="block py-2 px-3 rounded hover:bg-gray-200"
        >
          Plans
        </Link>
        <Link
          href="/dashboard/sessions"
          className="block py-2 px-3 rounded hover:bg-gray-200"
        >
          Sessions
        </Link>
        <Link
          href="/dashboard/progress"
          className="block py-2 px-3 rounded hover:bg-gray-200"
        >
          Progress
        </Link>
      </nav>
      {user && (
        <button
          onClick={handleSignOut}
          disabled={isLoading}
          className="mt-4 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Sign Out
        </button>
      )}
    </aside>
  );
}
