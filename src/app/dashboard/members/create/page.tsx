"use client";

// src/app/dashboard/members/create/page.tsx
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateMemberPage() {
  const router = useRouter();
  useEffect(() => {
    // Redirect to the unified signup flow
    router.replace("/auth/signup");
  }, [router]);
  return null;
}
