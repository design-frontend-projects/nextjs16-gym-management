import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminMembersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Members</h1>
          <p className="text-muted-foreground">
            Manage your gym members and their subscriptions.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Member
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search members..." className="pl-8" />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              {
                name: "John Doe",
                email: "john@example.com",
                status: "Active",
                plan: "Pro Plan",
                joined: "Jan 12, 2024",
              },
              {
                name: "Sarah Smith",
                email: "sarah@example.com",
                status: "Expiring",
                plan: "Basic Plan",
                joined: "Mar 5, 2024",
              },
              {
                name: "Michael Johnson",
                email: "mike@example.com",
                status: "Active",
                plan: "Pro Plan",
                joined: "Feb 20, 2024",
              },
              {
                name: "Emily Davis",
                email: "emily@example.com",
                status: "Inactive",
                plan: "None",
                joined: "Nov 30, 2023",
              },
            ].map((member) => (
              <TableRow key={member.email}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{member.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {member.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      member.status === "Active"
                        ? "default"
                        : member.status === "Expiring"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {member.status}
                  </Badge>
                </TableCell>
                <TableCell>{member.plan}</TableCell>
                <TableCell>{member.joined}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
