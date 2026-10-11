import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

// The 4Ps diagnostic landing page, 11 October 2026.
// Same wording and order as management-ignition.com: the four elements stack from Purpose,
// the foundation, to Pride, the peak. Tool colours appear as dots only.

const SITE = 'https://management-ignition.com';

const PS = [
  {
    n: 1, name: 'Purpose', tag: 'Foundation', dot: 'bg-purpose',
    question: 'Where are we headed, and why does it matter?',
    elements: 'Vision, Goals, Measures',
    work: 'Setting clear goals', tool: 'Goal Ignite', url: 'https://goal.management-ignition.com',
  },
  {
    n: 2, name: 'Plan', dot: 'bg-plan',
    question: 'How are we going to get there?',
    elements: 'Process, Roles, Authority',
    work: 'Delegating effectively', tool: 'Delegate Ignite', url: 'https://delegate.management-ignition.com',
  },
  {
    n: 3, name: 'People', dot: 'bg-people',
    question: 'How do we hold ourselves to the right standards?',
    elements: 'Standards, Trust, Feedback',
    work: 'Feedback, with coaching to build confidence', tool: 'Feedback Ignite', url: 'https://feedback.management-ignition.com',
  },
  {
    n: 4, name: 'Pride', tag: 'Peak', dot: 'bg-pride',
    question: 'Do we actually care? How does it show?',
    elements: 'Proactivity, Energy, Recognition',
    work: 'Coaching', tool: 'Coach Ignite', url: 'https://coach.management-ignition.com',
  },
];

