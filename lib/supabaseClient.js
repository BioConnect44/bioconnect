import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/**
 * Standard Supabase client for public/client-side operations
 */
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

/**
 * Admin Service-Role Supabase client for backend operations requiring elevated write privileges
 */
export const supabaseAdmin = createSupabaseClient(
  supabaseUrl,
  supabaseServiceRoleKey || supabaseAnonKey
);
