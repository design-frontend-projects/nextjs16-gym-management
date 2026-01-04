// src/app/auth/verify/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export default function VerifyPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const verify = async () => {
      // Get current user
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        setStatus("Error fetching user: " + error.message);
        return;
      }
      if (!user) {
        setStatus("No user logged in. Please sign up first.");
        return;
      }
      // Check if email is confirmed
      if (!user.email_confirmed_at) {
        setStatus(
          "Please verify your email. Check your inbox for the verification link."
        );
        return;
      }
      // Retrieve pending member data from localStorage
      const pending =
        typeof window !== "undefined"
          ? localStorage.getItem("pendingMember")
          : null;
      if (!pending) {
        setStatus("No pending member data found. Redirecting to profile.");
        router.push("/dashboard/profile");
        return;
      }
      const memberData = JSON.parse(pending);
      // Insert into members table, linking to auth user id
      const { error: insertError } = await supabase.from("members").insert([
        {
          ...memberData,
          auth_user_id: user.id,
        },
      ]);
      if (insertError) {
        setStatus("Error creating member record: " + insertError.message);
        return;
      }
      // Cleanup
      localStorage.removeItem("pendingMember");
      setStatus("Account verified and member created!");
      // Redirect to profile after short delay
      setTimeout(() => router.push("/dashboard/profile"), 1500);
    };
    verify();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
      <p className="mb-4">{status}</p>
      {status.startsWith("Error") && (
        <Button onClick={() => router.push("/auth/signup")}>
          Go back to Sign Up
        </Button>
      )}
    </div>
  );
}