const GETS = [
  { title: 'Your four scores', text: 'Purpose, Plan, People and Pride, each with a plain label, so you can see at a glance where the team is strong and where the gaps are.' },
  { title: 'The first P to fix', text: 'The lowest layer that is not holding. Everything above it rests on it, so that is where the work starts.' },
  { title: 'One move this week', text: 'A concrete action for the weakest part of that P, written to fit the meetings and conversations you already have.' },
  { title: 'The tool to start it in', text: 'A link to the Management Ignition tool that does that work with you. Three free uses, no card.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-ink-50 text-ink-700">
      <header className="border-b border-ink-200 bg-ink-50">
        <div className="container-reading py-4 flex items-center justify-between gap-4">
          <a href={SITE} aria-label="Management Ignition home">
            <img src="/mi-lockup.svg" alt="Jim Harvey's Management Ignition" className="h-8 sm:h-9 w-auto block" />
          </a>
          <a href={SITE} className="hidden sm:inline font-sans text-sm font-medium text-ink-700 hover:text-ink-900 underline decoration-ink-200 underline-offset-4">
            management-ignition.com
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="container-reading pt-16 sm:pt-24 pb-16">
        <div className="inline-block font-sans text-[13px] font-semibold text-ink-700 bg-ink-100 rounded-full px-3 py-1 mb-6">
          The 4Ps diagnostic
        </div>

        <h1 className="text-[2.6rem] sm:text-6xl leading-[1.05] tracking-[-0.035em] mb-5 max-w-[16ch]">
          Where is your team strong? Where are the gaps?
        </h1>

        <p className="font-spoken text-xl sm:text-2xl text-ink-900 leading-snug mb-8 max-w-prose" style={{ fontVariationSettings: '"SOFT" 0, "WONK" 0' }}>
          A quick health check of your team and your leadership priorities.
        </p>

        <p className="text-lg leading-relaxed text-ink-700 mb-8 max-w-prose">
          Forty questions, ten minutes. Your free report scores all four Ps, names the first one to fix,
          and gives you one concrete move to make this week.
        </p>

        <Link to="/diagnostic" className="btn-primary text-base">
          Start the free diagnostic &rarr;
        </Link>
        <p className="mt-4 font-sans text-sm text-ink-500">
          Free. No card. No account needed to begin.
        </p>
      </section>

      {/* The four elements */}
      <section className="bg-white border-y border-ink-200 py-16 sm:py-20">
        <div className="container-reading">
          <div className="eyebrow mb-3">What it measures</div>
          <h2 className="text-3xl sm:text-4xl leading-tight mb-4">
            Four elements.<br />Built in order.
          </h2>
          <p className="text-lg leading-relaxed text-ink-700 mb-10 max-w-prose">
            Every great team meets four requirements. They stack, one on the other. You build a brilliant
            team from the foundation up, and every level adds to the team&rsquo;s confidence and capability.
          </p>


          <ol className="flex flex-col gap-3">
            {PS.map(p => <PRow key={p.name} p={p} />)}
          </ol>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-4 border border-dashed border-ink-500 rounded-[10px] p-5 sm:pl-[4.75rem]">
            <div className="max-w-prose">
              <div className="font-semibold text-ink-900">Better meetings hold the four together</div>
              <p className="text-[15px] leading-relaxed text-ink-700 mt-1">
                Every goal, every delegation, every piece of feedback and every coaching conversation happens
                in a meeting. Run your one-to-ones and team meetings well, and the four elements hold.
              </p>
            </div>
            <ToolLink dot="bg-meeting" tool="Meeting Ignite" url="https://meeting.management-ignition.com" />
          </div>
          <Levels />
        </div>
      </section>

      {/* How it finds the starting point */}
      <section className="container-reading py-16 sm:py-20">
        <div className="eyebrow mb-3">How it finds your starting point</div>
        <h2 className="text-3xl sm:text-4xl leading-tight mb-5 max-w-prose">
          Most management problems start one level down.
        </h2>
        <p className="text-lg leading-relaxed text-ink-700 max-w-prose">
          A People problem often comes from a weak Plan. A Plan problem usually comes from an unclear
          Purpose. The diagnostic finds the lowest layer that isn&rsquo;t holding, because everything above
          it rests on it.
        </p>
      </section>

      {/* What you get */}
      <section className="bg-white border-y border-ink-200 py-16 sm:py-20">
        <div className="container-reading">
          <div className="eyebrow mb-3">What you get</div>
          <h2 className="text-3xl sm:text-4xl leading-tight mb-10 max-w-prose">
            A four-page report you can act on this week.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {GETS.map((g, i) => (
              <div key={g.title} className="bg-ink-50 border border-ink-200 rounded-[10px] p-5">
                <div className="font-sans text-2xl font-semibold text-accent leading-none mb-3">{i + 1}</div>
                <h3 className="text-lg mb-2">{g.title}</h3>
                <p className="text-[15px] leading-relaxed text-ink-700">{g.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built by */}
      <section className="container-reading py-16 sm:py-20">
        <div className="eyebrow mb-3">Built by</div>
        <h2 className="text-2xl sm:text-3xl leading-snug mb-5 max-w-prose">
          Jim Harvey, founder of The Message Business.
        </h2>
        <p className="text-lg leading-relaxed text-ink-700 mb-4 max-w-prose">
          Thirty years of work with leaders and teams across banks, manufacturers, consultancies and
          professional services firms. The 4Ps are the spine of his book <em>The Art of Managing</em> and
          of the Management Ignition tools.
        </p>
        <p className="text-lg leading-relaxed text-ink-700 max-w-prose">
          The diagnostic shows you where to start. The tools help you do the work. Both come from the same
          model.
        </p>
      </section>

      {/* Close */}
      <section className="bg-ink-900 py-20 text-center">
        <div className="container-reading">
          <h2 className="text-white text-3xl sm:text-4xl leading-tight mb-4">Find your starting point.</h2>
          <p className="text-lg text-white/80 mb-8">Forty questions. Ten minutes. Free.</p>
          <Link to="/diagnostic" className="inline-flex items-center justify-center min-h-[48px] px-6 font-sans font-semibold text-ink-900 bg-white rounded-[10px] hover:opacity-90">
            Start the free diagnostic &rarr;
          </Link>
          <p className="mt-6 text-sm text-white/70">
            Or go straight to the tools at <a href="https://app.management-ignition.com" className="text-white underline decoration-white/40 underline-offset-4">app.management-ignition.com</a>.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function PRow({ p }) {
  return (
    <li className="grid grid-cols-[2.25rem_1fr] sm:grid-cols-[3rem_1fr_14rem] gap-x-4 sm:gap-x-6 gap-y-3 bg-ink-50 border border-ink-200 rounded-[10px] p-5">
      <div className="text-2xl font-semibold text-accent leading-none">{p.n}</div>
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xl font-semibold text-ink-900 tracking-tight">{p.name}</span>
          {p.tag && <span className="text-xs font-semibold text-ink-700 bg-ink-100 rounded-full px-2 py-0.5">{p.tag}</span>}
        </div>
        <div className="text-[15px] font-medium text-ink-900 mt-1">{p.question}</div>
        <div className="text-sm text-ink-500 mt-1">{p.elements}</div>
      </div>
      <div className="col-start-2 sm:col-start-3 border-t sm:border-t-0 sm:border-l border-ink-200 pt-3 sm:pt-0 sm:pl-5">
        <div className="text-[13px] font-semibold text-ink-500">The management work</div>
        <div className="text-[15px] font-semibold text-ink-900 mt-0.5 mb-2 leading-snug">{p.work}</div>
        <ToolLink dot={p.dot} tool={p.tool} url={p.url} />
      </div>
    </li>
  );
}

function ToolLink({ dot, tool, url }) {
  return (
    <a href={url} className="inline-flex items-center gap-2 min-h-[40px] px-4 rounded-[10px] bg-accent text-[15px] font-semibold text-white no-underline hover:opacity-90 transition-opacity">
      {tool} &rarr;
    </a>
  );
}

function Levels() {
  const points = [
    { icon: 'up', title: 'The foundation governs everything above it.', text: 'Each level sets the limits for the ones above. A Plan can’t succeed if the Purpose is vague, and People can be no stronger than the Plan they work to.' },
    { icon: 'down', title: 'Higher levels can only influence the ones below.', text: 'A proud team tightens its own standards and process. It cannot fix a purpose nobody has explained to them.' },
    { icon: 'look', title: 'Symptoms of lower level failure show at the peak. Causes wait silently in the foundations.', text: 'A team lacking motivation looks like a Pride problem. The cause usually sits further down: no clear standards, conflicting ownership, or conflicting goals. Lasting change starts with fixing the layer that is broken.' },
  ];
  return (
    <figure className="lv" aria-label="The 4Ps as a pyramid: Purpose at the foundation, then Plan, People, and Pride at the peak.">
      <figcaption>
        <span className="eyebrow">How the four work together</span>
        <h3 className="text-2xl sm:text-[1.75rem] leading-tight tracking-[-0.025em] mt-1 mb-8">Built from the bottom. Reinforced from the top.</h3>
      </figcaption>
      <div className="lv-body">
        <div className="lv-stack" aria-hidden="true">
          <span className="lv-rail up" />
          <div className="lv-bar peak" style={{ width: '46%' }}>Pride <small>Peak</small></div>
          <div className="lv-bar" style={{ width: '64%' }}>People</div>
          <div className="lv-bar" style={{ width: '82%' }}>Plan</div>
          <div className="lv-bar" style={{ width: '100%' }}>Purpose <small>Foundation</small></div>
          <span className="lv-rail down" />
        </div>
        <ul className="flex flex-col gap-6">
          {points.map(p => (
            <li key={p.title} className="grid grid-cols-[2.25rem_1fr] gap-4 items-start">
              <span className={`lv-icon ${p.icon === 'down' ? 'down' : ''}`}>
                {p.icon === 'up' && <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#1b2a4a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8 13V3M4 7l4-4 4 4" /></svg>}
                {p.icon === 'down' && <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#0e7c7b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v10M4 9l4 4 4-4" /></svg>}
                {p.icon === 'look' && <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#1b2a4a" strokeWidth="1.8" strokeLinecap="round"><circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5 14 14" /></svg>}
              </span>
              <div>
                <strong className="block text-base font-semibold text-ink-900 mb-1">{p.title}</strong>
                <p className="text-[15px] leading-relaxed text-ink-700">{p.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}
