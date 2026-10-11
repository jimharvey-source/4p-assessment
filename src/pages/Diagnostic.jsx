// =====================================================================
// DIAGNOSTIC FLOW
// One page that hosts the entire diagnostic, using internal step state.
// Step 0: Context (C1-C4)
// Steps 1-4: One P per step, 9 items each, grouped by element
// On completion: navigates to /email
// =====================================================================

import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDiagnostic } from '../lib/diagnosticState';
import { CONTEXT_QUESTIONS, PS, SCALE } from '../lib/questionBank';

const TOTAL_STEPS = 5; // context + 4 Ps

export default function Diagnostic() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { state, setContext, setAnswer } = useDiagnostic();

  const totalProgress = useMemo(() => {
    const contextDone = CONTEXT_QUESTIONS.every(q => state.context[q.field]);
    const itemsAnswered = Object.values(state.answers).filter(v => v >= 1 && v <= 5).length;
    const totalItems = 36;
    const itemFraction = itemsAnswered / totalItems;
    return Math.round((contextDone ? 10 : 0) + (itemFraction * 90));
  }, [state.context, state.answers]);

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      navigate('/email');
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="min-h-screen bg-white text-ink-700">
      <header className="border-b border-ink-200 sticky top-0 bg-white z-10">
        <div className="container-reading py-4">
          <div className="flex items-center justify-between mb-3">
            <Link to="/" className="font-sans text-xs text-ink-500 hover:text-ink-900">
              ← Back to start
            </Link>
            <div className="font-sans text-xs text-ink-500">
              {step === 0 ? 'Context' : `${PS[step - 1].name} · Step ${step} of 4`}
            </div>
          </div>
          <div className="w-full h-1 bg-ink-200">
            <div
              className="h-1 bg-ink-900 transition-all duration-300"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
        </div>
      </header>

      <main className="container-reading py-12 sm:py-16">
        {step === 0 && <ContextStep context={state.context} setContext={setContext} />}
        {step >= 1 && step <= 4 && (
          <PStep
            p={PS[step - 1]}
            answers={state.answers}
            setAnswer={setAnswer}
          />
        )}

        <div className="mt-16 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="font-sans text-sm text-ink-500 hover:text-ink-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors tracking-wider"
          >
            ← Previous
          </button>
          <NextButton
            step={step}
            context={state.context}
            answers={state.answers}
            onClick={handleNext}
          />
        </div>
      </main>
    </div>
  );
}

function ContextStep({ context, setContext }) {
  return (
    <div>
      <div className="eyebrow mb-6">Part one of two: context</div>
      <h1 className="font-serif font-semibold text-4xl sm:text-5xl text-ink-900 leading-tight mb-6">
        First, a little context.
      </h1>
      <p className="text-lg text-ink-600 leading-relaxed max-w-prose mb-12">
        Four short questions about your team. They shape the language of the report so the recommendations land in terms that fit your situation.
      </p>

      <div className="space-y-12">
        {CONTEXT_QUESTIONS.map(q => (
          <ContextQuestion
            key={q.code}
            q={q}
            value={context[q.field]}
            onChange={v => setContext(q.field, v)}
          />
        ))}
      </div>
    </div>
  );
}

function ContextQuestion({ q, value, onChange }) {
  return (
    <div>
      <div className="font-sans text-xs text-ink-400 mb-2">{q.code}</div>
      <h2 className="font-serif text-2xl font-semibold text-ink-900 mb-6 leading-tight">
        {q.question}
      </h2>
      <div className="space-y-3">
        {q.options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`block w-full text-left px-5 py-3 border transition-all ${
              value === opt.value
                ? 'border-ink-900 bg-ink-900 text-white'
                : 'border-ink-200 bg-white text-ink-700 hover:border-ink-400'
            }`}
          >
            <span className="font-serif text-base">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function PStep({ p, answers, setAnswer }) {
  return (
    <div>
      <div className="eyebrow mb-4">
        <span style={{ color: p.colour }}>● </span>
        {p.code} · {p.name.toUpperCase()}
      </div>
      <h1 className="font-serif italic text-3xl sm:text-4xl text-ink-900 leading-tight mb-6 max-w-prose">
        {p.question}
      </h1>
      <p className="text-lg text-ink-600 leading-relaxed max-w-prose mb-12">
        Nine statements about your team, grouped under the three elements of {p.name}. Rate each one on the five-point scale.
      </p>

      <div className="space-y-12">
        {p.elements.map(el => (
          <div key={el.code}>
            <div className="flex items-baseline gap-3 mb-6 pb-3 border-b border-ink-200">
              <div
                className="font-sans text-xs font-bold text-white px-2 py-1 tracking-wider"
                style={{ backgroundColor: p.colour }}
              >
                {el.code}
              </div>
              <h2 className="font-serif text-xl font-semibold text-ink-900">{el.name}</h2>
              <span className="font-sans text-xs text-ink-500 italic ml-2 hidden sm:inline">
                Driver {el.driverCode}: {el.driverName}
              </span>
            </div>

            <div className="space-y-6">
              {el.items.map(item => (
                <ItemRow
                  key={item.code}
                  item={item}
                  value={answers[item.code]}
                  onChange={v => setAnswer(item.code, v)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ItemRow({ item, value, onChange }) {
  return (
    <div className="bg-ink-50 p-5 sm:p-6 border border-ink-200">
      <div className="flex items-baseline gap-3 mb-4">
        <span className="font-sans text-xs text-ink-400 font-semibold whitespace-nowrap">
          {item.code}
        </span>
        <p className="font-serif text-base sm:text-lg text-ink-700 leading-relaxed">
          {item.text}
        </p>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {SCALE.anchors.map(a => (
          <button
            key={a.value}
            onClick={() => onChange(a.value)}
            className={`px-2 py-3 text-center transition-all border ${
              value === a.value
                ? 'bg-ink-900 text-white border-ink-900'
                : 'bg-white text-ink-600 border-ink-200 hover:border-ink-400'
            }`}
            aria-label={a.label}
          >
            <div className="font-sans font-bold text-lg leading-none">{a.value}</div>
            <div className="font-sans text-xs mt-1 leading-tight opacity-80 hidden sm:block">
              {a.label}
            </div>
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-2 sm:hidden">
        <span className="font-sans text-xs text-ink-400">Almost never</span>
        <span className="font-sans text-xs text-ink-400">Almost always</span>
      </div>
    </div>
  );
}

function NextButton({ step, context, answers, onClick }) {
  let canAdvance = true;
  let label = 'Continue →';

  if (step === 0) {
    canAdvance = CONTEXT_QUESTIONS.every(q => context[q.field]);
    label = 'Begin diagnostic →';
  } else if (step >= 1 && step <= 4) {
    const p = PS[step - 1];
    const allAnswered = p.elements.every(el =>
      el.items.every(it => answers[it.code] >= 1 && answers[it.code] <= 5)
    );
    canAdvance = allAnswered;
    label = step === 4 ? 'Get my report →' : `Continue to ${PS[step].name} →`;
  }

  return (
    <button
      onClick={onClick}
      disabled={!canAdvance}
      className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
    >
      {label}
    </button>
  );
}
