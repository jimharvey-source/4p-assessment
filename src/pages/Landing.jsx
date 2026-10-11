import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-ink-700">
      {/* Header bar */}
      <header className="border-b border-ink-200">
        <div className="container-reading py-5 flex items-center justify-between">
          <div className="font-sans text-sm tracking-wide text-ink-500">
            JIM HARVEY &nbsp;·&nbsp; THE MESSAGE BUSINESS
          </div>
          <a
            href="https://management-ignition.com"
            className="font-sans text-xs uppercase tracking-widest text-ink-500 hover:text-ink-900 transition-colors"
          >
            Management Ignition ↗
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="container-reading pt-20 sm:pt-28 pb-16">
        <div className="eyebrow mb-6">A DIAGNOSTIC FOR TEAM LEADERS</div>

        <h1 className="font-serif font-semibold text-5xl sm:text-7xl leading-[1.05] text-ink-900 tracking-tight mb-6">
          The 4Ps of<br/>Leadership
        </h1>

        <p className="font-serif italic text-xl sm:text-2xl text-ink-500 mb-12 leading-snug">
          The spark to ignite your team.
        </p>

        <div className="border-l-2 border-ink-900 pl-6 mb-12 max-w-prose">
          <p className="text-lg sm:text-xl leading-relaxed text-ink-700">
            Forty questions. Ten minutes. One useful answer: where is the highest-leverage place to start with your team?
          </p>
        </div>

        <Link to="/diagnostic" className="btn-primary text-base">
          Start the diagnostic
        </Link>

        <p className="mt-4 font-sans text-sm text-ink-500">
          Free. No account needed to begin.
        </p>
      </section>

      {/* What it measures */}
      <section className="bg-ink-50 border-y border-ink-200 py-20">
        <div className="container-reading">
          <div className="eyebrow mb-4">WHAT IT MEASURES</div>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink-900 mb-10 max-w-prose leading-tight">
            Four conditions every team has to hold to perform at its best.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
            <FourPCard
              letter="P1"
              name="Purpose"
              colour="bg-purpose"
              question="Where are we headed, and why does it matter?"
              elements="Vision · Goals · Measures"
            />
            <FourPCard
              letter="P2"
              name="Plan"
              colour="bg-plan"
              question="How are we going to get there?"
              elements="Process · Roles · Authority"
            />
            <FourPCard
              letter="P3"
              name="People"
              colour="bg-people"
              question="How are we going to organise our work?"
              elements="Standards · Trust · Feedback"
            />
            <FourPCard
              letter="P4"
              name="Pride"
              colour="bg-pride"
              question="How do all of our people feel about the work?"
              elements="Proactivity · Energy · Recognition"
            />
          </div>

          <p className="max-w-prose text-lg leading-relaxed text-ink-600">
            The diagnostic scores your team against twelve leadership drivers, three within each P. The report names the priority P, identifies the single move worth making this week, and gives you a sharp starting point for development.
          </p>
        </div>
      </section>

      {/* What you get */}
      <section className="container-reading py-20">
        <div className="eyebrow mb-4">WHAT YOU GET</div>
        <h2 className="font-serif text-3xl sm:text-4xl text-ink-900 mb-12 max-w-prose leading-tight">
          A four-page report. One starting point. The work for next week.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8 max-w-reading">
          <Feature
            label="01"
            title="A dashboard"
            text="All four P scores, with band labels. You see at a glance which condition is strongest, which is weakest, and where the work is."
          />
          <Feature
            label="02"
            title="Your priority P"
            text="The single most important P to work on, based on the framework's stack logic. Plain words. No jargon."
          />
          <Feature
            label="03"
            title="One move this week"
            text="The highest-leverage development action drawn from the lowest-scoring driver. Specific. Doable in your real meetings."
          />
          <Feature
            label="04"
            title="The route to deeper work"
            text="If you want the full report — twelve-driver breakdown, four-week plan, strengths, routing to coaching and the Ignite tools — the Pro report is one click away."
          />
        </div>
      </section>

      {/* Built by */}
      <section className="border-t border-ink-200 bg-ink-50 py-20">
        <div className="container-reading">
          <div className="eyebrow mb-6">BUILT BY</div>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink-900 max-w-prose leading-snug mb-6">
            Jim Harvey, founder of The Message Business.
          </h2>
          <p className="max-w-prose text-lg leading-relaxed text-ink-600 mb-4">
            Thirty years of work with leaders and teams across banks, manufacturers, consultancies, and professional services firms. The 4Ps model is the spine of his book <em>The Art of Managing</em> and the Management Ignition tool suite.
          </p>
          <p className="max-w-prose text-lg leading-relaxed text-ink-600">
            The diagnostic gives you the picture. The Management Ignition tools give you the working layer. The book gives you the readable version. All three trace back to the same model.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-reading py-24 text-center">
        <p className="font-serif italic text-xl sm:text-2xl text-ink-700 max-w-prose mx-auto mb-10 leading-snug">
          One report. One starting point. Four weeks of focused work.
        </p>
        <Link to="/diagnostic" className="btn-primary text-base">
          Start the diagnostic
        </Link>
        <p className="mt-4 font-sans text-sm text-ink-500">
          Ten minutes. Free.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink-200 py-10">
        <div className="container-reading flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="font-sans text-xs text-ink-500">
            © Jim Harvey / The Message Business 2026
          </div>
          <div className="font-sans text-xs text-ink-500 space-x-6">
            <a href="https://themessagebusiness.com" className="hover:text-ink-900">themessagebusiness.com</a>
            <a href="https://management-ignition.com" className="hover:text-ink-900">management-ignition.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FourPCard({ letter, name, colour, question, elements }) {
  return (
    <div className="bg-white border border-ink-200 p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className={`${colour} text-white font-sans font-bold text-sm px-3 py-1.5 tracking-wider`}>
          {letter}
        </div>
        <h3 className="font-serif text-2xl font-semibold text-ink-900 leading-tight">
          {name}
        </h3>
      </div>
      <p className="font-serif italic text-ink-700 text-lg mb-3 leading-snug">
        {question}
      </p>
      <p className="font-sans text-xs text-ink-500 tracking-wider uppercase">
        {elements}
      </p>
    </div>
  );
}

function Feature({ label, title, text }) {
  return (
    <div>
      <div className="font-sans text-xs text-ink-400 tracking-widest mb-2">{label}</div>
      <h3 className="font-serif text-xl font-semibold text-ink-900 mb-3">{title}</h3>
      <p className="text-base text-ink-600 leading-relaxed">{text}</p>
    </div>
  );
}
