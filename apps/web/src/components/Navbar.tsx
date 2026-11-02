'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserButton, useUser } from '@clerk/nextjs';
import {
  ArrowRight,
  CalendarDays,
  Compass,
  LayoutDashboard,
  Menu,
  ShieldCheck,
  X,
} from 'lucide-react';

import BrandMark from './BrandMark';

const clerkEnabled = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
);

const navigation = [
  {
    href: '/#discover',
    label: 'Discover Events',
    icon: Compass,
  },
  {
    href: '/organizer/events/new',
    label: 'Host an Event',
    icon: CalendarDays,
  },
  {
    href: '/organizer/dashboard',
    label: 'Organizer Hub',
    icon: LayoutDashboard,
  },
];

/*
 * Clerk session display — mounted only when Clerk is configured.
 * Signed in: real name + avatar with a sign-out menu.
 * Signed out: the same Sign In / Get Started actions as before.
 */
function ClerkSessionArea({
  onNavigate,
  mobile = false,
}: {
  onNavigate?: () => void;
  mobile?: boolean;
}) {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return null;
  }

  if (!user) {
    return (
      <>
        <Link
          href="/login"
          onClick={onNavigate}
          className={
            mobile
              ? 'flex items-center justify-center rounded-xl border border-white/[0.08] bg-[#111111] px-4 py-3 text-xs font-semibold text-[#A7A39B] transition hover:border-white/[0.14] hover:text-[#F5F5F2]'
              : 'rounded-lg px-3 py-2 text-xs font-medium text-[#A7A39B] transition-colors hover:text-[#F5F5F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B47A]/50'
          }
        >
          Sign In
        </Link>

        <Link
          href="/signup"
          onClick={onNavigate}
          className={
            mobile
              ? 'flex items-center justify-center gap-2 rounded-xl bg-[#D6B47A] px-4 py-3 text-xs font-semibold text-[#050505] transition hover:bg-[#E0C38E]'
              : 'group inline-flex items-center gap-2 rounded-xl bg-[#D6B47A] px-4 py-2.5 text-xs font-semibold text-[#050505] transition-all hover:bg-[#E0C38E] hover:shadow-lg hover:shadow-[#D6B47A]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B47A]/60'
          }
        >
          Get Started

          <ArrowRight
            className={
              mobile
                ? 'h-3.5 w-3.5'
                : 'h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5'
            }
          />
        </Link>
      </>
    );
  }

  const displayName =
    user.fullName ?? user.primaryEmailAddress?.emailAddress ?? 'Account';

  return (
    <div
      className={
        mobile
          ? 'flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#111111] px-4 py-3'
          : 'flex items-center gap-3 rounded-xl border border-white/[0.08] bg-[#111111] py-1.5 pl-4 pr-1.5'
      }
    >
      <span
        className={
          mobile
            ? 'truncate text-xs font-medium text-[#F5F5F2]'
            : 'max-w-[160px] truncate text-xs font-medium text-[#F5F5F2]'
        }
      >
        {displayName}
      </span>

      <UserButton afterSignOutUrl="/" />
    </div>
  );
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#050505]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-6 lg:px-8">
        <BrandMark />

        {/* Desktop navigation */}
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Main navigation"
        >
          {navigation.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg px-3 py-2 text-xs font-medium text-[#A7A39B] transition-colors hover:bg-white/[0.035] hover:text-[#F5F5F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B47A]/50"
            >
              {label}
            </Link>
          ))}

          <Link
            href="/admin/dashboard"
            className="ml-1 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[#D6B47A] transition-colors hover:bg-[#D6B47A]/[0.06] hover:text-[#E0C38E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B47A]/50"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Admin
          </Link>
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          {clerkEnabled ? (
            <ClerkSessionArea />
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-xs font-medium text-[#A7A39B] transition-colors hover:text-[#F5F5F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B47A]/50"
              >
                Sign In
              </Link>

              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 rounded-xl bg-[#D6B47A] px-4 py-2.5 text-xs font-semibold text-[#050505] transition-all hover:bg-[#E0C38E] hover:shadow-lg hover:shadow-[#D6B47A]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B47A]/60"
              >
                Get Started

                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={
            mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
          }
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-[#111111] text-[#A7A39B] transition hover:border-[#D6B47A]/25 hover:text-[#F5F5F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B47A]/50 md:hidden"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-white/[0.06] bg-[#080808] px-5 pb-5 pt-4 md:hidden"
        >
          <nav
            className="space-y-1"
            aria-label="Mobile navigation"
          >
            {navigation.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={closeMobileMenu}
                className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-[#A7A39B] transition-colors hover:bg-white/[0.035] hover:text-[#F5F5F2]"
              >
                <Icon className="h-4 w-4 text-[#D6B47A]" />
                {label}
              </Link>
            ))}

            <Link
              href="/admin/dashboard"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-[#D6B47A] transition-colors hover:bg-[#D6B47A]/[0.06]"
            >
              <ShieldCheck className="h-4 w-4" />
              Admin Console
            </Link>
          </nav>

          <div className="mt-4 grid gap-2 border-t border-white/[0.06] pt-4 sm:grid-cols-2">
            {clerkEnabled ? (
              <div className="grid grid-cols-1 gap-2 sm:col-span-2 sm:grid-cols-2">
                <ClerkSessionArea mobile onNavigate={closeMobileMenu} />
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center rounded-xl border border-white/[0.08] bg-[#111111] px-4 py-3 text-xs font-semibold text-[#A7A39B] transition hover:border-white/[0.14] hover:text-[#F5F5F2]"
                >
                  Sign In
                </Link>

                <Link
                  href="/signup"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#D6B47A] px-4 py-3 text-xs font-semibold text-[#050505] transition hover:bg-[#E0C38E]"
                >
                  Get Started
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}