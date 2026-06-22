import { NextResponse } from "next/server";
import { convertWithCloudConvert } from "@/lib/cloudconvert";
import {
  createAdminClient,
  ensureBucket,
  CONVERSIONS_BUCKET,
} from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const maxDuration = 120;

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB

/** Normalize a user-facing format label to a CloudConvert output format. */
function normalizeFormat(format: string): string {
  const f = format.trim().toLowerCase();
  return f === "jpeg" ? "jpg" : f;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.CLOUDCONVERT_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Conversion isn't configured yet (missing CloudConvert key)." },
        { status: 501 }
      );
    }

    const form = await req.formData();
    const file = form.get("file");
    const format = normalizeFormat(String(form.get("format") ?? ""));

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }
    if (!format) {
      return NextResponse.json({ error: "No target format." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File too large (25 MB max for the demo)." },
        { status: 413 }
      );
    }

    const inputBytes = new Uint8Array(await file.arrayBuffer());
    const baseName = file.name.replace(/\.[^.]+$/, "") || "converted";
    const outName = `${baseName}.${format}`;

    // 1. Convert via CloudConvert.
    const result = await convertWithCloudConvert({
      apiKey,
      file: inputBytes,
      filename: file.name,
      outputFormat: format,
    });

    // 2. Download the converted file.
    const downloaded = await fetch(result.url);
    if (!downloaded.ok) {
      throw new Error("Could not retrieve the converted file.");
    }
    const outBytes = new Uint8Array(await downloaded.arrayBuffer());

    // 3. Store in Supabase and mint a signed, download-forcing URL.
    const supabase = createAdminClient();
    await ensureBucket(supabase);

    const path = `${crypto.randomUUID()}/${outName}`;
    const { error: uploadError } = await supabase.storage
      .from(CONVERSIONS_BUCKET)
      .upload(path, outBytes, {
        contentType:
          downloaded.headers.get("content-type") ?? "application/octet-stream",
        upsert: false,
      });
    if (uploadError) throw new Error(uploadError.message);

    const { data: signed, error: signError } = await supabase.storage
      .from(CONVERSIONS_BUCKET)
      .createSignedUrl(path, 60 * 60, { download: outName });
    if (signError || !signed) throw new Error("Could not create a download link.");

    return NextResponse.json({
      url: signed.signedUrl,
      name: outName,
      size: outBytes.byteLength,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Conversion failed.";
    console.error("api/convert:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
