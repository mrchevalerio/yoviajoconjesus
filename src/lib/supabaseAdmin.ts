import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing Supabase admin environment variables");
}

/**
 * Server-only client using the service role key, which bypasses Row Level
 * Security. Never import this from a "use client" component — it must only
 * run in API routes / server code, since the service role key can read and
 * write everything regardless of RLS policies.
 */
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
