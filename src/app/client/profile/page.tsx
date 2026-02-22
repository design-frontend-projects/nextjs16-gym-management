import React from "react";
import { UserProfile } from "@clerk/nextjs";

export default function ClientProfilePage() {
  return (
    <div className="flex flex-col gap-6 items-center w-full">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold tracking-tight mb-6">My Profile</h1>
        <div className="w-full bg-background rounded-xl shadow-sm border p-4 sm:p-6 flex justify-center">
          {/* Clerk UserProfile component automatically handles the UI for managing passwords, emails, names, etc. */}
          <UserProfile
            appearance={{
              elements: {
                rootBox: "w-full focus:outline-none",
                cardBox:
                  "w-full max-w-none shadow-none border-0 focus:outline-none",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
