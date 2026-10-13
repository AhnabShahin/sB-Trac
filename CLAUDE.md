# BTEL Engineering — Project Instructions

This file governs how Claude Code should think about and work on this repository. Read [AGENTS.md](AGENTS.md) first — the installed Next.js version may differ from training data; verify APIs against `node_modules/next/dist/docs/` before using them.

## What this project is

Marketing/corporate site for **B-TEL Engineering Ltd** (a Bangla Trac Group subsidiary), an EPC (Engineering, Procurement, Construction) company serving substation & switchgear, solar power, MEP/EPC, and water treatment chemicals verticals. The reference design is a single long-scroll landing page (see design screenshot provided at project start) with distinct sections: hero, service divisions, stats band, vision/mission/values, project portfolio, after-sales support, partner brand grids, industry-leader logos, and a footer CTA/inquiry form.

**Phased build:**
1. **Phase 1 (current):** Static/local content, frontend-only. All copy, stats, and project data live in local TypeScript data modules (`src/data/*`), not fetched.
2. **Phase 2 (future):** Swap local data modules for real API calls. Because Phase 1 already uses Server Components + async data-fetching functions at the module boundary, Phase 2 should only require changing the implementation inside `src/data/*` fetch functions (e.g. `fetch()` against a CMS/API) — page and component code should not need to change. Keep that boundary clean from day one.

**SSR/SEO is a first-class requirement**, even in Phase 1. Default to Server Components. Only reach for `"use client"` where interactivity or browser APIs are unavoidable (animation orchestration, scroll listeners, form state, custom cursor). Never wrap more of the tree in a client boundary than necessary — push `"use client"` as far down the tree as possible so metadata, structured data, and initial HTML stay server-rendered.

## Motion & Rendering Stack

This site has an intensive, custom motion system. Treat animation architecture with the same rigor as data architecture. When building or reviewing any animated component, reason explicitly across these dimensions:

### 1. Engine identification & pipeline mix
- **GSAP + ScrollTrigger** is the primary engine for scroll-linked/scrubbed timelines (hero parallax, section pinning, staggered reveals, counters).
- **Framer Motion (`motion/react`)** is used for discrete, state-driven UI transitions (menu open/close, hover/tap states, route/page transitions, filter toggles on the portfolio grid) — anything that maps cleanly to component state rather than scroll position.
- **Lenis** provides the smooth-scroll wrapper; GSAP ScrollTrigger is synced to Lenis's scroll event, not native scroll, so all scroll math flows through one source of truth.
- No WebGL/Canvas/Three.js/PixiJS unless a specific section explicitly calls for it (e.g. a particle background) — don't add a 3D pipeline for effects achievable with CSS transforms + GSAP. If a canvas layer is introduced, it must be an isolated, independently-composited layer (own stacking context, `pointer-events` scoped correctly) so it never blocks DOM hit-testing or vice versa.
- Custom cursor (if implemented) is a single fixed-position, `pointer-events: none` layer transformed via `requestAnimationFrame`, never via React state per mouse-move.

### 2. Scroll execution & threading
- **Scrub vs. trigger, explicitly:** any animation whose progress is a direct function of scroll offset must use `scrub` (ScrollTrigger `scrub: true` or a numeric smoothing value). Anything that just needs to "play once when visible" uses `toggleActions`/`once: true` intersection-style triggers — do not scrub things that don't need to be scrubbed; scrubbing forces per-frame recalculation tied to the compositor and costs more.
- Lenis drives the raf loop; GSAP's ticker should be the single `requestAnimationFrame` driver for both Lenis and ScrollTrigger updates (`gsap.ticker.add`) — never run multiple independent rAF loops for scroll.
- `ScrollTrigger.normalizeScroll` and `lagSmoothing` should be configured deliberately, not left at defaults, once real scroll-jacked sections exist.

