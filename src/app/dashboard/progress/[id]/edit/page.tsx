"use client";

// src/app/dashboard/progress/[id]/edit/page.tsx
"use client";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { uploadFile, getPublicUrl } from "@/lib/storage";

export default function EditProgressPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [form, setForm] = useState({
    date: "",
    metric: "",
    value: "",
    photo_url: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchEntry = async () => {
      const { data, error } = await supabase
        .from("progress")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching entry:", error);
      } else if (data) {
        setForm({
          date: data.date,
          metric: data.metric,
          value: data.value.toString(),
          photo_url: data.photo_url || "",
        });
      }
      setFetching(false);
    };
    fetchEntry();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let photoUrl = form.photo_url;

      if (file) {
        const path = `progress/${Date.now()}_${file.name}`;
        const { data, error } = await uploadFile("progress-photos", path, file);
        if (error) throw error;
        photoUrl = getPublicUrl("progress-photos", path);
      }

      const { error: updateError } = await supabase
        .from("progress")
        .update({
          ...form,
          value: parseFloat(form.value),
          photo_url: photoUrl,
        })
        .eq("id", id);

      if (updateError) throw updateError;

      router.push("/dashboard/progress");
    } catch (error) {
      console.error("Error updating progress entry:", error);
      alert("Failed to update entry");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow mt-6">
      <h1 className="text-2xl font-bold mb-6">Edit Progress Entry</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Date</label>
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Metric</label>
          <select
            name="metric"
            value={form.metric}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="Weight">Weight (kg)</option>
            <option value="Body Fat">Body Fat (%)</option>
            <option value="Chest">Chest (cm)</option>
            <option value="Waist">Waist (cm)</option>
            <option value="Arms">Arms (cm)</option>
            <option value="Legs">Legs (cm)</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Value</label>
          <input
            name="value"
            type="number"
            step="0.01"
            value={form.value}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">
            Progress Photo (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
          {form.photo_url && !file && (
            <div className="mt-2 text-sm text-gray-600">
              Current photo:{" "}
              <a
                href={form.photo_url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 hover:underline"
              >
                View
              </a>
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Update Entry"}
        </button>
      </form>
    </div>
  );
}
