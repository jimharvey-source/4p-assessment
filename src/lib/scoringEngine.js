// =====================================================================
// SCORING ENGINE
// The Four Ps Team Diagnostic v1.0
//
// Pure functions, no React, no I/O. Same code runs in the browser
// (for the inline free report) and in the Vercel serverless function
// (for the persisted Supabase write).
//
// Specification source: Four_Ps_Team_Diagnostic_v1.docx, Part Three.
// =====================================================================

import { SCALE, BAND_LABELS, PS, ALL_ITEMS } from './questionBank.js';

// ---------------------------------------------------------------------
// 1. RESPONSE -> SCORE
// ---------------------------------------------------------------------
// Map a single Likert response (1-5) to its 0-100 score.

export function responseToScore(response) {
  return SCALE.toScore[response] ?? null;
}

// ---------------------------------------------------------------------
// 2. ELEMENT SCORES
// ---------------------------------------------------------------------
// Each element has 3 items. Element score = mean of the 3 item scores.
// Returns an object keyed by element code: { '1.1': 67, '1.2': 50, ... }

export function computeElementScores(answers) {
  const scores = {};
  for (const p of PS) {
    for (const el of p.elements) {
      const itemScores = el.items
        .map(it => responseToScore(answers[it.code]))
        .filter(s => s !== null);
      if (itemScores.length === 0) {
        scores[el.code] = null;
      } else {
        const mean = itemScores.reduce((a, b) => a + b, 0) / itemScores.length;
        scores[el.code] = Math.round(mean);
      }
    }
  }
  return scores;
}

// ---------------------------------------------------------------------
// 3. P SCORES
// ---------------------------------------------------------------------
// Each P aggregates from its 3 elements.
// Returns { purpose: 64, plan: 53, people: 64, pride: 44 }

export function computePScores(elementScores) {
  const scores = {};
  for (const p of PS) {
    const elementCodes = p.elements.map(el => el.code);
    const vals = elementCodes
      .map(c => elementScores[c])
      .filter(v => v !== null && v !== undefined);
    if (vals.length === 0) {
      scores[p.key] = null;
    } else {
      const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
      scores[p.key] = Math.round(mean);
    }
  }
  return scores;
}

// ---------------------------------------------------------------------
// 4. BAND ASSIGNMENT
// ---------------------------------------------------------------------

export function scoreToBand(score) {
  if (score === null || score === undefined) return null;
  const b = BAND_LABELS.find(b => score >= b.min && score <= b.max);
  return b ? b.label : null;
}

// ---------------------------------------------------------------------
// 5. PRIORITY P LOGIC
// ---------------------------------------------------------------------
// Spec rules (in order):
//
//   Rule 1 — FOUNDATION
//     If any P scores below 40, the HIGHEST such P (highest in the
//     stack: purpose > plan > people > pride) is the priority.
//
//   Rule 2 — FIRST WEAK IN STACK
//     Else if any P scores below 50, the HIGHEST such P is the priority.
//
//   Rule 3 — LOWEST ABOVE 50
//     Else the LOWEST-scoring P is the priority.
//
//   Rule 4 — TIES
//     Within any rule, the higher P in the stack wins.
//     (purpose > plan > people > pride)
//
// Returns { priority_p, priority_rule, priority_driver }
// priority_driver is the lowest-scoring element within the priority P.

const STACK_ORDER = ['purpose', 'plan', 'people', 'pride'];

