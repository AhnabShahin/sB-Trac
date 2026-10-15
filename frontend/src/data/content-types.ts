// Shared content shapes for DB-backed pages. These are the single source of
// truth consumed by the public server components (render) and the admin editor
// (entry forms). A section's shape lives here so both stay in lockstep.

import type { ProductCategory } from "@/data/products";
import type { Project } from "@/data/company";

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

/* ============================================ products & services page ===== */

export interface ServicesHeroContent {
  badge: string;
  headingPrefix: string;
  headingHighlight: string;
  headingSuffix: string;
  subhead: string;
  /** Background crossfade banner images. */
  banners: string[];
}

export type ServiceRowIcon = "bolt" | "sun" | "wrench" | "droplet" | "clock";

export interface ServiceRow {
  index: string;
  title: string;
  description: string;
  tags: string[];
  icon: ServiceRowIcon;
  href: string;
  image: string;
}

export interface ServiceListContent {
  eyebrow: string;
  heading: string;
  intro: string;
  services: ServiceRow[];
}

export interface ProductsShowcaseContent {
  eyebrow: string;
  headingLine1: string;
  headingLine2: string;
  // Reuses the catalogue shape the client ProductCatalog + modal already consume
  // (category → sub-category → product, with write-ups and galleries).
  categories: ProductCategory[];
}

