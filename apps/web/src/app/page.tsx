'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ConfigNotice from '@/components/ConfigNotice';
import { isSupabaseConfigured } from '@/lib/supabase';
import { eventService } from '@/services/events';
import { Event } from '@ctrlpass/types';
import { brandAssets } from '@/lib/brand';
import EventCard, {
  formatEventDate,
  getLowestPriceFormatted,
} from '@/components/ui/EventCard';
import EventImage from '@/components/EventImage';
import { LoadingState, ErrorState } from '@/components/ui/LoadingState';
import { userFacingError } from '@/lib/userFacingError';
import { normalizeCity } from '@/lib/city';
import {
  Search,
  ArrowRight,
  ArrowUpRight,
  Ticket,
  ShieldCheck,
  Zap,
  MapPin,
  CalendarDays,
  Music,
  MoonStar,
  Sparkles,
  Cpu,
  Trophy,
  Laugh,
  Palette,
  UtensilsCrossed,
  Users,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';

const CITY_OPTIONS = [
  'Delhi-NCR',
  'Mumbai',
  'Bengaluru',
  'Goa',
  'Hyderabad',
  'Pune',
];

const FALLBACK_CATEGORIES = [
  'Music',
  'Nightlife',
  'Sports',
  'Food',
  'Art',
  'Comedy',
  'Technology',
  'Culture',
];

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  music: Music,
  nightlife: MoonStar,
  sports: Trophy,
  food: UtensilsCrossed,
  art: Palette,
  culture: Palette,
  comedy: Laugh,
  technology: Cpu,
  festivals: Sparkles,
};

function scrollToDiscover() {
  document.getElementById('discover')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}

