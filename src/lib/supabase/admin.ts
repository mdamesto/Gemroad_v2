import { createClient } from "@supabase/supabase-js";

// Using untyped client for admin operations to avoid complex type resolution
// with joined queries and service_role operations
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
