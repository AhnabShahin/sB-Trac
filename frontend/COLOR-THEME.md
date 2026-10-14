# Color Theme Analysis — Aligning the Site Blue to the Logo Blue

**Status:** ✅ **Implemented.** Lint and production build pass. See §10 for the as-built record,
including three decisions that were made during execution and differ from the §6 plan.

**Scope guard:** This document covers color tokens and color-carrying utility classes only.
No structural, layout, spacing, typography, or component changes are proposed or implied.

---

## 1. Measurement — what the logo blue actually is

Sampled from `public/logo.jpeg` (2380×450), taking the exact modal pixel value from the
interior of the solid blue bar (60×100 px patch at x=980, y=170), away from antialiased
letter edges and JPEG ringing.

| | Value |
|---|---|
| **Logo blue** | **`#203169`** — `rgb(32, 49, 105)` |
| Confidence | 3,627 of ~3,800 non-white pixels in the sample patch (95%) |
| HSL | `hsl(226, 53%, 27%)` |
| OKLCH | `oklch(33.3% 0.100 267.9)` |
| Mean of all dark-blue pixels across the full logo | `#1c3670` (pulled darker/greener by edge artifacts — the modal value is the truer read) |

The logo also contains an **off-white `#f0f0f0` background plate** covering 64% of the image.
See §9 — this is a separate, real problem.

## 2. Measurement — what the site blue currently is

From `src/app/globals.css`:

| Token | Hex | HSL | OKLCH |
|---|---|---|---|
| `--color-blue` | `#1a6edb` | `hsl(214, 79%, 48%)` | `oklch(55.4% 0.184 257.6)` |
| `--color-blue2` (hover) | `#1558b0` | `hsl(214, 79%, 39%)` | `oklch(47.3% 0.155 257.6)` |
| `--color-blue-light` | `#7bbcff` | `hsl(210, 100%, 74%)` | `oklch(77.8% 0.117 250.2)` |

## 3. The gap — and why it is not a small one

Comparing the logo blue to the current `--color-blue`:

| Dimension | Logo `#203169` | Site `#1a6edb` | Delta |
|---|---|---|---|
| OKLCH lightness | 33.3% | 55.4% | **−22.1 points** |
| OKLCH chroma | 0.100 | 0.184 | **−45% saturation** |
| OKLCH hue | 267.9° | 257.6° | **+10.3° toward indigo/violet** |

Your read is correct — they are not the same blue. But the mismatch is **not a tint drift that
can be fixed by find-and-replacing one hex**. The two colors occupy different roles on the
lightness axis:

- `#203169` is a **dark navy-indigo ink**. It is a *surface* and *text* color.
- `#1a6edb` is a **mid-tone azure**. It is an *interactive accent* color.

### The blocking constraint

This site is roughly half dark-navy sections (hero, footer, CTA bands, every service hero,
contact). Contrast of each candidate against the actual backgrounds in use:

| Background | Logo `#203169` | Current `#1a6edb` |
|---|---|---|
| `#ffffff` white | **12.32:1** ✅ | 4.89:1 ⚠️ (bare AA) |
| `#f4f6f9` offwhite | **11.38:1** ✅ | 4.51:1 ⚠️ (bare AA) |
| `#0b1829` navy | **1.45:1** ❌ | 3.65:1 ⚠️ |
| `#112236` navy2 | **1.31:1** ❌ | 3.29:1 ⚠️ |
| `#0f2035` card | **1.33:1** ❌ | 3.36:1 ⚠️ |

**A literal global swap to `#203169` would make the blue invisible on every dark section of
the site.** At 1.45:1 against the navy, `text-blue` labels, `border-blue/30` rings, the
`from-blue` half of the hero headline gradient, and the icon chips all effectively disappear.

Conversely, `#203169` is a genuine *improvement* on light backgrounds: white-on-blue buttons
go from 4.89:1 to **12.32:1**.

So there was a real decision to make here. It is resolved in §5.

## 4. Where blue is used today (full audit)

### 4a. Token-based usage — 84 occurrences across `src/`

