/**
 * Minimal CloudConvert v2 client (REST, no SDK).
 * Flow: create job (import/upload → convert → export/url) → upload the file →
 * poll until finished → return the result file URL.
 */

const BASE = "https://api.cloudconvert.com/v2";

interface CloudConvertTask {
  name: string;
  operation: string;
  status: string;
  result?: {
    form?: { url: string; parameters: Record<string, string> };
    files?: { filename: string; url: string }[];
  };
}

interface CloudConvertJob {
  id: string;
  status: "waiting" | "processing" | "finished" | "error";
  tasks: CloudConvertTask[];
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface ConversionOutput {
  url: string;
  filename: string;
}

export async function convertWithCloudConvert(opts: {
  apiKey: string;
  file: Buffer | Uint8Array;
  filename: string;
  outputFormat: string;
  timeoutMs?: number;
}): Promise<ConversionOutput> {
  const { apiKey, file, filename, outputFormat, timeoutMs = 110_000 } = opts;
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  // 1. Create the job.
  const createRes = await fetch(`${BASE}/jobs`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      tasks: {
        "import-file": { operation: "import/upload" },
        "convert-file": {
          operation: "convert",
          input: "import-file",
          output_format: outputFormat,
        },
        "export-file": { operation: "export/url", input: "convert-file" },
      },
    }),
  });
  if (!createRes.ok) {
    throw new Error(`CloudConvert job failed (${createRes.status})`);
  }
  const { data: job } = (await createRes.json()) as { data: CloudConvertJob };

  // 2. Upload the file to the import task's signed form.
  const importTask = job.tasks.find((t) => t.name === "import-file");
  const form = importTask?.result?.form;
  if (!form) throw new Error("CloudConvert did not return an upload form.");

  const uploadForm = new FormData();
  for (const [k, v] of Object.entries(form.parameters)) uploadForm.append(k, v);
  uploadForm.append("file", new Blob([file as BlobPart]), filename);
  const uploadRes = await fetch(form.url, { method: "POST", body: uploadForm });
  if (!uploadRes.ok) {
    throw new Error(`CloudConvert upload failed (${uploadRes.status})`);
  }

  // 3. Poll the job until it finishes.
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    await sleep(1500);
    const pollRes = await fetch(`${BASE}/jobs/${job.id}?include=tasks`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!pollRes.ok) continue;
    const { data: current } = (await pollRes.json()) as { data: CloudConvertJob };

    if (current.status === "error") {
      throw new Error("Conversion failed — that format pairing may be unsupported.");
    }
    if (current.status === "finished") {
      const exportTask = current.tasks.find(
        (t) => t.operation === "export/url" && t.status === "finished"
      );
      const out = exportTask?.result?.files?.[0];
      if (!out?.url) throw new Error("Conversion finished without an output file.");
      return { url: out.url, filename: out.filename };
    }
  }
  throw new Error("Conversion timed out. Try a smaller file.");
}
