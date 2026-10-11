// =====================================================================
// The free 4Ps report as a PDF.
// Server-side PDFKit, in the Management Ignition design system: Instrument
// Sans for what the software says, Fraunces where Jim speaks to the reader.
// Used by /api/report (download) and /api/submit (the emailed copy).
// Files under api/_lib are not deployed as functions.
// =====================================================================

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PS } from '../../src/lib/questionBank.js';
import { scoreToBand } from '../../src/lib/scoringEngine.js';
import { P_NARRATIVES, DRIVER_MOVES, TOOL_FOR_P } from '../../src/lib/reportContent.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const SITE_URL = 'https://www.management-ignition.com';
export const ASSESS_URL = process.env.REPORT_BASE_URL || 'https://assess.management-ignition.com';
export const COPYRIGHT = '© 2026 James G Harvey / Allcow Trading Co. Ltd. trading as The Message Business';
export const FOOTER_LINKS = [
  { label: 'Management Ignition', url: SITE_URL },
  { label: 'Security', url: `${SITE_URL}/security.html` },
  { label: 'The Message Business', url: 'https://themessagebusiness.com' },
  { label: 'Contact', url: 'mailto:team@management-ignition.com' },
];

const INK = '#1b2a4a';
const INK_2 = '#2a3d63';
const MUTED = '#5d6b7f';
const RULE = '#e2e7ee';
const SUNK = '#eef2f6';
const ACCENT = '#0e7c7b';
const ACCENT_SOFT = '#e9f3f3';

const LEFT = 56;
const RIGHT = 539;
const WIDTH = RIGHT - LEFT;

// Fonts: look beside this file first, then from the project root.
// If none can be read, say so in the log and fall back to the built-in faces.
function loadFonts() {
  const dirs = [path.join(__dirname, '..', '_fonts'), path.join(process.cwd(), 'api', '_fonts')];
  for (const d of dirs) {
    try {
      return {
        sans: fs.readFileSync(path.join(d, 'InstrumentSans-Regular.ttf')),
        bold: fs.readFileSync(path.join(d, 'InstrumentSans-SemiBold.ttf')),
        spoken: fs.readFileSync(path.join(d, 'Fraunces-Regular.ttf')),
      };
    } catch (_e) { /* try the next */ }
  }
  console.error('[reportPdf] brand fonts not found, falling back to Helvetica and Times');
  return null;
}
const FONT_DATA = loadFonts();
const F = FONT_DATA
  ? { sans: 'Sans', bold: 'SansBold', spoken: 'Spoken' }
  : { sans: 'Helvetica', bold: 'Helvetica-Bold', spoken: 'Times-Roman' };

function titleCase(s) {
  return String(s || '').trim().split(/\s+/).map(w => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w)).join(' ');
}

