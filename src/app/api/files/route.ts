import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const BUCKET = "user-files";

/** Resolve the signed-in user from the Bearer token (validated by Supabase). */
async function getUser(req: Request) {
  const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const { data, error } = await createAdminClient().auth.getUser(token);
  if (error) return null;
  return data.user;
}

async function ensureBucket() {
  const admin = createAdminClient();
  const { data } = await admin.storage.getBucket(BUCKET);
  if (!data) {
    await admin.storage.createBucket(BUCKET, { public: false, fileSizeLimit: "50MB" });
  }
  return admin;
}

export async function GET(req: Request) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const sign = new URL(req.url).searchParams.get("sign");

  if (sign) {
    if (!sign.startsWith(`${user.id}/`)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { data, error } = await admin.storage.from(BUCKET).createSignedUrl(sign, 3600);
    if (error || !data) return NextResponse.json({ error: "Sign failed" }, { status: 500 });
    return NextResponse.json({ url: data.signedUrl });
  }

  const { data, error } = await admin.storage
    .from(BUCKET)
    .list(user.id, { sortBy: { column: "created_at", order: "desc" } });
  if (error) return NextResponse.json({ files: [], error: error.message });

  const files = (data ?? [])
    .filter((f) => f.id)
    .map((f) => ({
      name: f.name.replace(/^\d+-/, ""),
      size: (f.metadata?.size as number) ?? 0,
      createdAt: f.created_at ?? "",
      path: `${user.id}/${f.name}`,
    }));
  return NextResponse.json({ files });
}

export async function POST(req: Request) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (file.size > 50 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (50 MB max)." }, { status: 413 });
  }

  const admin = await ensureBucket();
  const path = `${user.id}/${Date.now()}-${file.name}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await admin.storage.from(BUCKET).upload(path, bytes, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { path } = (await req.json()) as { path?: string };
  if (!path || !path.startsWith(`${user.id}/`)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { error } = await createAdminClient().storage.from(BUCKET).remove([path]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { path, name } = (await req.json()) as { path?: string; name?: string };
  if (!path || !path.startsWith(`${user.id}/`)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const clean = (name ?? "").trim().replace(/[/\\]/g, "");
  if (!clean) return NextResponse.json({ error: "Invalid name." }, { status: 400 });

  // Preserve the timestamp prefix so ordering/uniqueness is kept.
  const fileName = path.split("/").pop() ?? "";
  const ts = fileName.match(/^(\d+)-/)?.[1] ?? String(Date.now());
  const newPath = `${user.id}/${ts}-${clean}`;
  if (newPath === path) return NextResponse.json({ ok: true });

  const { error } = await createAdminClient().storage.from(BUCKET).move(path, newPath);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
