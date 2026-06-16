import { Link } from 'react-router-dom';

export default function Diagnostic() {
  return (
    <div className="min-h-screen bg-white text-ink-700">
      <header className="border-b border-ink-200">
        <div className="container-reading py-5">
          <Link to="/" className="font-sans text-sm tracking-wide text-ink-500 hover:text-ink-900">
            ← Back
          </Link>
        </div>
      </header>

      <div className="container-reading py-20">
        <div className="eyebrow mb-6">UNDER CONSTRUCTION</div>
        <h1 className="font-serif text-4xl text-ink-900 mb-6">The diagnostic is being built.</h1>
        <p className="text-lg text-ink-600 max-w-prose leading-relaxed mb-4">
          This is the scaffold deployment. The forty-item diagnostic flow ships in the next commit: four context questions, then thirty-six diagnostic items grouped by P, with the five-point response scale.
        </p>
        <p className="text-lg text-ink-600 max-w-prose leading-relaxed">
          The scoring engine and free report renderer follow in the commit after that.
        </p>
      </div>
    </div>
  );
}
