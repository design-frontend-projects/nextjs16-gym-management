"use client";

import React, { useState, useTransition, useCallback } from "react";
import type { ExerciseRow, CategoryRow } from "@/actions/exercises";
import {
  createExercise,
  updateExercise,
  deleteExercise,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/actions/exercises";
import {
  createExerciseSchema,
  createCategorySchema,
  difficultyValues,
  type Difficulty,
} from "@/lib/validations/exercise";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Loader2,
  Dumbbell,
  Video,
  FolderOpen,
  ListFilter,
  Settings2,
  Zap,
  Target,
  X,
} from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────

function difficultyColor(d: string) {
  switch (d) {
    case "beginner":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "intermediate":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "advanced":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "";
  }
}

// ─── Category Quick-Add Dialog ───────────────────────────

function QuickAddCategoryDialog({
  onCreated,
}: {
  onCreated: (cat: { id: string; name: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    const result = createCategorySchema.safeParse({ name });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid");
      return;
    }
    setError("");
    startTransition(async () => {
      try {
        const res = await createCategory(result.data);
        if (res.id && res.name) {
          onCreated({ id: res.id, name: res.name });
        }
        setName("");
        setOpen(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed");
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) {
          setName("");
          setError("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0"
          title="Add new category"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>New Category</DialogTitle>
          <DialogDescription>
            Create a new exercise category. It will be immediately available in
            the dropdown.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-2">
            <Label htmlFor="catName">Category Name</Label>
            <Input
              id="catName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cardio, Strength, Flexibility..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              autoFocus
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || !name.trim()}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Manage Categories Dialog ────────────────────────────

function ManageCategoriesDialog({
  categories,
  setCategories,
}: {
  categories: CategoryRow[];
  setCategories: React.Dispatch<React.SetStateAction<CategoryRow[]>>;
}) {
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<CategoryRow | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleAdd = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const result = createCategorySchema.safeParse({ name: trimmed });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid");
      return;
    }
    setError("");
    startTransition(async () => {
      try {
        const res = await createCategory(result.data);
        if (res.id && res.name) {
          setCategories((prev) =>
            [...prev, { id: res.id, name: res.name, exerciseCount: 0 }].sort(
              (a, b) => a.name.localeCompare(b.name),
            ),
          );
        }
        setNewName("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed");
      }
    });
  };

  const handleUpdate = (id: string) => {
    const result = createCategorySchema.safeParse({ name: editName.trim() });
    if (!result.success) return;
    startTransition(async () => {
      try {
        await updateCategory(id, result.data);
        setCategories((prev) =>
          prev
            .map((c) => (c.id === id ? { ...c, name: editName.trim() } : c))
            .sort((a, b) => a.name.localeCompare(b.name)),
        );
        setEditingId(null);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed");
      }
    });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      try {
        await deleteCategory(deleteTarget.id);
        setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        setDeleteTarget(null);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed");
      }
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings2 className="mr-2 h-4 w-4" /> Manage Categories
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Exercise Categories</DialogTitle>
            <DialogDescription>
              Add, rename, or remove exercise categories. Deleting a category
              unlinks its exercises (they become uncategorized).
            </DialogDescription>
          </DialogHeader>

          {/* Add */}
          <div className="flex gap-2 mt-2">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New category name..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdd();
                }
              }}
            />
            <Button onClick={handleAdd} disabled={isPending || !newName.trim()}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
          {error && <p className="text-xs text-destructive mt-1">{error}</p>}

          {/* List */}
          <div className="space-y-1 mt-4">
            {categories.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No categories yet. Create your first one above.
              </p>
            ) : (
              categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-muted/50 transition-colors group"
                >
                  {editingId === cat.id ? (
                    <div className="flex gap-2 flex-1 mr-2">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="h-8"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleUpdate(cat.id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                      />
                      <Button
                        size="sm"
                        className="h-8"
                        onClick={() => handleUpdate(cat.id)}
                        disabled={isPending}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <FolderOpen className="h-4 w-4 text-primary/60" />
                        <span className="text-sm">{cat.name}</span>
                        <Badge variant="outline" className="text-xs ml-1">
                          {cat.exerciseCount}
                        </Badge>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => {
                            setEditingId(cat.id);
                            setEditName(cat.name);
                          }}
                          disabled={isPending}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setDeleteTarget(cat)}
                          disabled={isPending}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Remove <strong>&quot;{deleteTarget?.name}&quot;</strong>? Its{" "}
              <strong>{deleteTarget?.exerciseCount} exercises</strong> will
              become uncategorized.
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

export function ExercisesClient({
  exercises,
  categories: initialCategories,
}: {
  exercises: ExerciseRow[];
  categories: CategoryRow[];
}) {
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseRow | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] =
    useState<CategoryRow[]>(initialCategories);

  const emptyForm = {
    name: "",
    categoryId: "",
    muscleGroup: "",
    difficulty: "beginner" as Difficulty,
    videoUrl: "",
    thumbnailUrl: "",
    description: "",
  };
  const [formData, setFormData] = useState(emptyForm);

  const resetForm = () => {
    setFormData(emptyForm);
    setErrors({});
  };

  // Stats
  const totalExercises = exercises.length;
  const totalCategories = categories.length;
  const withVideo = exercises.filter((e) => e.videoUrl).length;
  const uniqueMuscles = new Set(
    exercises.map((e) => e.muscleGroup).filter(Boolean),
  ).size;

  // Filtering
  const filtered = exercises.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      (e.muscleGroup?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (e.categoryName?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchesDifficulty =
      difficultyFilter === "all" || e.difficulty === difficultyFilter;
    const matchesCategory =
      categoryFilter === "all" ||
      (categoryFilter === "uncategorized"
        ? !e.categoryId
        : e.categoryId === categoryFilter);
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const handleAddNewCategory = useCallback(
    (cat: { id: string; name: string }) => {
      setCategories((prev) =>
        [...prev, { ...cat, exerciseCount: 0 }].sort((a, b) =>
          a.name.localeCompare(b.name),
        ),
      );
      setFormData((d) => ({ ...d, categoryId: cat.id }));
    },
    [],
  );

  // CRUD handlers
  const handleCreate = () => {
    const result = createExerciseSchema.safeParse(formData);
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
        await createExercise(result.data);
        resetForm();
        setAddOpen(false);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to create exercise");
      }
    });
  };

  const handleUpdate = () => {
    if (!selectedExercise) return;
    const result = createExerciseSchema.safeParse(formData);
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
        await updateExercise(selectedExercise.id, result.data);
        setEditOpen(false);
        setSelectedExercise(null);
        resetForm();
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to update exercise");
      }
    });
  };

  const handleDelete = () => {
    if (!selectedExercise) return;
    startTransition(async () => {
      try {
        await deleteExercise(selectedExercise.id);
        setDeleteOpen(false);
        setSelectedExercise(null);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to delete exercise");
      }
    });
  };

  const openEdit = (ex: ExerciseRow) => {
    setFormData({
      name: ex.name,
      categoryId: ex.categoryId ?? "",
      muscleGroup: ex.muscleGroup ?? "",
      difficulty: ex.difficulty as Difficulty,
      videoUrl: ex.videoUrl ?? "",
      thumbnailUrl: ex.thumbnailUrl ?? "",
      description: ex.description ?? "",
    });
    setErrors({});
    setSelectedExercise(ex);
    setEditOpen(true);
  };

  const openDelete = (ex: ExerciseRow) => {
    setSelectedExercise(ex);
    setDeleteOpen(true);
  };

  // ─── Form Fields ──────────────────────────────────────

  const renderFormFields = () => (
    <div className="grid gap-4 py-4">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="exName">
          <Dumbbell className="inline h-3.5 w-3.5 mr-1" />
          Exercise Name
        </Label>
        <Input
          id="exName"
          value={formData.name}
          onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
          placeholder="e.g. Barbell Bench Press"
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name}</p>
        )}
      </div>

      {/* Category + Quick Add */}
      <div className="space-y-2">
        <Label>
          <FolderOpen className="inline h-3.5 w-3.5 mr-1" />
          Category
        </Label>
        <div className="flex gap-2">
          <Select
            value={formData.categoryId || "none"}
            onValueChange={(v) =>
              setFormData((d) => ({
                ...d,
                categoryId: v === "none" ? "" : v,
              }))
            }
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No category</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <QuickAddCategoryDialog onCreated={handleAddNewCategory} />
        </div>
        {errors.categoryId && (
          <p className="text-xs text-destructive">{errors.categoryId}</p>
        )}
      </div>

      {/* Muscle Group + Difficulty */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="muscleGroup">
            <Target className="inline h-3.5 w-3.5 mr-1" />
            Muscle Group
          </Label>
          <Input
            id="muscleGroup"
            value={formData.muscleGroup}
            onChange={(e) =>
              setFormData((d) => ({ ...d, muscleGroup: e.target.value }))
            }
            placeholder="e.g. Chest, Back, Legs"
          />
          {errors.muscleGroup && (
            <p className="text-xs text-destructive">{errors.muscleGroup}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>
            <Zap className="inline h-3.5 w-3.5 mr-1" />
            Difficulty
          </Label>
          <Select
            value={formData.difficulty}
            onValueChange={(v) =>
              setFormData((d) => ({ ...d, difficulty: v as Difficulty }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {difficultyValues.map((d) => (
                <SelectItem key={d} value={d} className="capitalize">
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.difficulty && (
            <p className="text-xs text-destructive">{errors.difficulty}</p>
          )}
        </div>
      </div>

      {/* Video URL + Thumbnail */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="videoUrl">
            <Video className="inline h-3.5 w-3.5 mr-1" />
            Video URL
          </Label>
          <Input
            id="videoUrl"
            value={formData.videoUrl}
            onChange={(e) =>
              setFormData((d) => ({ ...d, videoUrl: e.target.value }))
            }
            placeholder="https://youtube.com/..."
          />
          {errors.videoUrl && (
            <p className="text-xs text-destructive">{errors.videoUrl}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
          <Input
            id="thumbnailUrl"
            value={formData.thumbnailUrl}
            onChange={(e) =>
              setFormData((d) => ({ ...d, thumbnailUrl: e.target.value }))
            }
            placeholder="https://..."
          />
          {errors.thumbnailUrl && (
            <p className="text-xs text-destructive">{errors.thumbnailUrl}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData((d) => ({ ...d, description: e.target.value }))
          }
          placeholder="Describe how to perform this exercise, tips, variations..."
          rows={3}
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description}</p>
        )}
      </div>
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
              Total Exercises
            </CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExercises}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <FolderOpen className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Video</CardTitle>
            <Video className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{withVideo}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Muscle Groups</CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueMuscles}</div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search exercises..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Difficulty filter */}
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-[140px]">
              <Zap className="h-3.5 w-3.5 mr-1" />
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {difficultyValues.map((d) => (
                <SelectItem key={d} value={d} className="capitalize">
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Category filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px]">
              <ListFilter className="h-3.5 w-3.5 mr-1" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="uncategorized">Uncategorized</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <ManageCategoriesDialog
            categories={categories}
            setCategories={setCategories}
          />

          {/* Add Exercise */}
          <Dialog
            open={addOpen}
            onOpenChange={(o) => {
              setAddOpen(o);
              if (!o) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Exercise
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Exercise</DialogTitle>
                <DialogDescription>
                  Add a new exercise to the library with category, muscle group,
                  and optional video.
                </DialogDescription>
              </DialogHeader>
              {renderFormFields()}
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
                  Create Exercise
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
            <Dumbbell className="h-10 w-10 mb-4" />
            <p className="text-lg font-medium">No exercises found</p>
            <p className="text-sm">
              {totalExercises === 0
                ? "Add your first exercise to build the library."
                : "Try adjusting your search or filters."}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-14">Video</TableHead>
                <TableHead>Exercise</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Muscle Group</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((ex) => (
                <TableRow key={ex.id}>
                  {/* Video indicator */}
                  <TableCell>
                    <div
                      className={`w-10 h-8 rounded flex items-center justify-center ${
                        ex.videoUrl
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {ex.videoUrl ? (
                        <Video className="h-4 w-4" />
                      ) : (
                        <span className="text-[10px]">—</span>
                      )}
                    </div>
                  </TableCell>

                  {/* Name + description */}
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{ex.name}</span>
                      {ex.description && (
                        <span className="text-xs text-muted-foreground line-clamp-1 max-w-[250px]">
                          {ex.description}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell>
                    {ex.categoryName ? (
                      <Badge variant="outline" className="text-xs">
                        {ex.categoryName}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  {/* Muscle Group */}
                  <TableCell>
                    {ex.muscleGroup ? (
                      <span className="text-sm">{ex.muscleGroup}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  {/* Difficulty */}
                  <TableCell>
                    <Badge
                      className={`capitalize text-xs ${difficultyColor(
                        ex.difficulty,
                      )}`}
                    >
                      {ex.difficulty}
                    </Badge>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Edit"
                        onClick={() => openEdit(ex)}
                        disabled={isPending}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete"
                        onClick={() => openDelete(ex)}
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
        Showing {filtered.length} of {totalExercises} exercises
      </p>

      {/* Edit Dialog */}
      <Dialog
        open={editOpen}
        onOpenChange={(o) => {
          setEditOpen(o);
          if (!o) {
            setSelectedExercise(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Exercise</DialogTitle>
            <DialogDescription>
              Update exercise details, category, and media links.
            </DialogDescription>
          </DialogHeader>
          {renderFormFields()}
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
            <AlertDialogTitle>Delete Exercise</AlertDialogTitle>
            <AlertDialogDescription>
              Permanently remove{" "}
              <strong>&quot;{selectedExercise?.name}&quot;</strong>? This will
              also remove it from any workout programs that reference it. This
              cannot be undone.
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
              Delete Exercise
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