| Class | Count | | Class | Count |
|---|---|---|---|---|
| `bg-blue` | 22 | | `bg-blue/10` | 3 |
| `text-blue` | 18 | | `border-blue/40` | 2 |
| `text-blue-light` | 12 | | `border-blue/20` | 2 |
| `bg-blue2` | 6 | | `border-blue` | 2 |
| `border-blue/30` | 5 | | `bg-blue/20` | 2 |
| `from-blue` | 3 | | `bg-blue/15` | 2 |
| `to-blue` / `via-blue-light` | 2 | | `text-blue/40`, `border-blue/50`, `border-blue/25` | 3 |

### 4b. Hardcoded blue outside the token system — 14 sites

These bypass `globals.css` entirely and will **not** update when the token changes. Every one
must be converted or it will silently keep the old azure and produce a visible two-blue site:

| File | Line | Value |
|---|---|---|
| `src/components/sections/hero-section.tsx` | 28 | `rgba(26,110,219,0.12)` |
| `src/components/sections/hero-service-stack.tsx` | 25–26 | `#1A6EDB`, `rgba(26,110,219,0.15)` |
| `src/components/sections/contact-section.tsx` | 32 | `rgba(26,110,219,0.12)` |
| `src/components/sections/principle-section.tsx` | 22 | `rgba(26,110,219,0.16)` |
| `src/components/sections/service-detail-hero.tsx` | 11 | `rgba(26,110,219,0.16)` |
| `src/components/ui/project-detail-modal.tsx` | 29 | `rgba(26,110,219,0.28)` |
| `src/app/clients/page.tsx` | 49 | `rgba(26,110,219,0.08)` |
| `src/app/partners/page.tsx` | 53 | `rgba(26,110,219,0.08)` |
| `src/app/projects/page.tsx` | 87 | `rgba(26,110,219,0.10)` |
| `src/app/contact/page.tsx` | 87 | `rgba(26,110,219,0.12)` |
| `src/app/services/substation/page.tsx` | 148, 255 | `rgba(26,110,219,0.2)`, `rgba(26,110,219,0.1)` |

### 4c. The dual-role problem

`text-blue` is currently used on **both** light and dark surfaces:

- On light: `services/substation/page.tsx:262` — `bg-blue/10 text-blue` inside a white card.
- On dark: `projects/page.tsx:112` — `border-blue/30 bg-blue/[0.10] text-blue` on a navy hero.

Meanwhile `text-blue-light` (`#7bbcff`) is the dark-surface variant in *some* places
(`substation:166`, `client-industry-bands.tsx:33`) but not consistently. **The existing system
is already inconsistent about which blue goes on which surface** — this retheme is the natural
point to fix that, but doing so touches which class each site uses, so it needs your sign-off.

## 5. Decisions taken

All questions from the first draft of this document have been answered. Locked:

| # | Question | Decision |
|---|---|---|
| Q1 | Strategy | **B — exact logo blue on light surfaces, same-hue lighter tint on dark** |
| Q2 | Source of truth | **Use the measured `#203169`** (no brand book supplied) |
| Q3 | Navy family | **Full hue-match to 267.9°** — see correction below |
| Q4 | Other accents | **Leave teal / amber / purple / cyan untouched** |
| Q5 | Accessibility | **Match current levels, do not regress** |
| Q6 | Logo asset | **Fix as a follow-up task after the retheme** |
| Q7 | Hardcoded values | **Convert all 14 to tokens** |
| Q8 | `text-blue` → `text-blue-light` on dark | **Approved** |

### Correction to §5 of the first draft

The first draft warned that hue-matching the navy family would be a "larger visual change
across every dark section". **That was wrong, and the measurement disproves it.** Navy sits at
OKLCH chroma 0.039 — so low that rotating its hue a full 12° to the logo's changes the hex by
only 1–5 points per channel:

| Token | Current | Full hue-match | White-text contrast |
|---|---|---|---|
| `--color-navy` | `#0b1829` | `#101729` | 17.84 → 17.85 |
| `--color-navy2` | `#112236` | `#182037` | — |
| `--color-navy3` | `#060f1a` | `#090e1a` | — |
| `--color-card` | `#0f2035` | `#161e36` | — |
| `--color-border` | `#1e3050` | `#232f50` | — |

There is no tradeoff to hedge against, so the full match was taken rather than a partial one.

## 6. Final palette

Every blue token below sits at **OKLCH hue 267.9° — identical to the logo**, differing only in
lightness. No blue on the site will be a different hue from the logo.