### 3. Performance diagnostics (Core Web Vitals)
- **INP:** No animation logic runs inside a mousemove/scroll handler without being throttled to rAF. Never set React state on every scroll/mousemove tick — mutate refs/DOM directly (`gsap.quickTo`, direct `.style` writes) and let GSAP/CSS handle the paint.
- **CLS:** Any text or layout-driven animation (counters, headline splits, marquees) must reserve space up front (fixed dimensions, `aspect-ratio`, or skeleton sizing) so it cannot shift adjacent content when it resolves. Fonts load via `next/font` (self-hosted, zero layout shift by default, no FOUT/FOIT swap jank) — never load fonts via a render-blocking `<link>` to Google Fonts.
- **GPU vs. CPU bound:** Animate only `transform` and `opacity` wherever physically possible. Never animate `height`, `width`, `margin`, `top/left`, or `box-shadow`/`text-shadow` in a scrubbed or high-frequency context — use `transform: scale`/`translate` and pre-rendered shadow layers instead. Apply `will-change: transform` narrowly (only on elements actively animating, removed after), never globally.

### 4. Accessibility & progressive enhancement
- Every motion module must branch on `prefers-reduced-motion`. Use a shared `useReducedMotion` hook (Framer Motion ships one; mirror the same check for GSAP contexts via `matchMedia`). Reduced-motion fallback = static final-state layout, not a broken half-animated frame — set the end-state styles directly, skip the timeline entirely, don't just set duration to 0 on a transform-heavy sequence.
- Elements translated/scaled off-viewport (marquee clones, off-screen carousel slides, animated-out nav panels) must be removed from tab order (`tabIndex={-1}`, `aria-hidden="true"` or `inert`) while hidden, and restored when they become interactive again. Never leave a visually-hidden but focusable element reachable by keyboard.
- Respect `prefers-contrast` and maintain visible focus states through every animated transform — focus rings must not be clipped by `overflow: hidden` wrappers used for reveal animations.

### 5. Implementation patterns to follow
- Marquees, particle fields, and any continuous-loop animation: build with `useRef` + a single rAF/GSAP timeline set up in `useLayoutEffect`/`useGSAP`, never with React state driving per-frame updates. Duplicate content for seamless looping (`aria-hidden` on the clone).
- Prefer GSAP's `useGSAP()` hook (`@gsap/react`) for scoping and automatic cleanup (`gsap.context`) over manual `useEffect` teardown.
- Scroll-triggered component reveals should share one small set of composable primitives (e.g. a `<Reveal>` wrapper, a `useScrollTimeline` hook) rather than bespoke GSAP code duplicated per section.

### 6. Optimization playbook (apply proactively, not just when things break)
- Passive event listeners everywhere scroll/touch is observed (`{ passive: true }`).
- Throttle/debounce is rarely needed if input handling writes to refs and a single rAF tick reads them — prefer that pattern over manual throttling.
- On coarse-pointer/mobile or `navigator.hardwareConcurrency`-limited devices, degrade gracefully: reduce or disable parallax depth, drop particle counts, disable custom cursor (it's meaningless on touch anyway — gate it behind a pointer-fine media query), and consider disabling Lenis smooth-scroll in favor of native scroll on touch devices (Lenis defaults to this — don't override it).
- Code-split heavy motion sections with `next/dynamic` (`ssr: false` only for genuinely client-only pieces like a canvas/particle background) so GSAP/Lenis JS doesn't block first paint of above-the-fold server-rendered content.

## Design system

- Dark navy (`#0a1628`-ish) hero/CTA sections against light neutral sections, with a cyan/teal accent (`#00d9c0`-ish) and amber/gold accent for badges — sample and formalize exact values into Tailwind theme tokens (`src/app/globals.css` `@theme`) rather than hardcoding hex values in components.
- Match the reference screenshot's structure and content faithfully; elevate the interaction/motion quality beyond the static reference per the user's request ("advanced UI/UX animation transitions").

## Working conventions

- Don't add abstractions, config, or dependencies beyond what a section currently needs.
- Real content from the reference screenshot (stats: 60+ industry leaders, 38+ projects, 500Cr+ value, 16yr experience, etc.) goes in `src/data/`; keep it typed.
- No comments explaining *what* code does. Comment only non-obvious *why* (e.g. why a particular GSAP config value was chosen for perf reasons).
- Run `npm run lint` and a build check after non-trivial changes; visually verify animated sections in a real browser before calling a section done.
