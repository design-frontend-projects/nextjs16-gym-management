import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, CheckCircle2, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AttendancePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">
            Track member entry via QR or RFID.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Manual Check-in
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search logs..." className="pl-8" />
        </div>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Check-in Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              {
                name: "John Doe",
                branch: "Downtown Core",
                time: "08:15 AM",
                status: "present",
              },
              {
                name: "Emily Davis",
                branch: "Westside Gym",
                time: "09:30 AM",
                status: "present",
              },
            ].map((log, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{log.name}</TableCell>
                <TableCell>{log.branch}</TableCell>
                <TableCell>{log.time}</TableCell>
                <TableCell>
                  <span className="flex items-center text-sm font-medium text-green-600">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Present
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