```css
/* Blue — anchored on the logo */
--color-blue:       #203169;  /* LOGO BLUE, EXACT. oklch(33.3% 0.100 267.9) */
--color-blue2:      #324ca7;  /* hover.        oklch(45%   0.150 267.9) */
--color-blue-light: #9fb9fc;  /* on dark.      oklch(79%   0.100 267.9) */

/* Navy — hue-matched, lightness and chroma preserved exactly */
--color-navy:   #101729;
--color-navy2:  #182037;
--color-navy3:  #090e1a;
--color-card:   #161e36;
--color-border: #232f50;

/* Unchanged by decision Q4 */
--color-teal: #0a9e88;  --color-amber:  #e08a00;
--color-cyan: #0ea5b5;  --color-purple: #7c3aed;
```

### Note on `--color-blue2` (hover)

All 6 uses of `bg-blue2` are `hover:bg-blue2` on a filled `bg-blue` button with white text —
it is purely a hover state, never a standalone fill. The current system *darkens* on hover
(`#1a6edb` → `#1558b0`). Since `bg-blue` is now the dark `#203169`, darkening further would be
imperceptible, so **the hover direction is inverted to lighten** (`#203169` → `#324ca7`).
White-on-hover contrast improves from 6.87:1 to 7.70:1. This is the one deliberate behavioural
change in the palette; everything else is a pure color substitution.

### Regression check against decision Q5

| Pairing | Current | Proposed | |
|---|---|---|---|
| `text-blue` on white | 4.89 | **12.32** | improved |
| white on `bg-blue` (button) | 4.89 | **12.32** | improved |
| white on `bg-blue2` (hover) | 6.87 | **7.70** | improved |
| `text-blue-light` on navy | 8.90 | **9.20** | improved |
| white on navy | 17.84 | 17.85 | unchanged |
| `muted` on navy | 4.08 | 4.08 | unchanged |

`--color-blue-light` was set to L 79% rather than the ramp's nominal 75% (`#93acee`)
specifically because 75% measured 7.97:1 against the new navy — a **regression** from the
current 8.90:1, which Q5 forbids. L 79% restores it to 9.20:1.

Nothing in the palette regresses. Every changed pairing improves.

## 7. Implementation plan

Strictly color-only. No structural, layout, spacing, typography, or markup changes.

**Step 1 — `src/app/globals.css`**
Replace the 8 token values in §6. The `@theme inline` block needs no edit; it only aliases.

**Step 2 — convert the 14 hardcoded values** listed in §4b from `rgba(26,110,219,…)` and
`#1A6EDB` to the new blue. Because these are rgba with alpha, they become
`rgba(32,49,105,…)` — or `color-mix()` against the token where the surrounding code allows it.
Alpha values stay exactly as they are.

⚠️ **These sit on dark backgrounds in most cases** (hero radial glows, service-detail hero
tints, modal accents). At those low alphas (0.08–0.28) a dark navy-indigo glow over navy will
be far subtler than the current azure glow. Each of the 14 needs a visual check, and some may
want `--color-blue-light` rather than `--color-blue` to preserve the intended glow effect.
This is the highest-risk part of the change and where review attention belongs.

**Step 3 — reassign dark-surface `text-blue` → `text-blue-light`.** Roughly 8 of the 18
`text-blue` sites are on navy. Each must be confirmed individually by reading its surrounding
background class — no blanket find-and-replace, since the other ~10 are on white cards and
must keep `text-blue` to receive the exact logo blue.

**Step 4 — verify.** `npm run lint`, `npm run build`, then visual check of the affected
sections in a browser.

## 8. Out of scope / follow-ups

- **Logo asset (§9).** Deferred by decision Q6 — transparent-background SVG/PNG as a separate
  task once the retheme is reviewed.
- **Accent palette.** Untouched by decision Q4. The blue↔purple hue separation narrows from
  35° to 25°, mitigated by a 2.5× chroma gap (0.100 vs 0.247). Worth a look during review, but
  not being changed.

## 9. Separate finding — the logo asset

`public/logo.jpeg` is a **JPEG with an opaque `#f0f0f0` background plate** (64% of its pixels).
It is rendered at `site-header.tsx:248` on a `bg-navy` bar and at `site-footer.tsx:8` on
`bg-navy3` — both dark. The logo therefore currently renders as a **light-grey rectangle
floating on dark navy**, patched over with `rounded-[3px]` to soften the seam.

