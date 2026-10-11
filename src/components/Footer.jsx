// The site footer, the same links as management-ignition.com.
export const SITE = 'https://www.management-ignition.com';

const LINKS = [
  { label: 'Management Ignition', href: SITE },
  { label: 'Security', href: `${SITE}/security.html` },
  { label: 'The Message Business', href: 'https://themessagebusiness.com' },
  { label: 'Contact', href: 'mailto:team@management-ignition.com' },
];

export default function Footer() {
  return (
    <footer className="bg-ink-900 border-t border-white/10 py-10 print:hidden">
      <div className="max-w-[1000px] mx-auto px-6 flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-4 text-sm text-white/60">
        <div>&copy; 2026 James G Harvey / Allcow Trading Co. Ltd. trading as The Message Business</div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {LINKS.map(l => (
            <a key={l.label} href={l.href} className="text-white/75 no-underline hover:text-white">{l.label}</a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
