// =====================================================================
// Email the free report: the PDF attached and a link back to it online.
// Sent through Resend from Management Ignition's own sender.
// Returns { sent: true, id } or { sent: false, reason }. It never throws
// and never reports a send that did not happen.
// =====================================================================

import { PS } from '../../src/lib/questionBank.js';
import { buildReportPdf, reportFilename, reportLink, COPYRIGHT, FOOTER_LINKS } from './reportPdf.js';

const FROM = process.env.REPORT_FROM || 'Management Ignition <ignite@themessagebusiness.com>';
const REPLY_TO = 'team@management-ignition.com';

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function titleCase(s) {
  return String(s || '').trim().split(/\s+/).map(w => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w)).join(' ');
}

function emailHtml({ name, priorityP, link }) {
  const footer = FOOTER_LINKS.map(l => `<a href="${l.url}" style="color:#5d6b7f;text-decoration:underline">${esc(l.label)}</a>`).join(' &middot; ');
  return `<!doctype html><html><body style="margin:0;background:#f6f8fb;font-family:'Instrument Sans',Helvetica,Arial,sans-serif;color:#2a3d63">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f8fb;padding:32px 16px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e2e7ee;border-radius:14px">
<tr><td style="height:3px;background:#0e7c7b;border-radius:14px 14px 0 0"></td></tr>
<tr><td style="padding:32px 32px 8px">
<p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#5d6b7f">Your 4Ps report</p>
<h1 style="margin:0 0 18px;font-size:24px;line-height:1.25;color:#1b2a4a">Hello ${esc(name || 'there')}, here is your report.</h1>
<p style="margin:0 0 16px;font-size:16px;line-height:1.55">The PDF is attached. Your report also stays online, so you can come back to it whenever you need it.</p>
${priorityP ? `<p style="margin:0 0 22px;font-size:16px;line-height:1.55">Your priority is <strong style="color:#1b2a4a">${esc(priorityP.name)}</strong>: ${esc(priorityP.question)}</p>` : ''}
<p style="margin:0 0 28px"><a href="${link}" style="display:inline-block;background:#0e7c7b;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 20px;border-radius:10px">Open my report</a></p>
<p style="margin:0 0 6px;font-size:15px;line-height:1.55">Jim Harvey</p>
<p style="margin:0 0 28px;font-size:14px;color:#5d6b7f">Management Ignition</p>
</td></tr>
<tr><td style="padding:16px 32px 24px;border-top:1px solid #e2e7ee;font-size:12px;line-height:1.6;color:#5d6b7f">
${footer}<br>${esc(COPYRIGHT)}
</td></tr></table></td></tr></table></body></html>`;
}

function emailText({ name, priorityP, link }) {
  return [
    `Hello ${name || 'there'}, here is your 4Ps report.`,
    '',
    'The PDF is attached. Your report also stays online, so you can come back to it whenever you need it:',
    link,
    '',
    priorityP ? `Your priority is ${priorityP.name}: ${priorityP.question}` : '',
    '',
    'Jim Harvey',
    'Management Ignition',
    '',
    FOOTER_LINKS.map(l => `${l.label}: ${l.url.replace('mailto:', '')}`).join('\n'),
    COPYRIGHT,
  ].join('\n');
}

export async function sendReportEmail({ to, firstName, scores, id, date }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[sendReport] RESEND_API_KEY is not set; report not emailed');
    return { sent: false, reason: 'not_configured' };
  }
  try {
    const pdf = await buildReportPdf({ firstName, scores, date, id });
    const name = titleCase(firstName);
    const priorityP = PS.find(p => p.key === scores.priority_p);
    const link = reportLink(id);

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM,
        to: [to],
        reply_to: REPLY_TO,
        subject: priorityP ? `Your 4Ps report: start with ${priorityP.name}` : 'Your 4Ps report',
        html: emailHtml({ name, priorityP, link }),
        text: emailText({ name, priorityP, link }),
        attachments: [{ filename: reportFilename(firstName), content: pdf.toString('base64') }],
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error(`[sendReport] Resend ${res.status}: ${text}`);
      return { sent: false, reason: `resend_${res.status}` };
    }
    const data = await res.json().catch(() => ({}));
    if (!data.id) {
      console.error('[sendReport] Resend returned no id', data);
      return { sent: false, reason: 'no_id' };
    }
    return { sent: true, id: data.id };
  } catch (e) {
    console.error('[sendReport] failed', e && e.stack || e);
    return { sent: false, reason: 'error' };
  }
}