export function computePriority(pScores, elementScores) {
  const ordered = STACK_ORDER.map(key => ({ key, score: pScores[key] }));

  // Rule 1 — foundation
  const foundationCandidates = ordered.filter(p => p.score !== null && p.score < 40);
  if (foundationCandidates.length > 0) {
    const priority = foundationCandidates[0]; // highest in stack
    return finishPriority(priority.key, 'foundation', elementScores);
  }

  // Rule 2 — first weak in stack
  const weakCandidates = ordered.filter(p => p.score !== null && p.score < 50);
  if (weakCandidates.length > 0) {
    const priority = weakCandidates[0]; // highest in stack
    return finishPriority(priority.key, 'first_weak_in_stack', elementScores);
  }

  // Rule 3 — lowest above 50
  // Among Ps with valid scores, find the lowest. Rule 4 tiebreak: higher in stack wins.
  const valid = ordered.filter(p => p.score !== null);
  if (valid.length === 0) return { priority_p: null, priority_rule: null, priority_driver: null };
  let lowest = valid[0];
  for (const p of valid) {
    if (p.score < lowest.score) lowest = p;
    // ties: stack order already favours the higher one (we iterate in stack order)
  }
  return finishPriority(lowest.key, 'lowest_above_50', elementScores);
}

// Given the priority P key, find the lowest-scoring element within it.
// Returns the element code (which equals the driver code).
function finishPriority(pKey, rule, elementScores) {
  const p = PS.find(p => p.key === pKey);
  if (!p) return { priority_p: pKey, priority_rule: rule, priority_driver: null };
  const elements = p.elements
    .map(el => ({ code: el.code, score: elementScores[el.code] }))
    .filter(e => e.score !== null && e.score !== undefined);
  if (elements.length === 0) {
    return { priority_p: pKey, priority_rule: rule, priority_driver: null };
  }
  // lowest score; on ties, the first in element order wins (stable preference)
  let lowest = elements[0];
  for (const e of elements) {
    if (e.score < lowest.score) lowest = e;
  }
  return { priority_p: pKey, priority_rule: rule, priority_driver: lowest.code };
}

// ---------------------------------------------------------------------
// 6. MASTER COMPUTE
// ---------------------------------------------------------------------
// One call. Takes the raw answers map and returns everything the
// report and the Supabase write need.

export function scoreResponses(answers) {
  const elementScores = computeElementScores(answers);
  const pScores       = computePScores(elementScores);
  const priority      = computePriority(pScores, elementScores);

  return {
    elementScores,           // { '1.1': 67, '1.2': 50, ... }
    pScores,                 // { purpose: 64, plan: 53, people: 64, pride: 44 }
    bands: {
      purpose: scoreToBand(pScores.purpose),
      plan:    scoreToBand(pScores.plan),
      people:  scoreToBand(pScores.people),
      pride:   scoreToBand(pScores.pride),
    },
    ...priority,             // priority_p, priority_rule, priority_driver
  };
}

// ---------------------------------------------------------------------
// 7. COMPLETENESS CHECK
// ---------------------------------------------------------------------
// Used by the diagnostic flow to gate the email step.

export function isComplete(answers) {
  return ALL_ITEMS.every(it => {
    const v = answers[it.code];
    return v !== null && v !== undefined && v >= 1 && v <= 5;
  });
}

// ---------------------------------------------------------------------
// 8. SUPABASE PAYLOAD SHAPER
// ---------------------------------------------------------------------
// Convert score output into the column shape the Supabase table expects.

export function toSupabasePayload(scores) {
  const { elementScores, pScores, priority_p, priority_rule, priority_driver } = scores;
  return {
    el_vision:      elementScores['1.1'],
    el_goals:       elementScores['1.2'],
    el_measures:    elementScores['1.3'],
    el_process:     elementScores['2.1'],
    el_roles:       elementScores['2.2'],
    el_authority:   elementScores['2.3'],
    el_standards:   elementScores['3.1'],
    el_trust:       elementScores['3.2'],
    el_feedback:    elementScores['3.3'],
    el_proactivity: elementScores['4.1'],
    el_energy:      elementScores['4.2'],
    el_recognition: elementScores['4.3'],
    p_purpose:      pScores.purpose,
    p_plan:         pScores.plan,
    p_people:       pScores.people,
    p_pride:        pScores.pride,
    priority_p,
    priority_rule,
    priority_driver,
  };
}
