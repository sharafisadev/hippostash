"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/AuthProvider";

export interface StoredFile {
  name: string;
  size: number;
  createdAt: string;
  path: string;
}

async function authHeaders(): Promise<Record<string, string>> {
  const { data } = await getSupabase().auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** The signed-in user's private files, via the secure /api/files route. */
export function useStorage() {
  const { user } = useAuth();
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/files", { headers: await authHeaders() });
      const data = (await res.json()) as { files?: StoredFile[]; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Could not load files.");
      setFiles(data.files ?? []);
      if (data.error) setError(data.error);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load files.");
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) refresh();
    else setFiles([]);
  }, [user, refresh]);

  const upload = useCallback(
    async (file: File) => {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/files", {
        method: "POST",
        headers: await authHeaders(),
        body: fd,
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Upload failed.");
      await refresh();
    },
    [refresh]
  );

  const remove = useCallback(
    async (path: string) => {
      const res = await fetch("/api/files", {
        method: "DELETE",
        headers: { ...(await authHeaders()), "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Delete failed.");
      await refresh();
    },
    [refresh]
  );

  const rename = useCallback(
    async (path: string, name: string) => {
      const res = await fetch("/api/files", {
        method: "PATCH",
        headers: { ...(await authHeaders()), "Content-Type": "application/json" },
        body: JSON.stringify({ path, name }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Rename failed.");
      await refresh();
    },
    [refresh]
  );

  const previewUrl = useCallback(async (path: string): Promise<string | null> => {
    const res = await fetch(`/api/files?sign=${encodeURIComponent(path)}`, {
      headers: await authHeaders(),
    });
    const data = (await res.json()) as { url?: string };
    return data.url ?? null;
  }, []);

  const preview = useCallback(async (path: string) => {
    const res = await fetch(`/api/files?sign=${encodeURIComponent(path)}`, {
      headers: await authHeaders(),
    });
    const data = (await res.json()) as { url?: string };
    if (data.url) window.open(data.url, "_blank", "noopener");
  }, []);

  const used = files.reduce((s, f) => s + f.size, 0);
  return { files, used, loading, error, refresh, upload, remove, rename, preview, previewUrl };
}
