"use client";

import React, { useState, useTransition, useCallback } from "react";
import type { TrainerRow } from "@/actions/trainers";
import {
  createTrainer,
  updateTrainer,
  deleteTrainer,
  toggleTrainerStatus,
  deleteSpecializationByName,
} from "@/actions/trainers";
import type {
  CreateTrainerInput,
  UpdateTrainerInput,
} from "@/lib/validations/trainer";
import {
  createTrainerSchema,
  updateTrainerSchema,
} from "@/lib/validations/trainer";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Search,
  Plus,
  UserCheck,
  Edit,
  Trash2,
  ShieldCheck,
  ShieldOff,
  Mail,
  Phone,
  Loader2,
  Award,
  Briefcase,
  Users,
  X,
  Star,
  Check,
  ChevronsUpDown,
  Settings2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ─── Helpers ─────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Multi-Select Specialization Dropdown ────────────────

function SpecializationDropdown({
  selected,
  onChange,
  catalog,
  onAddNew,
  error,
}: {
  selected: string[];
  onChange: (v: string[]) => void;
  catalog: string[];
  onAddNew: (name: string) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);

  const toggle = (name: string) => {
    if (selected.includes(name)) {
      onChange(selected.filter((s) => s !== name));
    } else if (selected.length < 10) {
      onChange([...selected, name]);
    }
  };

  const handleAddNew = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    if (catalog.includes(trimmed) || selected.includes(trimmed)) {
      // Already exists — just select it
      if (!selected.includes(trimmed)) toggle(trimmed);
    } else {
      onAddNew(trimmed);
      onChange([...selected, trimmed]);
    }
    setNewName("");
    setAdding(false);
  };

  return (
    <div className="space-y-2">
      <Label>
        <Award className="inline h-3.5 w-3.5 mr-1" />
        Specializations
      </Label>

      {/* Selected tags */}
      <div className="flex flex-wrap gap-1.5 min-h-[36px]">
        {selected.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1 pr-1">
            {tag}
            <button
              type="button"
              onClick={() => toggle(tag)}
              className="ml-0.5 rounded-full hover:bg-muted p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        {selected.length === 0 && (
          <span className="text-sm text-muted-foreground py-1">
            No specializations selected
          </span>
        )}
      </div>

      {/* Dropdown trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm hover:bg-accent/50 transition-colors"
      >
        <span className="text-muted-foreground">Select specializations...</span>
        <ChevronsUpDown className="h-4 w-4 opacity-50" />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="rounded-md border bg-popover shadow-md max-h-60 overflow-y-auto">
          {catalog.length === 0 && !adding ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No specializations exist yet.
              <br />
              <Button
                type="button"
                variant="link"
                size="sm"
                className="mt-1"
                onClick={() => setAdding(true)}
              >
                <Plus className="h-3 w-3 mr-1" /> Create the first one
              </Button>
            </div>
          ) : (
            <>
              {catalog.map((name) => {
                const isSelected = selected.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggle(name)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
                  >
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded border ${
                        isSelected
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                    {name}
                  </button>
                );
              })}
            </>
          )}

          {/* Add new inline */}
          <div className="border-t p-2">
            {adding ? (
              <div className="flex gap-2">
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="New specialization name"
                  className="h-8 text-sm"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddNew();
                    }
                    if (e.key === "Escape") {
                      setAdding(false);
                      setNewName("");
                    }
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  className="h-8"
                  onClick={handleAddNew}
                  disabled={!newName.trim()}
                >
                  Add
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => {
                    setAdding(false);
                    setNewName("");
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start text-muted-foreground"
                onClick={() => setAdding(true)}
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" /> Add new specialization
              </Button>
            )}
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {selected.length}/10 specializations selected.
      </p>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ─── Manage Specializations Dialog ───────────────────────

