// =====================================================================
// FREE REPORT
// Four inline pages, rendered after submission.
//   1. Cover         — title + priority P named
//   2. Dashboard     — all four P scores with bands
//   3. Priority P    — plain-words narrative
//   4. One Move      — the highest-leverage move for the priority driver
//                       + CTA to the Pro report
// =====================================================================

import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDiagnostic } from '../lib/diagnosticState';
import { PS } from '../lib/questionBank';
import { scoreToBand } from '../lib/scoringEngine';
import { P_NARRATIVES, DRIVER_MOVES, TOOL_FOR_P } from '../lib/reportContent';

export default function Report() {
  const navigate = useNavigate();
  const { state, reset } = useDiagnostic();

  useEffect(() => {
    if (!state.submitted || !state.scores) {
      navigate('/');
    }
  }, [state.submitted, state.scores, navigate]);

  if (!state.scores) return null;

  const scores       = state.scores;
  const priorityKey  = scores.priority_p;
  const priorityP    = PS.find(p => p.key === priorityKey);
  const narrative    = P_NARRATIVES[priorityKey];
  const driverCode   = scores.priority_driver;
  const driverEl     = priorityP?.elements.find(el => el.code === driverCode);
  const move         = DRIVER_MOVES[driverCode];
  const tool         = TOOL_FOR_P[priorityKey];

  return (
    <div className="min-h-screen bg-ink-50 text-ink-700">
      <header className="bg-white border-b border-ink-200 print:hidden">
        <div className="container-reading py-4 flex items-center justify-between">
          <div className="font-sans text-xs text-ink-500">
            Your Report · {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <button
            onClick={() => window.print()}
            className="font-sans text-xs text-ink-500 hover:text-ink-900"
          >
            Print or save as PDF
          </button>
        </div>
      </header>

      <main className="py-10 sm:py-16">
        <ReportPage>
          <CoverPage firstName={state.first_name} priorityP={priorityP} />
        </ReportPage>
        <ReportPage>
          <DashboardPage scores={scores} />
        </ReportPage>
        <ReportPage>
          <PriorityPage priorityP={priorityP} narrative={narrative} score={scores.pScores[priorityKey]} band={scoreToBand(scores.pScores[priorityKey])} />
        </ReportPage>
        <ReportPage>
          <OneMovePage priorityP={priorityP} driverEl={driverEl} move={move} tool={tool} />
        </ReportPage>

        <div className="text-center mt-8 mb-4 print:hidden">
          <Link
            to="/"
            onClick={() => { setTimeout(reset, 100); }}
            className="font-sans text-xs text-ink-500 hover:text-ink-900"
          >
            ← Back to start
          </Link>
        </div>
      </main>

      <PrintStyles />
    </div>
  );
}

// ---------------------------------------------------------------------
// Layout — one report "page" per ReportPage block.
// ---------------------------------------------------------------------
function ReportPage({ children }) {
  return (
    <section className="report-page bg-white max-w-reading mx-auto mb-8 shadow-sm border border-ink-200 px-8 sm:px-14 py-12 sm:py-16">
      {children}
    </section>
  );
}

// ---------------------------------------------------------------------
// PAGE 1 — COVER
// ---------------------------------------------------------------------
function CoverPage({ firstName, priorityP }) {
  return (
    <div className="text-center min-h-[28rem] flex flex-col justify-center">
      <div className="eyebrow mb-6">Your 4Ps report</div>
      <h1 className="font-serif font-semibold text-5xl sm:text-6xl text-ink-900 leading-[1.05] mb-6">
        The 4Ps of<br/>Leadership
      </h1>
      <p className="font-serif italic text-xl text-ink-500 mb-12">
        The spark to ignite your team.
      </p>

      <div className="border-t border-b border-ink-200 py-8 max-w-md mx-auto">
        <div className="eyebrow text-ink-500 mb-3">Your priority</div>
        <p
          className="font-serif font-semibold text-4xl"
          style={{ color: priorityP?.colour || '#1A1A1A' }}
        >
          {priorityP?.name || ''}
        </p>
        <p className="font-serif italic text-ink-500 mt-3">
          {priorityP?.question || ''}
        </p>
      </div>

      <p className="font-serif text-ink-600 mt-12">
        Prepared for <span className="font-semibold text-ink-900">{firstName || 'you'}</span>
      </p>
      <p className="font-sans text-xs text-ink-500 mt-6">
        Jim Harvey · The Message Business
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------
// PAGE 2 — DASHBOARD
// ---------------------------------------------------------------------
function DashboardPage({ scores }) {
  return (
    <div>
      <div className="eyebrow mb-4">Opening summary</div>
      <h2 className="font-serif font-semibold text-3xl sm:text-4xl text-ink-900 leading-tight mb-6">
        Your team, at a glance.
      </h2>
      <p className="text-lg text-ink-600 leading-relaxed mb-10">
        Your scores across the four conditions every team has to hold to perform at its best. The lowest P, after the framework's stack logic, is your priority.
      </p>

      <div className="space-y-5">
        {PS.map(p => {
          const score = scores.pScores[p.key];
          const band  = scoreToBand(score);
          const isPriority = scores.priority_p === p.key;
          return (
            <PBar
              key={p.key}
              p={p}
              score={score}
              band={band}
              isPriority={isPriority}
            />
          );
        })}
      </div>

      <div className="mt-12 pt-6 border-t border-ink-200">
        <p className="font-serif italic text-ink-500 text-sm leading-relaxed">
          Scores are 0–100, the mean of three items per element and three elements per P. Bands: 0–39 Not yet present · 40–59 Inconsistent · 60–74 Broadly present · 75–89 Strong · 90–100 Exemplary.
        </p>
      </div>
    </div>
  );
}

function PBar({ p, score, band, isPriority }) {
  const pct = Math.max(2, score);
  return (
    <div className={`p-5 border ${isPriority ? 'border-ink-900' : 'border-ink-200'}`}>
      <div className="flex items-baseline justify-between mb-3">
        <div className="flex items-baseline gap-3">
          <div
            className="font-sans text-xs font-bold text-white px-2 py-1 tracking-wider"
            style={{ backgroundColor: p.colour }}
          >
            {p.code}
          </div>
          <h3 className="font-serif text-2xl font-semibold text-ink-900">{p.name}</h3>
          {isPriority && (
            <span className="font-sans text-xs text-ink-900 font-bold">
              · Priority
            </span>
          )}
        </div>
        <div className="text-right">
          <div className="font-serif text-3xl font-semibold text-ink-900">{score}</div>
        </div>
      </div>
      <div className="w-full h-2 bg-ink-100 mb-2">
        <div
          className="h-2 transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: p.colour }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="font-sans italic text-sm text-ink-500">{band}</span>
        <span className="font-sans text-xs text-ink-400 italic">
          {p.elements.map(el => el.name).join(' · ')}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// PAGE 3 — PRIORITY P NARRATIVE
// ---------------------------------------------------------------------
function PriorityPage({ priorityP, narrative, score, band }) {
  if (!priorityP || !narrative) return null;
  return (
    <div>
      <div className="eyebrow mb-4" style={{ color: priorityP.colour }}>
        ● Your priority · {priorityP.code} · {priorityP.name}
      </div>
      <h2 className="font-serif font-semibold text-3xl sm:text-4xl text-ink-900 leading-tight mb-3">
        {narrative.headline}
      </h2>
      <p className="font-serif italic text-lg text-ink-500 mb-8">
        {priorityP.question}
      </p>

      <div className="flex items-baseline gap-6 mb-10 pb-6 border-b border-ink-200">
        <div>
          <div className="eyebrow text-ink-500 mb-1">Your score</div>
          <div
            className="font-serif text-5xl font-semibold"
            style={{ color: priorityP.colour }}
          >
            {score}
          </div>
        </div>
        <div>
          <div className="eyebrow text-ink-500 mb-1">BAND</div>
          <div className="font-serif italic text-2xl text-ink-700">{band}</div>
        </div>
      </div>

      <div className="space-y-5">
        {narrative.bodyParas.map((para, i) => (
          <p key={i} className="font-serif text-lg text-ink-700 leading-relaxed">
            {para}
          </p>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// PAGE 4 — ONE MOVE + PRO REPORT CTA
// ---------------------------------------------------------------------
function OneMovePage({ priorityP, driverEl, move, tool }) {
  return (
    <div>
      <div className="eyebrow mb-4">One move this week</div>
      <h2 className="font-serif font-semibold text-3xl sm:text-4xl text-ink-900 leading-tight mb-3">
        Start here.
      </h2>
      <p className="font-serif italic text-lg text-ink-500 mb-10">
        The single highest-leverage development action from your priority driver.
      </p>

      {driverEl && (
        <div
          className="border-l-4 pl-6 py-3 mb-8"
          style={{ borderColor: priorityP?.colour || '#1A1A1A' }}
        >
          <div className="eyebrow text-ink-500 mb-2">DRIVER {driverEl.driverCode}</div>
          <h3 className="font-serif text-2xl font-semibold text-ink-900">
            {driverEl.driverName}
          </h3>
        </div>
      )}

      {move && (
        <div className="bg-ink-100 p-6 sm:p-8 mb-12">
          <p className="font-serif text-lg text-ink-700 leading-relaxed">
            {move.move}
          </p>
        </div>
      )}

      <div className="pt-8 border-t border-ink-200">
        <div className="eyebrow mb-3">The full Pro report</div>
        <h3 className="font-serif font-semibold text-2xl sm:text-3xl text-ink-900 leading-tight mb-4">
          The complete picture, with the four-week plan.
        </h3>
        <p className="font-serif text-ink-600 leading-relaxed mb-6 max-w-prose">
          The Pro report adds the full twelve-driver breakdown, the strengths to build on, a four-week development plan you can run alongside your normal work, and direct routing into the Management Ignition tool that addresses your priority.
        </p>
        <ul className="font-serif text-ink-600 leading-relaxed mb-8 space-y-2 max-w-prose">
          <li>· The full twelve-driver breakdown across all four Ps</li>
          <li>· Two more development moves tailored to your priority P</li>
          <li>· Your two strongest drivers and how to use them as anchors</li>
          <li>· A four-week plan with weekly milestones</li>
          {tool && (
            <li>
              · Routing into <span className="font-semibold">{tool.name}</span>, the working layer for your priority
            </li>
          )}
        </ul>
        <button
          disabled
          className="btn-primary opacity-40 cursor-not-allowed"
          title="Coming soon"
        >
          Get the Pro report: coming soon
        </button>
        <p className="font-sans text-xs text-ink-500 mt-3 italic">
          Pro report ships in Phase 2. Watch your inbox for the launch.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// PRINT STYLES — each report page on its own page
// ---------------------------------------------------------------------
function PrintStyles() {
  return (
    <style>{`
      @media print {
        body { background: white !important; }
        .report-page {
          box-shadow: none !important;
          border: none !important;
          margin: 0 !important;
          padding: 1.5cm !important;
          page-break-after: always;
        }
        .report-page:last-child {
          page-break-after: auto;
        }
      }
    `}</style>
  );
}
