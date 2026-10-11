// =====================================================================
// DIAGNOSTIC FLOW STATE
// One React context that holds the entire flow's data across pages.
//
// State persists in sessionStorage so a refresh does not lose progress.
// Cleared after submission. No PII stored in localStorage.
// =====================================================================

import { createContext, useContext, useEffect, useState } from 'react';

const KEY = '4p-diagnostic-session-v1';

const DEFAULT_STATE = {
  context: {
    team_size: null,
    tenure:    null,
    pressure:  null,
    team_type: null,
  },
  answers: {},      // keyed by item code: { '1.1.a': 4, '1.1.b': 5, ... }
  email:   '',
  first_name: '',
  marketing_consent: false,
  submitted: false,
  responseId: null,
  scores: null,     // populated after submission
  emailed: null,    // true when /api/submit confirmed the email went
};

const Ctx = createContext(null);

export function DiagnosticProvider({ children }) {
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_STATE;
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
    } catch (_e) { /* ignore */ }
    return DEFAULT_STATE;
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(state));
    } catch (_e) { /* ignore quota or private mode errors */ }
  }, [state]);

  const setContext = (field, value) => {
    setState(s => ({ ...s, context: { ...s.context, [field]: value } }));
  };

  const setAnswer = (code, value) => {
    setState(s => ({ ...s, answers: { ...s.answers, [code]: value } }));
  };

  const setEmail = (email) => setState(s => ({ ...s, email }));
  const setFirstName = (first_name) => setState(s => ({ ...s, first_name }));
  const setConsent = (marketing_consent) => setState(s => ({ ...s, marketing_consent }));
  const setSubmitted = (responseId, scores, emailed) => setState(s => ({ ...s, submitted: true, responseId, scores, emailed: emailed === true }));

  const reset = () => {
    setState(DEFAULT_STATE);
    try { sessionStorage.removeItem(KEY); } catch (_e) { /* ignore */ }
  };

  return (
    <Ctx.Provider value={{
      state,
      setContext, setAnswer, setEmail, setFirstName, setConsent,
      setSubmitted, reset,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useDiagnostic() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useDiagnostic must be used inside DiagnosticProvider');
  return ctx;
}
