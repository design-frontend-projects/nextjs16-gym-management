// src/lib/storage.ts
import { supabase } from "@/lib/supabase";

export async function uploadFile(bucket: string, path: string, file: File) {
  return await supabase.storage.from(bucket).upload(path, file);
}

export function getPublicUrl(bucket: string, path: string) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
