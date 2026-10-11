// =====================================================================
// /api/report?id=<uuid>             the report data, for /report/<id>
// /api/report?id=<uuid>&format=pdf  the report as a PDF download
//
// The id is the response's random uuid, sent only to the person who took
// the diagnostic. Scores are recomputed from the stored answers so the
// report always matches the current engine. Email is never returned.
// =====================================================================

import { createClient } from '@supabase/supabase-js';
import { scoreResponses, isComplete } from '../src/lib/scoringEngine.js';
import { buildReportPdf, reportFilename } from './_lib/reportPdf.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const id = String(req.query.id || '');
  if (!UUID.test(id)) return res.status(400).json({ error: 'Invalid report id' });

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    console.error('[report] Missing Supabase env vars');
    return res.status(500).json({ error: 'Server misconfigured' });
  }
  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  const { data, error } = await supabase
    .from('four_ps_responses')
    .select('id, first_name, answers, completed_at')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('[report] Supabase read failed', error);
    return res.status(500).json({ error: 'Could not load report' });
  }
  if (!data) return res.status(404).json({ error: 'Report not found' });
  if (!isComplete(data.answers || {})) {
    console.error('[report] stored answers incomplete for', id);
    return res.status(500).json({ error: 'Report data incomplete' });
  }

  const scores = scoreResponses(data.answers);

  if (req.query.format === 'pdf') {
    try {
      const pdf = await buildReportPdf({ firstName: data.first_name, scores, date: data.completed_at, id });
      const filename = reportFilename(data.first_name);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`);
      res.setHeader('Cache-Control', 'private, no-store');
      return res.status(200).send(pdf);
    } catch (e) {
      console.error('[report] PDF render failed', e && e.stack || e);
      return res.status(500).json({ error: 'Could not build the PDF' });
    }
  }

  res.setHeader('Cache-Control', 'private, no-store');
  return res.status(200).json({ id, first_name: data.first_name, completed_at: data.completed_at, scores });
}