export interface ServicesCtaContent {
  eyebrow: string;
  heading: string;
  intro: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface ProductsServicesSections {
  servicesHero?: ServicesHeroContent;
  serviceList?: ServiceListContent;
  productsShowcase?: ProductsShowcaseContent;
  servicesCta?: ServicesCtaContent;
}

/* ==================================================== projects page ========= */

export type ProjectsAccent = "blue" | "amber" | "teal" | "purple" | "cyan";

export interface ProjectsHeroContent {
  accent: ProjectsAccent;
  badge: string;
  headingLine1: string;
  headingHighlight: string;
  headingSuffix: string;
  subhead: string;
  image: string;
}

export interface ProjectsStat {
  value: number;
  suffix: string;
  prefix?: string;
  description: string;
}

export interface ProjectsStatsContent {
  stats: ProjectsStat[];
}

export interface PortfolioContent {
  // Reuses the Project shape the client ProjectPortfolioGrid + modal consume.
  projects: Project[];
}

export interface TrackRecordCardContent {
  tag: string;
  accent: ProjectsAccent;
  /** Portfolio filter this card jumps to ("mep" | "solar" | "substation" | …). */
  filter: string;
  title: string;
  description: string;
}

export interface TrackRecordContent {
  eyebrow: string;
  headingLine1: string;
  headingLine2: string;
  cards: TrackRecordCardContent[];
}

export interface ProjectsCtaContent {
  eyebrow: string;
  headingLine1: string;
  headingLine2: string;
  intro: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface ProjectsSections {
  projectsHero?: ProjectsHeroContent;
  statsBand?: ProjectsStatsContent;
  portfolio?: PortfolioContent;
  trackRecord?: TrackRecordContent;
  projectsCta?: ProjectsCtaContent;
}

/* ==================================================== partners page ========= */

export interface PartnersHeroContent {
  accent: ProjectsAccent;
  badge: string;
  headingLine1: string;
  headingHighlight: string;
  subhead: string;
  image: string;
}

export interface PartnerLogo {
  name: string;
  logo: string;
}

export interface PartnerWallContent {
  eyebrow: string;
  heading: string;
  description: string;
  logos: PartnerLogo[];
}

export interface PartnersCtaContent {
  eyebrow: string;
  heading: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}

export interface PartnersSections {
  partnersHero?: PartnersHeroContent;
  partnerWall?: PartnerWallContent;
  partnersCta?: PartnersCtaContent;
}

/* ==================================================== clients page ========= */

export type ClientsTrustIcon = "factory" | "globe" | "landmark" | "cap";

export interface ClientsTrustBadge {
  icon: ClientsTrustIcon;
  title: string;
  subtitle: string;
}

export interface ClientsHeroContent {
  accent: ProjectsAccent;
  badge: string;
  headingLine1: string;
  headingHighlight: string;
  headingSuffix: string;
  subhead: string;
  image: string;
  badges: ClientsTrustBadge[];
}

export interface ClientsStat {
  value: number;
  suffix: string;
  /** Supports a line break (\n) to split the label across two lines. */
  label: string;
}

export interface ClientsStatsContent {
  stats: ClientsStat[];
}

export type ClientIndustryIcon =
  | "cart"
  | "crane"
  | "bolt"
  | "flask"
  | "broadcast"
  | "landmark"
  | "cap";

export type ClientIndustryAccent = "teal" | "blue" | "amber" | "purple";

export interface ClientLogoEntry {
  name: string;
  logo?: string;
}

export interface ClientIndustryGroup {
  industry: string;
  icon: ClientIndustryIcon;
  accent: ClientIndustryAccent;
  focus: string;
  clients: ClientLogoEntry[];
}

export interface ClientsBandsContent {
  industries: ClientIndustryGroup[];
}

export interface ClientTestimonialItem {
  quote: string;
  author: string;
  role: string;
}

export interface ClientsTestimonialsContent {
  eyebrow: string;
  headingLine1: string;
  headingHighlight: string;
  items: ClientTestimonialItem[];
}

export interface ClientsCtaContent {
  eyebrow: string;
  headingLine1: string;
  headingLine2: string;
  body: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}

export interface ClientsSections {
  clientsHero?: ClientsHeroContent;
  clientsStats?: ClientsStatsContent;
  clientsBands?: ClientsBandsContent;
  clientsTestimonials?: ClientsTestimonialsContent;
  clientsCta?: ClientsCtaContent;
}

/* ==================================================== contact page ========= */

export interface ContactWhatsappLink {
  label: string;
  /** Digits only, country code included — used to build the wa.me URL. */
  waId: string;
}

export interface ContactHeroContent {
  badge: string;
  headingLine1: string;
  headingHighlight: string;
  headingLine3: string;
  subhead: string;
  image: string;
  whatsappEyebrow: string;
  whatsappLinks: ContactWhatsappLink[];
}

export interface ContactFormContent {
  heading: string;
  intro: string;
  services: string[];
  budgets: string[];
  consentLabel: string;
  submitLabel: string;
  footnote: string;
  successTitle: string;
  successBody: string;
}

export type ContactCardIcon =
  | "pin"
  | "factory"
  | "phone"
  | "whatsapp"
  | "mail"
  | "globe"
  | "clock"
  | "shield";

export interface ContactDetailCard {
  icon: ContactCardIcon;
  label: string;
  value: string;
  href?: string;
  full?: boolean;
  accent?: boolean;
}

export interface ContactSocialLink {
  label: "Facebook" | "LinkedIn";
  href: string;
}

export interface ContactDetailsContent {
  eyebrow: string;
  heading: string;
  intro: string;
  cards: ContactDetailCard[];
  socials: ContactSocialLink[];
  mapLabel: string;
  mapEmbedSrc: string;
}

export interface ContactFaqItem {
  question: string;
  answer: string;
}

export interface ContactFaqContent {
  eyebrow: string;
  heading: string;
  intro: string;
  faqs: ContactFaqItem[];
}

export interface ContactSections {
  contactHero?: ContactHeroContent;
  contactForm?: ContactFormContent;
  contactDetails?: ContactDetailsContent;
  contactFaq?: ContactFaqContent;
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

/* ================================== products-services sub-pages (shared) === */

export type ServiceIconKey =
  | "bolt" | "panel" | "transformer" | "broadcast" | "anchor" | "globe"
  | "lightbulb" | "factory" | "hardhat" | "flask" | "sun" | "plug" | "battery"
  | "leaf" | "handshake" | "wrench" | "flame" | "shield" | "truck" | "droplet"
  | "recycle" | "clock" | "checklist" | "phone" | "target" | "mail" | "whatsapp";

export type ServiceAccent = "blue" | "amber" | "teal" | "purple" | "cyan";

export interface ServiceSubHeroStat {
  value: string;
  unit?: string;
  label: string;
}

export interface ServiceHeroCta {
  label: string;
  href: string;
}

export interface ServiceSubHeroContent {
  accent: ServiceAccent;
  badge: string;
  breadcrumbLabel: string;
  headingLine1: string;
  headingHighlight: string;
  headingSuffix?: string;
  subhead: string;
  image: string;
  stats: ServiceSubHeroStat[];
  primaryCta?: ServiceHeroCta;
  secondaryCta?: ServiceHeroCta;
}

export interface ServiceCardItem {
  icon: ServiceIconKey;
  title: string;
  description: string;
  href?: string;
  tag?: string;
  /** Visually distinguishes one card in the grid (e.g. the AMC card on After Sales). */
  highlight?: boolean;
  /** Hex accent for this card's icon chip + hover border. Admin-editable per card. */
  accentColor: string;
}

export interface ServiceCardSectionContent {
  eyebrow: string;
  heading: string;
  intro?: string;
  cards: ServiceCardItem[];
}

export interface ServiceSliderImageItem {
  image: string;
  caption: string;
}

export interface ServiceSliderSectionContent {
  eyebrow: string;
  images: ServiceSliderImageItem[];
}

export interface ServiceSpecRow {
  label: string;
  value: string;
}

export interface ServiceSpecsSectionContent {
  eyebrow: string;
  heading: string;
  rows: ServiceSpecRow[];
}

export interface ServiceProcessStep {
  title: string;
  description: string;
  active?: boolean;
  icon?: ServiceIconKey;
  accentColor?: string;
}

export interface ServiceProcessSectionContent {
  eyebrow: string;
  heading: string;
  intro?: string;
  steps: ServiceProcessStep[];
}

export interface ServiceBrandsSectionContent {
  eyebrow: string;
  heading: string;
  brands: string[];
}

export interface ServicePillarItem {
  letter: string;
  name: string;
  description: string;
  accentColor: string;
}

export interface ServicePillarsSectionContent {
  pillars: ServicePillarItem[];
}

/** The "Explore More / Other Service Divisions" cross-link grid at the bottom
 * of each sub-page. Each page keeps its own copy of the other four links
 * (rather than deriving them from the sibling pages' content), so pages stay
 * independently editable with no cross-page read dependency. */
export type OtherServicesSectionContent = ServiceCardSectionContent;

export interface SiteVisitFormContent {
  tabSiteVisitLabel: string;
  tabInquiryLabel: string;
  heading: string;
  submitLabel: string;
  successTitle: string;
  successBody: string;
  siteTypeOptions: string[];
}

export interface ServiceCtaContent {
  eyebrow: string;
  headingLine1: string;
  headingLine2?: string;
  intro: string;
  image?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

/* -------------------------------------------------------- substation page -- */

export interface SubstationSections {
  hero?: ServiceSubHeroContent;
  capabilities?: ServiceCardSectionContent;
  features?: ServiceCardSectionContent;
  slider?: ServiceSliderSectionContent;
  specs?: ServiceSpecsSectionContent;
  otherServices?: OtherServicesSectionContent;
}

/* -------------------------------------------------------------- solar page - */

export interface SolarSections {
  hero?: ServiceSubHeroContent;
  systemTypes?: ServiceCardSectionContent;
  features?: ServiceCardSectionContent;
  process?: ServiceProcessSectionContent;
  slider?: ServiceSliderSectionContent;
  siteVisitCta?: ServiceCtaContent;
  siteVisitForm?: SiteVisitFormContent;
  banner?: ServiceCtaContent;
  otherServices?: OtherServicesSectionContent;
}

/* ---------------------------------------------------------------- mep page - */

export interface MepSections {
  hero?: ServiceSubHeroContent;
  pillars?: ServicePillarsSectionContent;
  services?: ServiceCardSectionContent;
  slider?: ServiceSliderSectionContent;
  brands?: ServiceBrandsSectionContent;
  otherServices?: OtherServicesSectionContent;
}

/* --------------------------------------------------- water-treatment page -- */

export interface WaterTreatmentSections {
  hero?: ServiceSubHeroContent;
  features?: ServiceCardSectionContent;
  slider?: ServiceSliderSectionContent;
  otherServices?: OtherServicesSectionContent;
}

/* --------------------------------------------------------- after-sales page */

export interface AfterSalesStat {
  value: string;
  accent: string;
  description: string;
}

export interface AfterSalesStatsContent {
  stats: AfterSalesStat[];
}

export interface AfterSalesRegionsContent {
  cardHeading: string;
  cardIntro: string;
  headingLine1: string;
  headingLine2?: string;
  intro: string;
  regions: string[];
  points: ServiceCardItem[];
}

export interface AfterSalesContactOption {
  icon: ServiceIconKey;
  title: string;
  description: string;
  value: string;
  href: string;
  accentColor: string;
}

export interface AfterSalesCtaContent {
  eyebrow: string;
  headingLine1: string;
  headingLine2?: string;
  intro: string;
  options: AfterSalesContactOption[];
  ctaLabel: string;
  ctaHref: string;
}

export interface AfterSalesSections {
  hero?: ServiceSubHeroContent;
  stats?: AfterSalesStatsContent;
  services?: ServiceCardSectionContent;
  process?: ServiceProcessSectionContent;
  coverage?: AfterSalesRegionsContent;
  cta?: AfterSalesCtaContent;
}

/* ============================================== header / footer (global) === */

export interface HeaderNavLink {
  label: string;
  href: string;
}

export interface HeaderContent {
  logo: string;
  navLinks: HeaderNavLink[];
  ctaLabel: string;
  ctaHref: string;
}

export interface FooterContent {
  logo: string;
  copyrightText: string;
  badges: string[];
}
