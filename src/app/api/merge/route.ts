import { NextResponse } from "next/server";
import {
  createAdminClient,
  ensureBucket,
  CONVERSIONS_BUCKET,
} from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const maxDuration = 120;

const MAX_TOTAL_BYTES = 50 * 1024 * 1024; // 50 MB combined
const BASE = "https://api.cloudconvert.com/v2";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: Request) {
  try {
    const apiKey = process.env.CLOUDCONVERT_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Conversion not configured (missing CloudConvert key)." },
        { status: 501 }
      );
    }

    const form = await req.formData();
    const files = form.getAll("file") as File[];

    if (files.length < 2) {
      return NextResponse.json({ error: "At least 2 files required for merge." }, { status: 400 });
    }

    const totalSize = files.reduce((s, f) => s + f.size, 0);
    if (totalSize > MAX_TOTAL_BYTES) {
      return NextResponse.json({ error: "Combined file size exceeds 50 MB." }, { status: 413 });
    }

    const fileBuffers = await Promise.all(files.map(async (f) => ({
      data: new Uint8Array(await f.arrayBuffer()),
      filename: f.name,
    })));

    // Build a CloudConvert job: N import/upload tasks → convert (merge) → export/url
    const tasks: Record<string, unknown> = {};
    fileBuffers.forEach((_, i) => { tasks[`import-${i}`] = { operation: "import/upload" }; });
    tasks["merge"] = {
      operation: "convert",
      input: fileBuffers.map((_, i) => `import-${i}`),
      output_format: "pdf",
    };
    tasks["export"] = { operation: "export/url", input: "merge" };

    const createRes = await fetch(`${BASE}/jobs`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ tasks }),
    });
    if (!createRes.ok) {
      throw new Error(`CloudConvert job creation failed (${createRes.status})`);
    }

    interface CCTask { name: string; operation: string; status: string; result?: { form?: { url: string; parameters: Record<string, string> }; files?: { filename: string; url: string }[] } }
    interface CCJob  { id: string; status: string; tasks: CCTask[] }
    const { data: job } = (await createRes.json()) as { data: CCJob };

    // Upload each PDF to its import task's presigned form
    for (let i = 0; i < fileBuffers.length; i++) {
      const importTask = job.tasks.find((t) => t.name === `import-${i}`);
      const form_data = importTask?.result?.form;
      if (!form_data) throw new Error(`Upload form not returned for file ${i + 1}.`);

      const uploadForm = new FormData();
      for (const [k, v] of Object.entries(form_data.parameters)) uploadForm.append(k, v);
      uploadForm.append("file", new Blob([fileBuffers[i]!.data as BlobPart]), fileBuffers[i]!.filename);

      const uploadRes = await fetch(form_data.url, { method: "POST", body: uploadForm });
      if (!uploadRes.ok) throw new Error(`Upload failed for ${fileBuffers[i]!.filename}`);
    }

    // Poll until finished
    const start = Date.now();
    while (Date.now() - start < 110_000) {
      await sleep(1800);
      const pollRes = await fetch(`${BASE}/jobs/${job.id}?include=tasks`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (!pollRes.ok) continue;
      const { data: current } = (await pollRes.json()) as { data: CCJob };
      if (current.status === "error") throw new Error("PDF merge failed on CloudConvert.");
      if (current.status === "finished") {
        const exportTask = current.tasks.find((t) => t.operation === "export/url" && t.status === "finished");
        const out = exportTask?.result?.files?.[0];
        if (!out?.url) throw new Error("Merge finished but no output file returned.");

        // Download merged PDF and store in Supabase
        const downloaded = await fetch(out.url);
        if (!downloaded.ok) throw new Error("Could not retrieve merged PDF.");
        const outBytes = new Uint8Array(await downloaded.arrayBuffer());
        const outName = "merged.pdf";

        const supabase = createAdminClient();
        await ensureBucket(supabase);

        const path = `${crypto.randomUUID()}/${outName}`;
        const { error: uploadError } = await supabase.storage
          .from(CONVERSIONS_BUCKET)
          .upload(path, outBytes, { contentType: "application/pdf", upsert: false });
        if (uploadError) throw new Error(uploadError.message);

        const { data: signed, error: signError } = await supabase.storage
          .from(CONVERSIONS_BUCKET)
          .createSignedUrl(path, 60 * 60, { download: outName });
        if (signError || !signed) throw new Error("Could not create download link.");

        return NextResponse.json({ url: signed.signedUrl, name: outName, size: outBytes.byteLength });
      }
    }
    throw new Error("PDF merge timed out.");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Merge failed.";
    console.error("api/merge:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
