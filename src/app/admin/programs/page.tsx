import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function ProgramsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Workout Programs
          </h1>
          <p className="text-muted-foreground">
            Build structured workout programs with assigned exercises.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Program
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search programs..." className="pl-8" />
        </div>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Program Name</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Total Exercises</TableHead>
              <TableHead className="text-right">Manage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              {
                name: "Hypertrophy Push/Pull",
                author: "Mike Johnson",
                level: "advanced",
                count: 24,
              },
              {
                name: "Beginner Full Body",
                author: "GymMaster",
                level: "beginner",
                count: 12,
              },
            ].map((prog) => (
              <TableRow key={prog.name}>
                <TableCell className="font-medium">{prog.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {prog.author}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      prog.level === "beginner"
                        ? "default"
                        : prog.level === "intermediate"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {prog.level}
                  </Badge>
                </TableCell>
                <TableCell>{prog.count}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4 mr-2" /> Builder
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