export default function HomePage() {
  const [dbEvents, setDbEvents] = useState<Event[]>([]);
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoadError(null);

        const events = await eventService.listPublished();
        setDbEvents(events);
      } catch (err) {
        setDbEvents([]);
        setLoadError(
          userFacingError(
            err,
            'Could not load events. Check your connection and try again.',
          ),
        );
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  const categories = useMemo(() => {
    const present = new Set(
      dbEvents.map((event) => event.category).filter(Boolean) as string[],
    );

    const ordered = FALLBACK_CATEGORIES.filter((category) =>
      present.has(category),
    );

    const extra = Array.from(present).filter(
      (category) => !ordered.includes(category),
    );

    return ['All', ...ordered, ...extra].slice(0, 9);
  }, [dbEvents]);

  const cityOptions = useMemo(() => {
    const present = new Set(
      dbEvents
        .map((event) => normalizeCity(event.venue?.city))
        .filter(Boolean) as string[],
    );

    return [
      'All Cities',
      ...CITY_OPTIONS.filter((city) => present.has(city)),
    ];
  }, [dbEvents]);

  const upcomingEvents = useMemo(() => {
    const now = Date.now();

    return dbEvents
      .filter((event) => {
        if (!event.start_at) return false;

        const timestamp = new Date(event.start_at).getTime();

        return !Number.isNaN(timestamp) && timestamp > now;
      })
      .sort(
        (a, b) =>
          new Date(a.start_at).getTime() - new Date(b.start_at).getTime(),
      );
  }, [dbEvents]);

  const featured = upcomingEvents[0] ?? dbEvents[0] ?? null;

  const sideEvents = useMemo(() => {
    const source = upcomingEvents.length > 0 ? upcomingEvents : dbEvents;

    return source
      .filter((event) => event.id !== featured?.id)
      .slice(0, 3);
  }, [dbEvents, featured, upcomingEvents]);

  const topCities = useMemo(() => {
    const cityMap = new Map<
      string,
      {
        name: string;
        count: number;
        cover?: string;
      }
    >();

    for (const event of dbEvents) {
      const city = normalizeCity(event.venue?.city);

      if (!city) continue;

      const current = cityMap.get(city) ?? {
        name: city,
        count: 0,
      };

      current.count += 1;

      if (!current.cover && event.cover_image_url) {
        current.cover = event.cover_image_url;
      }

      cityMap.set(city, current);
    }

    return Array.from(cityMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [dbEvents]);

  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return dbEvents.filter((event) => {
      const eventCity = normalizeCity(event.venue?.city);

      const matchesCity =
        selectedCity === 'All Cities' || eventCity === selectedCity;

      const matchesCategory =
        selectedCategory === 'All' ||
        event.category?.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        !query ||
        event.name?.toLowerCase().includes(query) ||
        event.venue?.city?.toLowerCase().includes(query) ||
        event.venue?.name?.toLowerCase().includes(query);

      return matchesCity && matchesCategory && matchesSearch;
    });
  }, [dbEvents, searchQuery, selectedCategory, selectedCity]);

  function pickCity(city: string) {
    setSelectedCity(city);
    scrollToDiscover();
  }

  function pickCategory(category: string) {
    setSelectedCategory(category);
    scrollToDiscover();
  }

  function resetFilters() {
    setSelectedCity('All Cities');
    setSelectedCategory('All');
    setSearchQuery('');
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F2]">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/[0.08]">
        <div className="absolute inset-0">
          <Image
            src={brandAssets.hero}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-35"
          />

          <div className="absolute inset-0 bg-[#050505]/75" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_25%,rgba(214,180,122,0.16),transparent_30%),radial-gradient(circle_at_15%_80%,rgba(255,255,255,0.05),transparent_28%)]" />

          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#050505] to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1440px] px-5 pb-24 pt-16 sm:px-8 lg:px-12 lg:pb-28 lg:pt-24">
          <div className="max-w-5xl">
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-[#D6B47A]/25 bg-black/35 px-4 py-2 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D6B47A] shadow-[0_0_14px_rgba(214,180,122,0.8)]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D6B47A]">
                Live events across India
              </span>
            </div>

            <h1 className="max-w-5xl font-display text-[3.4rem] font-semibold leading-[0.92] tracking-[-0.055em] sm:text-6xl md:text-7xl lg:text-[6.8rem]">
              Find something
              <span className="block text-[#D6B47A]">worth showing up for.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-sm leading-7 text-[#A7A39B] sm:text-base sm:leading-8">
              Discover concerts, festivals, nightlife, sports, food experiences,
              technology events and everything happening around you.
            </p>

            {/* SEARCH */}
            <div className="mt-10 max-w-4xl rounded-[1.35rem] border border-white/[0.10] bg-[#0B0B0B]/90 p-2 shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <div className="grid gap-2 md:grid-cols-[1fr_1fr_1.2fr_auto]">
                <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3.5">
                  <MapPin className="h-4 w-4 shrink-0 text-[#D6B47A]" />

                  <div className="min-w-0">
                    <label
                      htmlFor="hero-city"
                      className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#77736C]"
                    >
                      Location
                    </label>

                    <select
                      id="hero-city"
                      value={selectedCity}
                      onChange={(event) =>
                        setSelectedCity(event.target.value)
                      }
                      className="mt-1 w-full cursor-pointer bg-transparent text-xs font-semibold text-[#F5F5F2] outline-none"
                    >
                      {cityOptions.map((city) => (
                        <option
                          key={city}
                          value={city}
                          className="bg-[#111111] text-[#F5F5F2]"
                        >
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3.5">
                  <Sparkles className="h-4 w-4 shrink-0 text-[#D6B47A]" />

                  <div className="min-w-0">
                    <label
                      htmlFor="hero-category"
                      className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#77736C]"
                    >
                      Category
                    </label>

                    <select
                      id="hero-category"
                      value={selectedCategory}
                      onChange={(event) =>
                        setSelectedCategory(event.target.value)
                      }
                      className="mt-1 w-full cursor-pointer bg-transparent text-xs font-semibold text-[#F5F5F2] outline-none"
                    >
                      {categories.map((category) => (
                        <option
                          key={category}
                          value={category}
                          className="bg-[#111111] text-[#F5F5F2]"
                        >
                          {category === 'All'
                            ? 'All categories'
                            : category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3.5">
                  <Search className="h-4 w-4 shrink-0 text-[#77736C]" />

                  <div className="min-w-0 flex-1">
                    <label
                      htmlFor="hero-search"
                      className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#77736C]"
                    >
                      Search
                    </label>

                    <input
                      id="hero-search"
                      type="search"
                      value={searchQuery}
                      onChange={(event) =>
                        setSearchQuery(event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          scrollToDiscover();
                        }
                      }}
                      placeholder="Event, venue or city"
                      className="mt-1 w-full bg-transparent text-xs font-semibold text-[#F5F5F2] outline-none placeholder:text-[#55524D]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={scrollToDiscover}
                  className="inline-flex min-h-[58px] items-center justify-center gap-2 rounded-xl bg-[#D6B47A] px-6 text-xs font-bold text-[#050505] transition hover:bg-[#E2C791] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B47A]"
                >
                  Explore
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-8 gap-y-4">
              {[
                {
                  icon: Ticket,
                  title: 'Real events',
                  subtitle: 'Published by organizers',
                },
                {
                  icon: ShieldCheck,
                  title: 'Secure booking',
                  subtitle: 'Protected checkout',
                },
                {
                  icon: Zap,
                  title: 'Instant access',
                  subtitle: 'Tickets ready after booking',
                },
              ].map(({ icon: Icon, title, subtitle }) => (
                <div key={title} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.035] text-[#D6B47A]">
                    <Icon className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold text-[#F5F5F2]">
                      {title}
                    </p>
                    <p className="mt-0.5 text-[10px] text-[#77736C]">
                      {subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      {loading ? (
        <section className="mx-auto w-full max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12">
          <LoadingState message="Loading events…" />
        </section>
      ) : loadError ? (
        <section className="mx-auto w-full max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12">
          <ErrorState
            title="Could not load events"
            description={loadError}
          />
        </section>
      ) : (
        <>
          {!isSupabaseConfigured && (
            <section className="mx-auto w-full max-w-[1440px] px-5 pt-8 sm:px-8 lg:px-12">
              <ConfigNotice />
            </section>
          )}

          {/* FEATURED */}
          {featured && (
            <section className="mx-auto w-full max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
              <div className="mb-7 flex items-end justify-between gap-6">
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D6B47A]">
                    Curated for you
                  </p>

                  <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                    Featured events
                  </h2>
                </div>

                <Link
                  href="/events"
                  className="hidden items-center gap-2 text-xs font-semibold text-[#A7A39B] transition hover:text-[#D6B47A] sm:flex"
                >
                  View all
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(330px,0.75fr)]">
                <div className="overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-[#0B0B0B]">
                  <EventCard event={featured} variant="featured" />
                </div>

                {sideEvents.length > 0 && (
                  <div className="grid gap-3">
                    {sideEvents.map((event) => (
                      <Link
                        key={event.id}
                        href={`/events/${event.id}`}
                        className="group flex min-h-[110px] items-center gap-4 rounded-[1.15rem] border border-white/[0.08] bg-[#0B0B0B] p-3 transition hover:border-[#D6B47A]/35 hover:bg-[#101010]"
                      >
                        <EventImage
                          src={event.cover_image_url}
                          alt={event.name || 'Event'}
                          className="shrink-0 overflow-hidden rounded-xl"
                          aspectClassName="h-[86px] w-[86px]"
                        />

                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <CalendarDays className="h-3 w-3 text-[#D6B47A]" />
                            <span className="text-[9px] font-semibold uppercase tracking-wider text-[#77736C]">
                              {formatEventDate(event.start_at)}
                            </span>
                          </div>

                          <h3 className="truncate text-sm font-semibold text-[#F5F5F2]">
                            {event.name}
                          </h3>

                          <p className="mt-1 truncate text-[11px] text-[#77736C]">
                            {normalizeCity(event.venue?.city) || 'India'}
                            {' · '}
                            {getLowestPriceFormatted(event.ticket_types)}
                          </p>
                        </div>

                        <ArrowUpRight className="mr-1 h-4 w-4 shrink-0 text-[#55524D] transition group-hover:text-[#D6B47A]" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* CATEGORIES */}
          {categories.length > 1 && (
            <section className="border-y border-white/[0.06] bg-[#080808]">
              <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12">
                <div className="mb-7">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D6B47A]">
                    Explore your interests
                  </p>

                  <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                    Browse by category
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-8">
                  {categories
                    .filter((category) => category !== 'All')
                    .slice(0, 8)
                    .map((category) => {
                      const Icon =
                        CATEGORY_ICONS[category.toLowerCase()] ??
                        Sparkles;

                      const selected = selectedCategory === category;

                      return (
                        <button
                          key={category}
                          type="button"
                          onClick={() => pickCategory(category)}
                          aria-pressed={selected}
                          className={`group flex min-h-[112px] flex-col items-start justify-between rounded-xl border p-4 text-left transition ${
                            selected
                              ? 'border-[#D6B47A]/45 bg-[#D6B47A]/[0.08]'
                              : 'border-white/[0.07] bg-[#0D0D0D] hover:border-[#D6B47A]/25 hover:bg-[#111111]'
                          }`}
                        >
                          <Icon
                            className={`h-5 w-5 ${
                              selected
                                ? 'text-[#D6B47A]'
                                : 'text-[#77736C] group-hover:text-[#D6B47A]'
                            }`}
                          />

                          <div>
                            <span className="block text-xs font-semibold text-[#F5F5F2]">
                              {category}
                            </span>

                            <span className="mt-1 flex items-center gap-1 text-[9px] uppercase tracking-wider text-[#55524D]">
                              Explore
                              <ChevronRight className="h-3 w-3" />
                            </span>
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>
            </section>
          )}

          {/* CITIES */}
          {topCities.length > 0 && (
            <section className="mx-auto w-full max-w-[1440px] px-5 py-14 sm:px-8 lg:px-12 lg:py-18">
              <div className="mb-7 flex items-end justify-between gap-5">
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D6B47A]">
                    Where it&apos;s happening
                  </p>

                  <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                    Explore cities
                  </h2>
                </div>

                <div className="hidden items-center gap-2 text-[10px] uppercase tracking-wider text-[#77736C] sm:flex">
                  <MapPin className="h-3.5 w-3.5" />
                  India
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {topCities.map((city) => (
                  <button
                    key={city.name}
                    type="button"
                    onClick={() => pickCity(city.name)}
                    className="group relative aspect-[4/5] overflow-hidden rounded-[1.15rem] border border-white/[0.08] bg-[#111111] text-left"
                  >
                    {city.cover ? (
                      <EventImage
                        src={city.cover}
                        alt={`${city.name} events`}
                        className="h-full w-full transition duration-500 group-hover:scale-105"
                        aspectClassName="h-full"
                      />
                    ) : (
                      <div className="h-full w-full bg-[#111111]" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-white">
                        {city.name}
                      </p>

                      <p className="mt-1 text-[10px] text-[#A7A39B]">
                        {city.count}{' '}
                        {city.count === 1 ? 'event' : 'events'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* DISCOVERY */}
          <section
            id="discover"
            className="scroll-mt-24 border-t border-white/[0.06] bg-[#080808]"
          >
            <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-12 lg:py-18">
              <div className="mb-9 flex flex-col gap-6 border-b border-white/[0.07] pb-7 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D6B47A]">
                    Discover
                  </p>

                  <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                    {selectedCategory === 'All'
                      ? 'What’s happening now'
                      : selectedCategory}
                  </h2>

                  <p className="mt-2 text-xs text-[#77736C]">
                    {selectedCity === 'All Cities'
                      ? 'Across India'
                      : `Events in ${selectedCity}`}
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#55524D]" />

                    <input
                      type="search"
                      placeholder="Search events or venues"
                      value={searchQuery}
                      onChange={(event) =>
                        setSearchQuery(event.target.value)
                      }
                      aria-label="Search events"
                      className="w-full rounded-full border border-white/[0.09] bg-[#101010] py-3 pl-10 pr-4 text-xs text-[#F5F5F2] outline-none transition placeholder:text-[#55524D] focus:border-[#D6B47A]/50 sm:w-64"
                    />
                  </div>

                  {(selectedCity !== 'All Cities' ||
                    selectedCategory !== 'All' ||
                    searchQuery) && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="rounded-full border border-white/[0.08] px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#A7A39B] transition hover:border-[#D6B47A]/30 hover:text-[#D6B47A]"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {filteredEvents.length === 0 ? (
                <div className="rounded-[1.5rem] border border-white/[0.07] bg-[#0D0D0D] px-6 py-24 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/[0.08] bg-[#111111]">
                    <Ticket className="h-5 w-5 text-[#55524D]" />
                  </div>

                  <h3 className="mt-5 font-display text-lg font-semibold">
                    No events found
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-[#77736C]">
                    Try another city, category, or search term to discover
                    available events.
                  </p>

                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-6 rounded-full bg-[#D6B47A] px-5 py-2.5 text-xs font-bold text-[#050505] transition hover:bg-[#E2C791]"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {filteredEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ORGANIZER CTA */}
          <section className="mx-auto w-full max-w-[1440px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-[#D6B47A]/20 bg-[#0C0C0C]">
              <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#D6B47A]/[0.07] blur-3xl" />

              <div className="relative flex flex-col gap-8 p-7 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-12">
                <div className="max-w-2xl">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-[#D6B47A]/25 bg-[#D6B47A]/[0.08] text-[#D6B47A]">
                    <Users className="h-5 w-5" />
                  </div>

                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D6B47A]">
                    For organizers
                  </p>

                  <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                    Your event deserves
                    <span className="text-[#D6B47A]"> a bigger room.</span>
                  </h2>

                  <p className="mt-4 max-w-xl text-sm leading-7 text-[#77736C]">
                    Create events, sell tickets, manage attendees and run
                    your entire event operation from one place.
                  </p>
                </div>

                <Link
                  href="/organizer/events/new"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#D6B47A] px-7 py-3.5 text-xs font-bold text-[#050505] transition hover:bg-[#E2C791] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B47A]"
                >
                  Create your event
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

      <Footer />
    </div>
  );
}