import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function BranchesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Branches</h1>
          <p className="text-muted-foreground">
            Manage your gym locations and settings.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Branch
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search branches..." className="pl-8" />
        </div>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Branch Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              {
                name: "Downtown Core",
                address: "123 Main St, New York, NY",
                phone: "(555) 123-4567",
                status: "Active",
              },
              {
                name: "Westside Gym",
                address: "456 West Blvd, New York, NY",
                phone: "(555) 987-6543",
                status: "Active",
              },
            ].map((branch) => (
              <TableRow key={branch.name}>
                <TableCell className="font-medium">{branch.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {branch.address}
                </TableCell>
                <TableCell>{branch.phone}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-500/10 text-green-500">
                    {branch.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm">
                    Settings
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
