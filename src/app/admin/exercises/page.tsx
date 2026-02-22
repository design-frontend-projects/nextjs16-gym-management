import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, Video } from "lucide-react";
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

export default function ExercisesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Exercise Library
          </h1>
          <p className="text-muted-foreground">
            Manage your exercise database, videos, and instructions.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Exercise
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search exercises..." className="pl-8" />
        </div>
        <Button variant="outline">Category</Button>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Video</TableHead>
              <TableHead>Exercise Name</TableHead>
              <TableHead>Muscle Group</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              {
                name: "Barbell Bench Press",
                group: "Chest",
                level: "intermediate",
                has_video: true,
              },
              {
                name: "Dumbbell Deadlift",
                group: "Legs",
                level: "advanced",
                has_video: false,
              },
              {
                name: "Push Ups",
                group: "Chest",
                level: "beginner",
                has_video: true,
              },
            ].map((ex) => (
              <TableRow key={ex.name}>
                <TableCell>
                  <div className="w-12 h-8 bg-muted rounded flex items-center justify-center text-muted-foreground">
                    {ex.has_video ? (
                      <Video className="h-4 w-4" />
                    ) : (
                      <span className="text-xs">none</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{ex.name}</TableCell>
                <TableCell>{ex.group}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      ex.level === "beginner"
                        ? "default"
                        : ex.level === "intermediate"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {ex.level}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Edit
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
