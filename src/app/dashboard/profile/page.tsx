// src/app/dashboard/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, getCurrentUser } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
  auth_user_id: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const current = await getCurrentUser();
      if (!current) {
        router.push("/auth/signup");
        return;
      }
      setUser(current);
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("auth_user_id", current.id)
        .single();
      if (error) {
        console.error("Error fetching member:", error);
        setMember(null);
      } else {
        setMember(data as Member);
      }
      setLoading(false);
    };
    fetchData();
  }, [router]);

  if (loading) {
    return <p className="p-6">Loading profile...</p>;
  }

  if (!member) {
    return (
      <div className="p-6">
        <p>No member profile found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Member Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>First Name:</strong> {member.first_name}
          </p>
          <p>
            <strong>Last Name:</strong> {member.last_name}
          </p>
          <p>
            <strong>Email:</strong> {member.email}
          </p>
          <p>
            <strong>Phone:</strong> {member.phone}
          </p>
          <p>
            <strong>Status:</strong> {member.status}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
