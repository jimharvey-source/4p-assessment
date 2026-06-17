// =====================================================================
// /api/submit
// Vercel serverless function.
//
// Receives the completed diagnostic from the browser, computes scores
// server-side (do not trust client scoring), writes to Supabase via the
// secret/service_role key, syncs to Mailchimp if consent was given,
// returns the score payload to the browser for inline rendering.
//
// IMPORTANT (from project log gotchas):
//   - Initialise Supabase client INSIDE the handler, not at module top.
//   - service_role key is server-only; never exposed.
//   - Mailchimp failure must NOT block Supabase write or report return.
// =====================================================================

import { createClient } from '@supabase/supabase-js';
import { scoreResponses, isComplete, toSupabasePayload } from '../src/lib/scoringEngine.js';
import { INSTRUMENT_VERSION, FRAMEWORK_VERSION } from '../src/lib/questionBank.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Initialise Supabase INSIDE the handler. Module-level init
  // fails intermittently on Vercel's serverless runtime.
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error('[submit] Missing Supabase env vars');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  try {
    const body = req.body;
    if (!body || typeof body !== 'object') {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const {
      context = {},
      answers = {},
      email,
      first_name,
      marketing_consent = false,
    } = body;

    // Validate
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: 'Valid email required' });
    }
    if (!first_name || typeof first_name !== 'string' || first_name.trim().length < 1) {
      return res.status(400).json({ error: 'First name required' });
    }
    if (!isComplete(answers)) {
      return res.status(400).json({ error: 'Diagnostic incomplete' });
    }

    // Score server-side
    const scores = scoreResponses(answers);
    const scorePayload = toSupabasePayload(scores);

    const row = {
      ...scorePayload,
      team_size:         context.team_size  || null,
      tenure:            context.tenure     || null,
      pressure:          context.pressure   || null,
      team_type:         context.team_type  || null,
      answers,
      email:             email.trim().toLowerCase(),
      first_name:        first_name.trim(),
      marketing_consent: Boolean(marketing_consent),
      completed_at:      new Date().toISOString(),
      instrument_version: INSTRUMENT_VERSION,
      framework_version:  FRAMEWORK_VERSION,
    };

    // Write to Supabase
    const { data, error } = await supabase
      .from('four_ps_responses')
      .insert(row)
      .select('id')
      .single();

    if (error) {
      console.error('[submit] Supabase insert failed', error);
      return res.status(500).json({ error: 'Could not save response' });
    }

    const responseId = data.id;

    // Sync to Mailchimp if consent given. Fire-and-log.
    // A Mailchimp failure should NOT block the report from rendering.
    if (marketing_consent) {
      try {
        await syncToMailchimp({ email: row.email, first_name: row.first_name });
        await supabase
          .from('four_ps_responses')
          .update({ mailchimp_synced: true })
          .eq('id', responseId);
      } catch (mcErr) {
        console.error('[submit] Mailchimp sync failed (non-fatal)', mcErr);
      }
    }

    return res.status(200).json({
      responseId,
      scores,
    });

  } catch (err) {
    console.error('[submit] Unhandled error', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

// ---------------------------------------------------------------------
// MAILCHIMP SYNC
// Adds the contact to the Management Ignite list with tag 4p-diagnostic-free.
// Idempotent: uses PUT to the members endpoint so re-submitting upserts.
// ---------------------------------------------------------------------
async function syncToMailchimp({ email, first_name }) {
  const apiKey  = process.env.MAILCHIMP_API_KEY;
  const listId  = process.env.MAILCHIMP_LIST_ID;
  if (!apiKey || !listId) {
    console.warn('[mailchimp] env not configured; skipping');
    return;
  }

  const dc = apiKey.split('-')[1]; // e.g. 'us6'
  if (!dc) throw new Error('Mailchimp API key malformed');

  // Mailchimp uses lowercase MD5 of email as subscriber hash
  const subscriberHash = await md5Hex(email.toLowerCase());

  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members/${subscriberHash}`;

  const payload = {
    email_address: email,
    status_if_new: 'subscribed',
    status:        'subscribed',
    merge_fields:  { FNAME: first_name },
    tags:          ['4p-diagnostic-FREE'],
  };

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Mailchimp ${res.status}: ${text}`);
  }
}

// md5 using Web Crypto if available, else node:crypto
async function md5Hex(str) {
  try {
    const { createHash } = await import('node:crypto');
    return createHash('md5').update(str).digest('hex');
  } catch (_e) {
    // Fallback: trivial md5 not implemented; node:crypto should always exist on Vercel
    throw new Error('md5 unavailable in this runtime');
  }
}
