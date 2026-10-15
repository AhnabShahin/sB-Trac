// Shared content shapes for DB-backed pages. These are the single source of
// truth consumed by the public server components (render) and the admin editor
// (entry forms). A section's shape lives here so both stay in lockstep.

/* ------------------------------------------------------------------ hero --- */

export interface HeroStat {
  value: number;
  suffix: string;
  label: string;
}

export type HeroSlide =
  | { type: "image"; src: string }
  | { type: "video"; mp4Src: string; poster: string };

export type HeroServiceIcon = "bolt" | "sun" | "crane" | "droplet" | "wrench";

export interface HeroServiceCard {
  icon: HeroServiceIcon;
  title: string;
  subtitle: string;
  /** Accent hex (e.g. "#0A9E88"); drives the icon tint, underline and icon chip. */
  accent: string;
  href: string;
  image?: string;
  /** Spans both columns (used for the wide "After Sales" card). */
  wide?: boolean;
}

export interface HeroContent {
  badge: string;
  headline: { line1: string; line2Prefix: string; highlight: string };
  subhead: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  stats: HeroStat[];
  slides: HeroSlide[];
  services: HeroServiceCard[];
}

/* ------------------------------------------------- principle / who we are --- */

export type PillarAccent = "teal" | "blue" | "amber";

export interface Pillar {
  title: string;
  accent: PillarAccent;
  description: string;
  items: { label: string }[];
}

export interface AtAGlanceFact {
  label: string;
  value: string;
  accent?: boolean;
}

export interface CompanyStat {
  value: string;
  accent?: string;
  description: string;
}

export interface PrincipleContent {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  ctaLabel: string;
  ctaHref: string;
  glanceTitle: string;
  facts: AtAGlanceFact[];
  stats: CompanyStat[];
  foundationEyebrow: string;
  foundationHeading: string;
  pillars: Pillar[];
}

/* --------------------------------------------------------------- iso band --- */

export interface IsoBandContent {
  headingPrefix: string;
  headingHighlight: string;
  headingSuffix: string;
  text: string;
  badge: string;
  badgeAlt: string;
}

/* --------------------------------------------------------------- strength --- */

export type StrengthIcon = "hardhat" | "coins" | "factory" | "truck" | "target";

export interface StrengthPillarItem {
  title: string;
  description: string;
  icon: StrengthIcon;
}

export interface StrengthContent {
  eyebrow: string;
  heading: string;
  intro: string;
  pillars: StrengthPillarItem[];
}

/* ---------------------------------------------------------------- support --- */

export type SupportIcon = "wrench" | "refresh" | "target" | "clock";

export interface SupportFeatureItem {
  title: string;
  description: string;
  icon: SupportIcon;
}

export interface SupportContent {
  eyebrow: string;
  heading: string;
  intro: string;
  features: SupportFeatureItem[];
}

/* --------------------------------------------------------- client logos --- */

export interface ClientLogo {
  name: string;
  logo: string;
}

export interface ClientMarqueeContent {
  ariaLabel: string;
  clients: ClientLogo[];
}

/* --------------------------------------------------------------- timeline --- */

export interface TimelineMilestoneContent {
  year: string;
  title: string;
  description: string;
  image?: string;
}

export interface TimelineContent {
  eyebrow: string;
  headingLine1: string;
  headingHighlight: string;
  intro: string;
  milestones: TimelineMilestoneContent[];
}

/* -------------------------------------------------------------- portfolio --- */

export type PortfolioAccent = "teal" | "blue" | "amber" | "purple" | "cyan";

export interface PortfolioCard {
  categoryLabel: string;
  accent: PortfolioAccent;
  count: string;
  countSuffix: string;
  highlightLabel: string;
  title: string;
  metric: string;
  href: string;
  image?: string;
}

export interface ProjectsContent {
  eyebrow: string;
  headingLine1: string;
  headingLine2: string;
  cards: PortfolioCard[];
}

/* ------------------------------------------------------------- partner cta --- */

export interface PartnerCtaContent {
  eyebrow: string;
  headingLine1: string;
  headingLine2: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
}

/* ----------------------------------------------------------------- home ---- */

export interface HomeSections {
  hero?: HeroContent;
  clientMarquee?: ClientMarqueeContent;
  principle?: PrincipleContent;
  isoBand?: IsoBandContent;
  strength?: StrengthContent;
  timeline?: TimelineContent;
  projects?: ProjectsContent;
  support?: SupportContent;
  partnerCta?: PartnerCtaContent;
}
