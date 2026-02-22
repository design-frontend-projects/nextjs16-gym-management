import React from "react";
import { ClientHeader } from "@/components/layout/client-header";
import { ClientNav } from "@/components/layout/client-nav";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <ClientHeader />
      <main className="flex-1 pb-16 md:pb-0">
        <div className="container p-4 md:p-8">{children}</div>
      </main>
      <ClientNav />
    </div>
  );
}