function longDate(d) {
  return new Date(d || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function reportFilename(firstName) {
  const name = titleCase(firstName).replace(/[^\w \-]/g, '').slice(0, 40).trim();
  return name ? `The 4Ps report - ${name}.pdf` : 'The 4Ps report.pdf';
}

export function reportLink(id) {
  return `${ASSESS_URL}/report/${id}`;
}

// The mark: four stacked bars narrowing to a peak, the peak in accent (mi-mark.svg geometry).
function drawMark(doc, x, y, size) {
  const s = size / 48;
  [[19, 6, 10, ACCENT], [14, 16, 20, INK], [9, 26, 30, INK], [4, 36, 40, INK]].forEach(([bx, by, bw, c]) => {
    doc.roundedRect(x + bx * s, y + by * s, bw * s, 6 * s, 3 * s).fillColor(c).fill();
  });
}

function label(doc, text, color = MUTED) {
  doc.font(F.bold).fontSize(9).fillColor(color).text(text, LEFT, doc.y, { width: WIDTH });
  doc.moveDown(0.3);
}

function h1(doc, text, size = 26) {
  doc.font(F.bold).fontSize(size).fillColor(INK).text(text, LEFT, doc.y, { width: WIDTH, characterSpacing: -0.4 });
  doc.moveDown(0.3);
}

function rule(doc) {
  const y = doc.y + 4;
  doc.moveTo(LEFT, y).lineTo(RIGHT, y).lineWidth(0.6).strokeColor(RULE).stroke();
  doc.y = y + 16;
}

// A filled panel. PDFKit cannot fill behind text already placed, so measure first.
function panel(doc, { fill = SUNK, lab, heading, text, spoken = false }) {
  const pad = 18;
  const w = WIDTH - pad * 2;
  let h = pad;
  if (lab) { doc.font(F.bold).fontSize(9); h += doc.heightOfString(lab, { width: w }) + 4; }
  if (heading) { doc.font(F.bold).fontSize(15); h += doc.heightOfString(heading, { width: w }) + 6; }
  if (text) { doc.font(spoken ? F.spoken : F.sans).fontSize(spoken ? 12 : 10.5); h += doc.heightOfString(text, { width: w, lineGap: 4 }); }
  h += pad;
  const y0 = doc.y;
  doc.roundedRect(LEFT, y0, WIDTH, h, 10).fillColor(fill).fill();
  let ty = y0 + pad;
  if (lab) { doc.font(F.bold).fontSize(9).fillColor(MUTED).text(lab, LEFT + pad, ty, { width: w }); ty = doc.y + 4; }
  if (heading) { doc.font(F.bold).fontSize(15).fillColor(INK).text(heading, LEFT + pad, ty, { width: w }); ty = doc.y + 6; }
  if (text) { doc.font(spoken ? F.spoken : F.sans).fontSize(spoken ? 12 : 10.5).fillColor(INK).text(text, LEFT + pad, ty, { width: w, lineGap: 4 }); }
  doc.y = y0 + h + 16;
  doc.x = LEFT;
}

function dot(doc, x, y, colour) {
  doc.circle(x, y, 3.5).fillColor(colour).fill();
}

// ── Page 1: cover ────────────────────────────────────────────────
function cover(doc, { firstName, priorityP, date }) {
  doc.y = 150;
  label(doc, 'Your 4Ps report');
  h1(doc, 'The 4Ps of Leadership', 34);
  doc.font(F.spoken).fontSize(14).fillColor(MUTED).text('The spark to ignite your team.', LEFT, doc.y, { width: WIDTH });
  doc.moveDown(2);
  if (priorityP) {
    panel(doc, { fill: ACCENT_SOFT, lab: 'Your priority', heading: priorityP.name, text: priorityP.question });
  }
  doc.moveDown(1);
  doc.font(F.sans).fontSize(11).fillColor(INK_2).text('Prepared for ', LEFT, doc.y, { continued: true })
    .font(F.bold).fillColor(INK).text(titleCase(firstName) || 'you');
  doc.font(F.sans).fontSize(9.5).fillColor(MUTED).text(longDate(date), LEFT, doc.y + 2);
  doc.moveDown(0.4);
  doc.font(F.sans).fontSize(9.5).fillColor(MUTED).text('Jim Harvey · The Message Business', LEFT, doc.y);
}

// ── Page 2: the four scores ──────────────────────────────────────
function dashboard(doc, scores) {
  doc.y = 80;
  label(doc, 'Opening summary');
  h1(doc, 'Your team, at a glance.');
  doc.font(F.sans).fontSize(11).fillColor(INK_2).text(
    'Your scores across the four elements every team needs to perform at its best. Your priority is the first P, counting up from the foundation, that is not holding.',
    LEFT, doc.y, { width: WIDTH, lineGap: 3.5 });
  doc.moveDown(1.4);

  PS.forEach(p => {
    const score = scores.pScores[p.key];
    const band = scoreToBand(score);
    const isPriority = scores.priority_p === p.key;
    const pad = 16;
    const h = 86;
    const y0 = doc.y;
    doc.roundedRect(LEFT, y0, WIDTH, h, 10).lineWidth(isPriority ? 1.4 : 0.8).strokeColor(isPriority ? INK : RULE).stroke();
    dot(doc, LEFT + pad + 3.5, y0 + pad + 9, p.colour);
    doc.font(F.bold).fontSize(15).fillColor(INK).text(p.name, LEFT + pad + 14, y0 + pad, { lineBreak: false });
    if (isPriority) {
      const nameW = doc.widthOfString(p.name);
      doc.font(F.bold).fontSize(9).fillColor(ACCENT).text('Priority', LEFT + pad + 14 + nameW + 10, y0 + pad + 5, { lineBreak: false });
    }
    doc.font(F.bold).fontSize(22).fillColor(INK).text(String(score), LEFT, y0 + pad - 4, { width: WIDTH - pad, align: 'right', lineBreak: false });
    const barY = y0 + pad + 30;
    doc.roundedRect(LEFT + pad, barY, WIDTH - pad * 2, 6, 3).fillColor(SUNK).fill();
    doc.roundedRect(LEFT + pad, barY, Math.max(6, (WIDTH - pad * 2) * score / 100), 6, 3).fillColor(isPriority ? ACCENT : INK).fill();
    doc.font(F.sans).fontSize(9.5).fillColor(INK_2).text(band, LEFT + pad, barY + 16, { lineBreak: false });
    doc.font(F.sans).fontSize(9).fillColor(MUTED).text(p.elements.map(el => el.name).join(' · '), LEFT, barY + 16, { width: WIDTH - pad, align: 'right', lineBreak: false });
    doc.y = y0 + h + 10;
  });

  doc.moveDown(0.8);
  doc.font(F.sans).fontSize(9).fillColor(MUTED).text(
    'Scores run from 0 to 100: the mean of three statements per element and three elements per P. Bands: 0 to 39 not yet present, 40 to 59 inconsistent, 60 to 74 broadly present, 75 to 89 strong, 90 to 100 exemplary.',
    LEFT, doc.y, { width: WIDTH, lineGap: 2.5 });
}

// ── Page 3: the priority P ───────────────────────────────────────
function priority(doc, { priorityP, narrative, score }) {
  if (!priorityP || !narrative) return;
  doc.y = 80;
  label(doc, `Your priority · ${priorityP.name}`, ACCENT);
  h1(doc, narrative.headline);
  doc.font(F.spoken).fontSize(13).fillColor(MUTED).text(priorityP.question, LEFT, doc.y, { width: WIDTH });
  doc.moveDown(1.2);
  const y0 = doc.y;
  doc.font(F.bold).fontSize(9).fillColor(MUTED).text('Your score', LEFT, y0);
  doc.font(F.bold).fontSize(30).fillColor(ACCENT).text(String(score), LEFT, y0 + 13);
  doc.font(F.bold).fontSize(9).fillColor(MUTED).text('Band', LEFT + 110, y0);
  doc.font(F.sans).fontSize(16).fillColor(INK).text(scoreToBand(score), LEFT + 110, y0 + 20);
  doc.y = y0 + 58;
  rule(doc);
  narrative.bodyParas.forEach(para => {
    doc.font(F.spoken).fontSize(12).fillColor(INK).text(para, LEFT, doc.y, { width: WIDTH, lineGap: 4.5 });
    doc.moveDown(0.8);
  });
}

// ── Page 4: one move this week ───────────────────────────────────
function oneMove(doc, { driverEl, move, tool, link }) {
  doc.y = 80;
  label(doc, 'One move this week');
  h1(doc, 'Start here.');
  doc.font(F.spoken).fontSize(13).fillColor(MUTED).text('The single move most likely to shift your priority, from the driver that needs it most.', LEFT, doc.y, { width: WIDTH });
  doc.moveDown(1.4);
  if (driverEl) {
    label(doc, `Driver ${driverEl.driverCode}`);
    doc.font(F.bold).fontSize(17).fillColor(INK).text(driverEl.driverName, LEFT, doc.y, { width: WIDTH });
    doc.moveDown(0.8);
  }
  if (move) panel(doc, { fill: ACCENT_SOFT, text: move.move, spoken: true });

  if (tool) {
    doc.moveDown(0.6);
    label(doc, 'The tool for this work');
    doc.font(F.sans).fontSize(11).fillColor(INK_2).text(`${tool.name} helps you do this work with your team.`, LEFT, doc.y, { width: WIDTH });
    doc.font(F.bold).fontSize(11).fillColor(ACCENT).text(tool.url.replace('https://', ''), LEFT, doc.y + 2, { width: WIDTH, link: tool.url });
    doc.moveDown(1);
  }
  if (link) {
    label(doc, 'Come back to this report');
    doc.font(F.sans).fontSize(11).fillColor(INK_2).text('Your report stays online at this address.', LEFT, doc.y, { width: WIDTH });
    doc.font(F.bold).fontSize(10).fillColor(ACCENT).text(link.replace('https://', ''), LEFT, doc.y + 2, { width: WIDTH, link });
  }
}

// ── Frame on every page: accent line, mark, footer links, copyright ──
function stamp(doc) {
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    const oldBottom = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;
    doc.rect(0, 0, 595.28, 3).fillColor(ACCENT).fill();
    drawMark(doc, LEFT, 22, 16);
    doc.font(F.bold).fontSize(9).fillColor(INK).text('The 4Ps diagnostic', LEFT + 22, 25.5, { width: 200, lineBreak: false });
    doc.font(F.sans).fontSize(8.5).fillColor(MUTED).text('Management Ignition', LEFT, 26, { width: WIDTH, align: 'right', lineBreak: false });
    const miW = doc.widthOfString('Management Ignition');
    doc.link(RIGHT - miW, 24, miW, 12, SITE_URL);
    doc.moveTo(LEFT, 46).lineTo(RIGHT, 46).lineWidth(0.5).strokeColor(RULE).stroke();

    // footer: the same links as the web pages, then copyright and page number
    doc.moveTo(LEFT, 784).lineTo(RIGHT, 784).lineWidth(0.5).strokeColor(RULE).stroke();
    doc.font(F.sans).fontSize(8);
    let x = LEFT;
    FOOTER_LINKS.forEach((l, n) => {
      if (n) {
        doc.fillColor(MUTED).text('·', x, 792, { lineBreak: false });
        x += doc.widthOfString('·') + 6;
      }
      const w = doc.widthOfString(l.label);
      doc.fillColor(INK_2).text(l.label, x, 792, { width: w + 2, lineBreak: false });
      doc.link(x, 790, w, 12, l.url);
      x += w + 6;
    });
    doc.fillColor(MUTED).text(`Page ${i - range.start + 1} of ${range.count}`, LEFT, 792, { width: WIDTH, align: 'right', lineBreak: false });
    doc.fontSize(7.5).fillColor(MUTED).text(COPYRIGHT, LEFT, 806, { width: WIDTH, lineBreak: false });
    doc.page.margins.bottom = oldBottom;
  }
}

// Build the PDF and resolve with a Buffer. Rejects if rendering fails,
// so a caller can never hand over or attach a half-made file.
export function buildReportPdf({ firstName, scores, date, id }) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 64, bottom: 56, left: LEFT, right: 56 },
        bufferPages: true,
        info: { Title: `The 4Ps report${firstName ? ': ' + titleCase(firstName) : ''}`, Author: 'Jim Harvey | The Message Business' },
      });
      if (FONT_DATA) {
        doc.registerFont('Sans', FONT_DATA.sans);
        doc.registerFont('SansBold', FONT_DATA.bold);
        doc.registerFont('Spoken', FONT_DATA.spoken);
      }
      const chunks = [];
      doc.on('data', c => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const priorityP = PS.find(p => p.key === scores.priority_p);
      const driverEl = priorityP?.elements.find(el => el.code === scores.priority_driver);

      cover(doc, { firstName, priorityP, date });
      doc.addPage();
      dashboard(doc, scores);
      doc.addPage();
      priority(doc, { priorityP, narrative: P_NARRATIVES[scores.priority_p], score: scores.pScores[scores.priority_p] });
      doc.addPage();
      oneMove(doc, {
        driverEl,
        move: DRIVER_MOVES[scores.priority_driver],
        tool: TOOL_FOR_P[scores.priority_p],
        link: id ? reportLink(id) : null,
      });
      stamp(doc);
      doc.end();
    } catch (e) {
      reject(e);
    }
  });
}
