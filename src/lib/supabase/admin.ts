import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the secret (service) key. Never import in
 * client components. Used to store conversion inputs/outputs and mint signed
 * download URLs.
 */
export function createAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase server env missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY."
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const CONVERSIONS_BUCKET = "conversions";

/** Creates the storage bucket if it doesn't already exist (idempotent). */
export async function ensureBucket(client: SupabaseClient): Promise<void> {
  const { data } = await client.storage.getBucket(CONVERSIONS_BUCKET);
  if (data) return;
  await client.storage.createBucket(CONVERSIONS_BUCKET, {
    public: false,
    fileSizeLimit: "50MB",
  });
}