Two consequences:
1. JPEG is lossy, so the logo blue on screen is already slightly variable pixel-to-pixel.
2. No amount of token matching will make the logo integrate while it carries a grey box.

Deferred to a follow-up task per decision Q6.


---

## 10. As-built record

Executed on the plan in §7. Lint clean, `npm run build` green, 14/14 static pages generated.

### Final tokens (`src/app/globals.css`)

```css
--color-navy:   #101729;   /* was #0b1829 */
--color-navy2:  #182037;   /* was #112236 */
--color-navy3:  #090e1a;   /* was #060f1a */
--color-card:   #161e36;   /* was #0f2035 */
--color-border: #232f50;   /* was #1e3050 */
--color-blue:       #203169;  /* was #1a6edb — LOGO BLUE, EXACT */
--color-blue2:      #849cdd;  /* was #1558b0 — see change 2 below */
--color-blue-light: #9fb9fc;  /* was #7bbcff */
--foreground:   #101729;   /* was #0b1829 (navy family) */
```

Teal, amber, purple, cyan, offwhite and muted are untouched, per decision Q4.

### Scope actually touched

| | Count |
|---|---|
| Token values changed in `globals.css` | 9 |
| Files with hardcoded navy hue-matched | 14 |
| Hardcoded blue values converted | 14 (13 → `blue-light`, 1 → logo blue) |
| Class reassignments on dark surfaces | 25 lines |
| Additional at-risk sites found and fixed | 14 (see below) |

Verified zero remaining references to `#1a6edb`, `rgba(26,110,219,…)`, `#7bbcff`, `#1558b0`,
or any pre-shift navy hex anywhere in `src/`.

### Three changes that differ from the §6 plan

**1. CTA buttons became light-on-dark.** §6 assumed filled `bg-blue` buttons would carry the
logo blue at 12.32:1 white-on-blue. On audit, **all 6 filled CTAs sit on dark surfaces** — none
on light. The logo blue button measured **1.31:1 against navy**, so the button *shape*
disappeared even though its label stayed readable. That is a regression from the 3.30:1
baseline, which decision Q5 forbids. Resolved (with sign-off) as `bg-blue-light text-navy`:

| | button vs background | label on button |
|---|---|---|
| before (`#1a6edb` + white) | 3.30 | 4.89 |
| **after (`#9fb9fc` + navy)** | **8.32** | **9.20** |

**2. `--color-blue2` was repurposed, not just recolored.** All 6 of its uses are
`hover:bg-blue2` on those same CTAs. Once the button became light, a dark hover would have
inverted the label contrast. `blue2` is now the *light* hover step (`#849cdd`, hue 267.9,
L 70%) — navy label on it holds 6.61:1. No new token was added and all 6 hover sites work
unchanged.

**3. Alpha tints and decorative marks were reassigned too, not only `text-blue`.** §7 Step 3
named `text-blue`. In practice `border-blue/30`, `bg-blue/[0.12]`, gradient `from-blue` stops,
pulse dots, category accent bars and one **focus ring** had the identical problem on dark
surfaces. All were moved to `blue-light`. The focus ring
(`inquiry-form.tsx:8`, `focus:border-blue`) is worth calling out — left alone it would have
become an invisible keyboard-focus indicator on a dark form.

Also collapsed `from-blue via-blue-light to-teal` → `from-blue-light to-teal` at
`services/substation/page.tsx:173`, since both stops would otherwise have been the same color.

### Where the exact logo blue `#203169` now appears

- All 6 light-surface accent labels (`services-section`, `partners-section`, `partners/page`,
  and three on `services/substation`) — 11.38:1 on offwhite.
- The white-card hover shadow at `services/substation/page.tsx:255`.

On dark surfaces the site uses `#9fb9fc` / `#849cdd` — the **same OKLCH hue, 267.9°**, differing
only in lightness. No blue anywhere on the site is a different hue from the logo.

### Not done (unchanged from §8)

- **Logo asset.** `public/logo.jpeg` still carries its opaque `#f0f0f0` plate on the dark
  header and footer. Deferred by decision Q6 — this is the recommended next task.
- **Visual review.** Lint and build pass, and every change is contrast-verified by
  calculation, but the result has not been viewed in a browser. Worth a pass on the hero,
  the projects filter pills, and the service-detail hero glows.