function ManageSpecializationsDialog({
  catalog,
  setCatalog,
}: {
  catalog: string[];
  setCatalog: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [isPending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleAdd = () => {
    const trimmed = newName.trim();
    if (!trimmed || catalog.includes(trimmed)) return;
    setCatalog((prev) => [...prev, trimmed].sort());
    setNewName("");
  };

  const handleDelete = (name: string) => {
    setDeleteTarget(name);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      try {
        await deleteSpecializationByName(deleteTarget);
        setCatalog((prev) => prev.filter((n) => n !== deleteTarget));
        setDeleteTarget(null);
      } catch (err) {
        alert(
          err instanceof Error
            ? err.message
            : "Failed to delete specialization",
        );
      }
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings2 className="mr-2 h-4 w-4" />
            Manage Specializations
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Specializations Catalog</DialogTitle>
            <DialogDescription>
              Add or remove specialization options available when creating
              trainers. Removing a specialization deletes it from all trainers.
            </DialogDescription>
          </DialogHeader>

          {/* Add new */}
          <div className="flex gap-2 mt-2">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Strength Training"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdd();
                }
              }}
            />
            <Button
              onClick={handleAdd}
              disabled={!newName.trim() || catalog.includes(newName.trim())}
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>

          {/* List */}
          <div className="space-y-1 mt-4">
            {catalog.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No specializations yet. Add your first one above.
              </p>
            ) : (
              catalog.map((name) => (
                <div
                  key={name}
                  className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary/60" />
                    <span className="text-sm">{name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleDelete(name)}
                    disabled={isPending}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Specialization</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove <strong>&quot;{deleteTarget}&quot;</strong> from{" "}
              <strong>all trainers</strong> who have it. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ─── Main Component ──────────────────────────────────────

export function TrainersClient({
  trainers,
  availableSpecializations,
}: {
  trainers: TrainerRow[];
  availableSpecializations: string[];
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerRow | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Specialization catalog (local state, seeded from server)
  const [catalog, setCatalog] = useState<string[]>(availableSpecializations);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    bio: "",
    experienceYears: "",
    specializations: [] as string[],
  });

  const resetForm = () => {
    setFormData({
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      bio: "",
      experienceYears: "",
      specializations: [],
    });
    setErrors({});
  };

  const handleAddNewSpec = useCallback(
    (name: string) => {
      if (!catalog.includes(name)) {
        setCatalog((prev) => [...prev, name].sort());
      }
    },
    [catalog],
  );

  // Stats
  const totalTrainers = trainers.length;
  const activeTrainers = trainers.filter((t) => t.isActive).length;
  const totalClients = trainers.reduce((acc, t) => acc + t.activeClients, 0);
  const totalSpecs = new Set(trainers.flatMap((t) => t.specializations)).size;

  // Filtering
  const filtered = trainers.filter((t) => {
    const matchesSearch =
      t.fullName.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.specializations.some((s) =>
        s.toLowerCase().includes(search.toLowerCase()),
      );
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && t.isActive) ||
      (statusFilter === "inactive" && !t.isActive);
    return matchesSearch && matchesStatus;
  });

  // ─── CRUD Handlers ────────────────────────────────────

  const handleCreate = () => {
    const input: CreateTrainerInput = {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      bio: formData.bio,
      experienceYears: formData.experienceYears
        ? Number(formData.experienceYears)
        : undefined,
      specializations: formData.specializations,
    };

    const result = createTrainerSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0]?.toString() ?? "form";
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    startTransition(async () => {
      try {
        await createTrainer(result.data);
        resetForm();
        setAddOpen(false);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to create trainer");
      }
    });
  };

  const handleUpdate = () => {
    if (!selectedTrainer) return;

    const input: UpdateTrainerInput = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      bio: formData.bio,
      experienceYears: formData.experienceYears
        ? Number(formData.experienceYears)
        : undefined,
      specializations: formData.specializations,
    };

    const result = updateTrainerSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0]?.toString() ?? "form";
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    startTransition(async () => {
      try {
        await updateTrainer(selectedTrainer.id, result.data);
        setEditOpen(false);
        setSelectedTrainer(null);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to update trainer");
      }
    });
  };

  const handleToggleStatus = (trainer: TrainerRow) => {
    startTransition(async () => {
      try {
        await toggleTrainerStatus(trainer.id);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to toggle status");
      }
    });
  };

  const handleDelete = () => {
    if (!selectedTrainer) return;
    startTransition(async () => {
      try {
        await deleteTrainer(selectedTrainer.id);
        setDeleteOpen(false);
        setSelectedTrainer(null);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to delete trainer");
      }
    });
  };

  const openEdit = (trainer: TrainerRow) => {
    const parts = trainer.fullName.split(" ");
    setFormData({
      email: trainer.email,
      firstName: parts[0] || "",
      lastName: parts.slice(1).join(" ") || "",
      phone: trainer.phone || "",
      bio: trainer.bio || "",
      experienceYears: trainer.experienceYears?.toString() || "",
      specializations: [...trainer.specializations],
    });
    setErrors({});
    setSelectedTrainer(trainer);
    setEditOpen(true);
  };

  const openDelete = (trainer: TrainerRow) => {
    setSelectedTrainer(trainer);
    setDeleteOpen(true);
  };

  // ─── Shared Form Fields ───────────────────────────────

  const renderFormFields = (mode: "create" | "edit") => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) =>
              setFormData((d) => ({ ...d, firstName: e.target.value }))
            }
            placeholder="Mike"
          />
          {errors.firstName && (
            <p className="text-xs text-destructive">{errors.firstName}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) =>
              setFormData((d) => ({ ...d, lastName: e.target.value }))
            }
            placeholder="Johnson"
          />
          {errors.lastName && (
            <p className="text-xs text-destructive">{errors.lastName}</p>
          )}
        </div>
      </div>
      {mode === "create" && (
        <div className="space-y-2">
          <Label htmlFor="email">
            <Mail className="inline h-3.5 w-3.5 mr-1" />
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((d) => ({ ...d, email: e.target.value }))
            }
            placeholder="mike@gym.com"
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>
      )}
      {mode === "edit" && (
        <div className="space-y-2">
          <Label>Email</Label>
          <Input value={formData.email} disabled className="bg-muted" />
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">
            <Phone className="inline h-3.5 w-3.5 mr-1" />
            Phone
          </Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData((d) => ({ ...d, phone: e.target.value }))
            }
            placeholder="+1 234 567 890"
          />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="exp">
            <Briefcase className="inline h-3.5 w-3.5 mr-1" />
            Experience (years)
          </Label>
          <Input
            id="exp"
            type="number"
            min={0}
            max={50}
            value={formData.experienceYears}
            onChange={(e) =>
              setFormData((d) => ({
                ...d,
                experienceYears: e.target.value,
              }))
            }
            placeholder="5"
          />
          {errors.experienceYears && (
            <p className="text-xs text-destructive">{errors.experienceYears}</p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData((d) => ({ ...d, bio: e.target.value }))}
          placeholder="Certified personal trainer specializing in..."
          rows={3}
        />
        {errors.bio && <p className="text-xs text-destructive">{errors.bio}</p>}
      </div>

      {/* Specializations Dropdown */}
      <SpecializationDropdown
        selected={formData.specializations}
        onChange={(v) => setFormData((d) => ({ ...d, specializations: v }))}
        catalog={catalog}
        onAddNew={handleAddNewSpec}
        error={errors.specializations}
      />
    </div>
  );

  // ─── Render ───────────────────────────────────────────

  return (
    <>
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Trainers
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTrainers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <ShieldCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTrainers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Clients
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Unique Specializations
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSpecs}</div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name, email, or skill..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-1">
            {["all", "active", "inactive"].map((s) => (
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

        <div className="flex items-center gap-2">
          {/* Manage Specializations */}
          <ManageSpecializationsDialog
            catalog={catalog}
            setCatalog={setCatalog}
          />

          {/* Add Trainer Dialog */}
          <Dialog
            open={addOpen}
            onOpenChange={(open) => {
              setAddOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Trainer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Trainer</DialogTitle>
                <DialogDescription>
                  Create a trainer profile. A Clerk account will be created
                  automatically with the &quot;trainer&quot; role.
                </DialogDescription>
              </DialogHeader>
              {renderFormFields("create")}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setAddOpen(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={isPending}>
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  Create Trainer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-background">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <UserCheck className="h-10 w-10 mb-4" />
            <p className="text-lg font-medium">No trainers found</p>
            <p className="text-sm">
              {totalTrainers === 0
                ? "Add your first trainer to get started."
                : "Try adjusting your search or filters."}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trainer</TableHead>
                <TableHead>Specializations</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Clients</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((trainer) => (
                <TableRow key={trainer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={trainer.avatarUrl ?? undefined}
                          alt={trainer.fullName}
                        />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                          {getInitials(trainer.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{trainer.fullName}</span>
                        <span className="text-xs text-muted-foreground">
                          {trainer.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-1 flex-wrap max-w-[220px]">
                      {trainer.specializations.length > 0 ? (
                        trainer.specializations.map((s) => (
                          <Badge
                            key={s}
                            variant="secondary"
                            className="text-xs"
                          >
                            {s}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          None
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    {trainer.experienceYears != null ? (
                      <span className="text-sm">
                        {trainer.experienceYears}{" "}
                        {trainer.experienceYears === 1 ? "year" : "years"}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {trainer.activeClients}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={trainer.isActive ? "default" : "destructive"}
                      className="flex items-center w-fit gap-1"
                    >
                      {trainer.isActive ? (
                        <ShieldCheck className="h-3 w-3" />
                      ) : (
                        <ShieldOff className="h-3 w-3" />
                      )}
                      {trainer.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        title={trainer.isActive ? "Deactivate" : "Activate"}
                        onClick={() => handleToggleStatus(trainer)}
                        disabled={isPending}
                      >
                        {trainer.isActive ? (
                          <ShieldOff className="h-4 w-4 text-yellow-600" />
                        ) : (
                          <ShieldCheck className="h-4 w-4 text-green-600" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Edit"
                        onClick={() => openEdit(trainer)}
                        disabled={isPending}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete"
                        onClick={() => openDelete(trainer)}
                        disabled={isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {totalTrainers} trainers
      </p>

      {/* Edit Dialog */}
      <Dialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) {
            setSelectedTrainer(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Trainer</DialogTitle>
            <DialogDescription>
              Update trainer profile, specializations, and experience.
            </DialogDescription>
          </DialogHeader>
          {renderFormFields("edit")}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Edit className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Trainer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently remove{" "}
              <strong>{selectedTrainer?.fullName}</strong> (
              {selectedTrainer?.email})? This will delete their Clerk account,
              all specializations, and client assignments. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
