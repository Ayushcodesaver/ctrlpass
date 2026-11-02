import Link from 'next/link';
import { ArrowUpRight, Cpu, Lock, Shield } from 'lucide-react';
import BrandMark from './BrandMark';

const platformLinks = [
  { href: '/#features', label: 'Ticketing Engine' },
  { href: '/#access-control', label: 'Access Control' },
  { href: '/organizer/dashboard', label: 'Organizer Suite' },
  { href: '/admin/dashboard', label: 'Compliance & Review' },
];

const dashboardLinks = [
  { href: '/organizer/events', label: 'Event Management' },
  { href: '/organizer/check-ins', label: 'Gate Live Feed' },
  { href: '/organizer/finance', label: 'Revenue & Finance' },
  { href: '/admin/event-review', label: 'Event Review Queue' },
];

const accessLinks = [
  { href: '/login', label: 'Sign In' },
  { href: '/admin/login', label: 'Admin Gateway' },
  { href: '/signup', label: 'Register Organization' },
  { href: '/forgot-password', label: 'Account Recovery' },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/[0.07] bg-[#050505]">
      <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:pr-8">
            <BrandMark size={36} compact />

            <p className="mt-5 max-w-sm text-sm leading-6 text-[#77736C]">
              A modern event platform for discovering experiences, managing
              ticketing, and operating events with clarity.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <TrustBadge icon={Shield} label="Secure Access" />
              <TrustBadge icon={Lock} label="Protected Data" />
              <TrustBadge icon={Cpu} label="Live Operations" />
            </div>
          </div>

          <FooterColumn title="Platform" links={platformLinks} />
          <FooterColumn title="Dashboards" links={dashboardLinks} />
          <FooterColumn title="Access" links={accessLinks} />
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-white/[0.06] pt-7 text-xs text-[#77736C] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} CtrlPass Technologies India Pvt Ltd.
            All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span>Built for modern events</span>
            <span className="hidden h-1 w-1 rounded-full bg-[#77736C] sm:block" />
            <span>India-first ticketing</span>
            <span className="hidden h-1 w-1 rounded-full bg-[#77736C] sm:block" />
            <span>Made with precision</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <div>
      <h4 className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#D6B47A]">
        {title}
      </h4>

      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group inline-flex items-center gap-1.5 text-sm text-[#A7A39B] transition-colors hover:text-[#F5F5F2]"
            >
              {link.label}
              <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-60" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TrustBadge({
  icon: Icon,
  label,
}: {
  icon: typeof Shield;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-[#0B0B0B] px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-wider text-[#77736C]">
      <Icon className="h-3 w-3 text-[#D6B47A]" />
      {label}
    </span>
  );
}