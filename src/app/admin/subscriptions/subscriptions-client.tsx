"use client";

import React, { useState } from "react";
import type { SubscriptionWithRelations } from "@/actions/subscriptions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  DollarSign,
} from "lucide-react";

function statusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "active":
      return "default";
    case "pending":
      return "secondary";
    case "expired":
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "active":
      return <CheckCircle2 className="h-3.5 w-3.5 mr-1" />;
    case "pending":
      return <Clock className="h-3.5 w-3.5 mr-1" />;
    case "expired":
      return <AlertTriangle className="h-3.5 w-3.5 mr-1" />;
    case "cancelled":
      return <XCircle className="h-3.5 w-3.5 mr-1" />;
    default:
      return null;
  }
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function SubscriptionsClient({
  subscriptions,
}: {
  subscriptions: SubscriptionWithRelations[];
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = subscriptions.filter((sub) => {
    const name = sub.clients?.profiles?.full_name ?? "";
    const email = sub.clients?.profiles?.email ?? "";
    const plan = sub.membership_plans?.name ?? "";
    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      plan.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = subscriptions.filter((s) => s.status === "active").length;
  const pendingCount = subscriptions.filter(
    (s) => s.status === "pending",
  ).length;
  const expiredCount = subscriptions.filter(
    (s) => s.status === "expired" || s.status === "cancelled",
  ).length;
  const totalRevenue = subscriptions.reduce((acc, sub) => {
    const paid = sub.payments
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + p.amount, 0);
    return acc + paid;
  }, 0);

  return (
    <>
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Expired / Cancelled
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiredCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {totalRevenue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search member, plan..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1">
          {["all", "active", "pending", "expired", "cancelled"].map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(s)}
              className="capitalize"
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-background">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <CreditCard className="h-10 w-10 mb-4" />
            <p className="text-lg font-medium">No subscriptions found</p>
            <p className="text-sm">
              {subscriptions.length === 0
                ? "No subscription data in the database yet."
                : "Try adjusting your search or filters."}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Sessions Left</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recent Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((sub) => {
                const latestPayment = sub.payments[0];
                return (
                  <TableRow key={sub.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {sub.clients?.profiles?.full_name ?? "Unknown"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {sub.clients?.profiles?.email ?? "—"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {sub.membership_plans?.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ${sub.membership_plans?.price.toFixed(2)} /{" "}
                          {sub.membership_plans?.duration_days} days
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <span>{formatDate(sub.start_date)}</span>
                        <span className="text-xs text-muted-foreground">
                          to {formatDate(sub.end_date)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {sub.remaining_sessions !== null
                        ? sub.remaining_sessions
                        : "∞"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={statusVariant(sub.status)}
                        className="flex items-center w-fit"
                      >
                        <StatusIcon status={sub.status} />
                        {sub.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {latestPayment ? (
                        <div className="flex flex-col text-sm">
                          <span className="font-medium">
                            ${latestPayment.amount.toFixed(2)}
                          </span>
                          <span className="text-xs text-muted-foreground capitalize">
                            {latestPayment.payment_method} •{" "}
                            {latestPayment.status}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          No payments
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Summary */}
      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {subscriptions.length} subscriptions
      </p>
    </>
  );
}
