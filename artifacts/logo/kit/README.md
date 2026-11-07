# CtrlPass Mark — "Aperture Pass"

The C-gate admits the pass: a bold C-ring (the gate) with a chevron passing
through its mouth (the pass / forward control). Replaces the raster CP+sparkle
logo; keeps the champagne-gold / near-black palette.

## Geometry

256×256 grid. Ring outer R 88, inner R 56 (32 thick), mouth half-angle 38°.
Chevron stroke 30, round join, tip at x≈183. Two paths only — scales to 16 px
cleanly (tested: 16/32/48 px, one-colour, reversed, mirror, squint).

## Colours

| Token | Value | Use |
|---|---|---|
| champagne | `#D6B47A` | ring, wordmark accent |
| champagne-bright | `#E4C98F` | chevron |
| surface | `#111111` | chip / app-icon ground |
| ink | `#111111` | single-colour mark on light |
| white | `#FFFFFF` | reversed mark (thinned ~6%) |

## Files

- `mark.svg` — master, duotone gold, transparent
- `mark-ink.svg` / `mark-white.svg` — single-colour for light/dark grounds
- `app-icon.svg` — gold mark on `#111111` rounded square (rx 58)
- `concept-a/b/c.svg` (parent dir) — concept round; C "Gate Monogram" is the
  documented alternate if a letter-tied mark is ever preferred

## Shipped to the app

- `apps/web/public/brand/logo.png` (duotone, transparent) — web BrandMark chip
- `apps/web/public/brand/app-icon.png` — apple touch icon
- `apps/web/public/brand/favicon.ico` (16/32/48, ink) — browser tab
- `apps/mobile/assets/brand/logo.png` + `app-icon.png` (1024) — Expo icon
- `apps/mobile/src/components/BrandLogo.tsx` — vector mark (react-native-svg)

---

## Hallmark redesign handoff (home page)

Theme **kiln: ember** (draw 83a04f) · full redesign of `/` · photos swapped to
Hallmark's Wikimedia library, credited in the footer.

**Stand-ins to replace with your own material** (each is a `data-slot` / noted path):
- Hero photo: `public/photos/beach-please-2022-...jpg` — slot `hero`, `data-alt` says what belongs there: your own photograph of a real event or venue.
- Empty-state photo: `public/photos/tianjin-...jpg` — hidden once real events render.
- Card fallback: `EventImage.tsx` fallback → `lights-2011-...jpg`.

**Copy dropped in the redesign** (was on the old page):
- "Live events across India" eyebrow chip, three trust chips (Real events / Secure booking / Instant access), footer trust badges, "Built for modern events · India-first ticketing · Made with precision" strip, BrandMark tagline "Discover · Book · Experience". Facts live on as the FAQ rows; nothing a visitor could do was lost.

**Documented gate dispositions** (in the globals.css stamp):
- 76 ×2 dismissed: credits are on the rendered page (Footer.tsx); the static linter cannot see across imports.
- 49b ×2 waived: credit-author names wrap to two lines at 320px — real names, cannot shorten.
- 58 dismissed by finish review: the questions window holds ~50 words of one-line rows.
- Hero review: fix · 3 findings · 3 resolved. Finish review: fix · 5 findings · 4 resolved, 1 dismissed.

**Deferred (not in this pass):** organizer/admin app screens keep the old
monochrome system; auth pages inherit the new fonts + tokens via shared
components but were not recomposed; `cinematic-landing-hero.tsx` and
`EventCard.tsx` are now unused on `/` (still used by other routes) and keep
their old internals until those routes get their own Hallmark pass.

## Mobile re-skin (apps/mobile)

Same kiln system, restyle depth (layouts untouched):
- `src/theme/colors.ts` — all kiln token values under the existing token names (every screen re-skins via tokens; accent stays brand champagne).
- `src/theme/typography.ts` — display face = system serif (iOS New York / Android serif), Boska's slot with no new font dependency.
- `src/theme/brand.ts` — dead requires removed; library photos copied to `assets/photos/` (event-card fallback + venue empty state).
- Tell sweep: 208 tracked micro-labels (6-10px uppercase, letter-spaced) normalized to untracked 11px+ labels across 26 screens; "SEARCH" eyebrow, greeting caps, and the "DISCOVER · BOOK · EXPERIENCE" strip removed from Home.
- Two tracked styles over 10px left deliberately; typecheck passes with 0 errors.

## Startup logo draw (apps/mobile)

Ported from github.com/RhuanCruz/swiftui-logo-draw (MIT) to React Native:
`src/components/LogoDraw.tsx` — same API as the SwiftUI view (drawDuration,
fillStartPercent, fillDuration, replayTrigger, onComplete, accessibilityName,
Reduce-Motion shows the mark complete immediately), implemented with
react-native-svg stroke-dash + RN Animated (JS driver for SVG props).

`LogoSplash.tsx` draws the CtrlPass mark on the kiln ground (#0B0605), fades in
the CTRL*PASS* wordmark, then `RootNavigator` fades the overlay out over the
app — it plays once per launch, over whichever auth state resolves first.
Frame check: artifacts/logo/renders/logo-draw-frames.png.
