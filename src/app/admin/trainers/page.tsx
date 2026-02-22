import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
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

export default function TrainersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trainers</h1>
          <p className="text-muted-foreground">
            Manage gym trainers and their client assignments.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Trainer
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search trainers..." className="pl-8" />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trainer</TableHead>
              <TableHead>Specializations</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Active Clients</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              {
                name: "Mike Johnson",
                email: "mike.j@example.com",
                spec: "Weightlifting, HIIT",
                exp: "5 years",
                clients: 12,
              },
              {
                name: "Sarah Connor",
                email: "sarah.c@example.com",
                spec: "Yoga, Mobility",
                exp: "3 years",
                clients: 8,
              },
            ].map((trainer) => (
              <TableRow key={trainer.email}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{trainer.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {trainer.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {trainer.spec.split(",").map((s) => (
                      <Badge variant="secondary" key={s} className="text-xs">
                        {s.trim()}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{trainer.exp}</TableCell>
                <TableCell>{trainer.clients}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Manage
                  </Button>
                  <Button variant="ghost" size="sm">
                    Assign Client
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
