import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

let server_supabase: SupabaseClient;

if (supabaseUrl && supabaseServiceRoleKey) {
  server_supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
}

export { server_supabase as supabase };
