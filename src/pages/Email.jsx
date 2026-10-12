// =====================================================================
// EMAIL CAPTURE PAGE
// Single screen between the diagnostic and the report.
// Captures first name, and email only for those who join the mailing list.
// On submit, POSTs to /api/submit which:
//   1. Computes scores server-side
//   2. Writes to Supabase via the service_role key
//   3. Syncs to Mailchimp with tag 4p-diagnostic-free, if they opted in
//   5. Returns scores for inline rendering
// =====================================================================

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDiagnostic } from '../lib/diagnosticState';
import Footer from '../components/Footer';
import { isComplete } from '../lib/scoringEngine';

export default function Email() {
  const navigate = useNavigate();
  const { state, setEmail, setFirstName, setConsent, setSubmitted } = useDiagnostic();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Guard: if the diagnostic was not completed, send the user back.
  useEffect(() => {
    if (!isComplete(state.answers)) {
      navigate('/diagnostic');
    }
  }, [state.answers, navigate]);

  // First name is all we need. Email only if they want to join the mailing list.
  const emailOk = /\S+@\S+\.\S+/.test(state.email.trim());
  const canSubmit =
    state.first_name.trim().length >= 1 &&
    (!state.marketing_consent || emailOk);

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: state.context,
          answers: state.answers,
          email: state.marketing_consent ? state.email.trim() : '',
          first_name: state.first_name.trim(),
          marketing_consent: state.marketing_consent,
        }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => 'Server error');
        throw new Error(errText || `Submission failed (${res.status})`);
      }

      const data = await res.json();
      setSubmitted(data.responseId, data.scores);
      navigate(`/report/${data.responseId}`);
    } catch (e) {
      console.error('[email] submission failed', e);
      setError('Something went wrong submitting your responses. Please try again in a moment.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-ink-700">
      <header className="border-b border-ink-200">
        <div className="container-reading py-4 flex items-center justify-between">
          <Link to="/diagnostic" className="font-sans text-xs text-ink-500 hover:text-ink-900">
            ← Back to diagnostic
          </Link>
          <div className="font-sans text-xs text-ink-500">
            Almost done
          </div>
        </div>
      </header>

      <main className="container-reading py-20 sm:py-28">
        <div className="eyebrow mb-6">Your report is ready</div>
        <h1 className="font-serif font-semibold text-4xl sm:text-5xl text-ink-900 leading-tight mb-6">
          Who is it for?
        </h1>
        <p className="text-lg text-ink-600 leading-relaxed max-w-prose mb-12">
          Your four-page report appears on the next screen. You can read it there, download it as a PDF, and come back to it at the same address.
        </p>

        <div className="max-w-prose space-y-8">
          <div>
            <label htmlFor="first_name" className="block font-sans text-xs text-ink-500 mb-3">
              First name
            </label>
            <input
              id="first_name"
              type="text"
              autoComplete="given-name"
              value={state.first_name}
              onChange={e => setFirstName(e.target.value)}
              className="w-full px-4 py-3 border border-ink-300 rounded-[10px] focus:border-ink-900 focus:outline-none font-sans text-lg"
              placeholder="Jim"
            />
          </div>

          <div className="bg-ink-50 border border-ink-200 rounded-[12px] p-5">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={state.marketing_consent}
                onChange={e => setConsent(e.target.checked)}
                className="mt-1.5 w-4 h-4 accent-ink-900"
              />
              <div>
                <p className="font-sans text-base text-ink-700 leading-relaxed">
                  Add me to the Management Ignition mailing list.
                </p>
                <p className="font-sans text-xs text-ink-500 mt-2 leading-relaxed">
                  Occasional notes from Jim Harvey on team leadership, the Management Ignition tools, and new diagnostic releases. Unsubscribe any time.
                </p>
              </div>
            </label>
            {state.marketing_consent && (
              <div className="mt-5">
                <label htmlFor="email" className="block font-sans text-xs text-ink-500 mb-3">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={state.email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-ink-300 rounded-[10px] focus:border-ink-900 focus:outline-none font-sans text-lg"
                  placeholder="you@example.com"
                />
              </div>
            )}
          </div>

          {error && (
            <div className="border border-pride bg-orange-50 rounded-[10px] p-4">
              <p className="font-sans text-sm text-ink-700">{error}</p>
            </div>
          )}

          <div className="pt-4">
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {submitting ? 'Building your report…' : 'Show my report →'}
            </button>
            <p className="mt-4 font-sans text-xs text-ink-500 leading-relaxed max-w-prose">
              Honest answers produce a useful report. Inflated answers produce one you will not learn from.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
