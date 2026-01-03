"use client";

// src/app/dashboard/progress/create/page.tsx
"use client";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadFile, getPublicUrl } from "@/lib/storage";

export default function CreateProgressPage() {
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    metric: "Weight",
    value: "",
    photo_url: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
        // Assume 'progress-photos' bucket exists
        const path = `progress/${Date.now()}_${file.name}`;
        const { error } = await uploadFile("progress-photos", path, file);
        if (error) throw error;
        photoUrl = getPublicUrl("progress-photos", path);
      }

      const { error: insertError } = await supabase.from("progress").insert([
        {
          ...form,
          value: parseFloat(form.value),
          photo_url: photoUrl,
        },
      ]);

      if (insertError) throw insertError;

      router.push("/dashboard/progress");
    } catch (error) {
      console.error("Error creating progress entry:", error);
      alert("Failed to create entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow mt-6">
      <h1 className="text-2xl font-bold mb-6">Add Progress Entry</h1>
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
            placeholder="0.00"
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
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Entry"}
        </button>
      </form>
    </div>
  );
}
