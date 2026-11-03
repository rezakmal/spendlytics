import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/**
 * Service-role client — bypasses RLS. Server-only, never import from
 * client components. Always scope queries to a specific user id.
 */
export function createServiceClient(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  }

  cached = createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
