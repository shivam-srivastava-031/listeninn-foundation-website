// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client used by both server‑side API routes and client code.
 * It uses the public anon key for client‑side reads (RLS enforced) and the
 * service_role key for privileged server‑side operations.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
