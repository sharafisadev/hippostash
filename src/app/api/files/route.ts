import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const BUCKET = "user-files";

interface Meta {
  displayName?: string;
  category?: string;
  tags?: string[];
}
type Manifest = Record<string, Meta>;

async function getUser(req: Request) {
  const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const { data, error } = await createAdminClient().auth.getUser(token);
  if (error) return null;
  return data.user;
}

async function ensureBucket(admin: SupabaseClient) {
  const { data } = await admin.storage.getBucket(BUCKET);
  if (!data) await admin.storage.createBucket(BUCKET, { public: false, fileSizeLimit: "50MB" });
}

const manifestPath = (uid: string) => `${uid}/.manifest.json`;

async function readManifest(admin: SupabaseClient, uid: string): Promise<Manifest> {
  const { data } = await admin.storage.from(BUCKET).download(manifestPath(uid));
  if (!data) return {};
  try {
    return JSON.parse(await data.text()) as Manifest;
  } catch {
    return {};
  }
}

async function writeManifest(admin: SupabaseClient, uid: string, m: Manifest) {
  await admin.storage
    .from(BUCKET)
    .upload(manifestPath(uid), new Blob([JSON.stringify(m)], { type: "application/json" }), {
      upsert: true,
    });
}

export async function GET(req: Request) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const sign = new URL(req.url).searchParams.get("sign");

  if (sign) {
    if (!sign.startsWith(`${user.id}/`)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { data, error } = await admin.storage.from(BUCKET).createSignedUrl(sign, 3600);
    if (error || !data) return NextResponse.json({ error: "Sign failed" }, { status: 500 });
    return NextResponse.json({ url: data.signedUrl });
  }

  const { data, error } = await admin.storage
    .from(BUCKET)
    .list(user.id, { sortBy: { column: "created_at", order: "desc" }, limit: 1000 });
  if (error) return NextResponse.json({ files: [], error: error.message });

  const manifest = await readManifest(admin, user.id);
  const files = (data ?? [])
    .filter((f) => f.id && !f.name.startsWith("."))
    .map((f) => {
      const path = `${user.id}/${f.name}`;
      const meta = manifest[path] ?? {};
      return {
        name: meta.displayName ?? f.name.replace(/^\d+-/, ""),
        size: (f.metadata?.size as number) ?? 0,
        createdAt: f.created_at ?? "",
        path,
        category: meta.category ?? "",
        tags: meta.tags ?? [],
      };
    });
  return NextResponse.json({ files });
}

export async function POST(req: Request) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file provided." }, { status: 400 });
  if (file.size > 50 * 1024 * 1024) return NextResponse.json({ error: "File too large (50 MB max)." }, { status: 413 });

  const displayName = (form.get("name") as string)?.trim();
  const category = (form.get("category") as string)?.trim();
  const tagsRaw = (form.get("tags") as string) ?? "";
  const tags = tagsRaw.split(",").map((t) => t.trim()).filter(Boolean);

  const admin = createAdminClient();
  await ensureBucket(admin);
  const path = `${user.id}/${Date.now()}-${file.name}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await admin.storage.from(BUCKET).upload(path, bytes, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  try {
    const m = await readManifest(admin, user.id);
    m[path] = { displayName: displayName || undefined, category: category || undefined, tags: tags.length ? tags : undefined };
    await writeManifest(admin, user.id, m);
  } catch {
    /* metadata best-effort */
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { path } = (await req.json()) as { path?: string };
  if (!path || !path.startsWith(`${user.id}/`)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const admin = createAdminClient();
  const { error } = await admin.storage.from(BUCKET).remove([path]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  try {
    const m = await readManifest(admin, user.id);
    if (m[path]) {
      delete m[path];
      await writeManifest(admin, user.id, m);
    }
  } catch {
    /* best-effort */
  }
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { path, name, category, tags } = (await req.json()) as {
    path?: string;
    name?: string;
    category?: string;
    tags?: string[];
  };
  if (!path || !path.startsWith(`${user.id}/`)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const admin = createAdminClient();
  try {
    const m = await readManifest(admin, user.id);
    const cur = m[path] ?? {};
    if (name !== undefined) cur.displayName = name.trim() || undefined;
    if (category !== undefined) cur.category = category.trim() || undefined;
    if (tags !== undefined) cur.tags = tags.filter(Boolean).length ? tags.filter(Boolean) : undefined;
    m[path] = cur;
    await writeManifest(admin, user.id, m);
  } catch (e) {
    return NextResponse.json({ error: "Could not save details." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
