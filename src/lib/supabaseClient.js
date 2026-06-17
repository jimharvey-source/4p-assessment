// Browser-side Supabase client.
// Uses the publishable key. Cannot bypass Row Level Security.
//
// The diagnostic browser never reads from the table directly — all
// writes go through the /api/submit serverless function which uses the
// secret key. This client exists for future expansion (e.g. magic-link
// downloads of the Pro report).

import { createClient } from '@supabase/supabase-js';

const url     = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = (url && anonKey) ? createClient(url, anonKey) : null;

export const supabaseReady = Boolean(url && anonKey);
