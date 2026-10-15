import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getContactContent } from "@/data/pages";
import type { ContactCardIcon } from "@/data/content-types";
import { ServiceDetailHero } from "@/components/sections/service-detail-hero";
import { ContactPageForm } from "@/components/sections/contact-page-form";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { Reveal } from "@/components/ui/reveal";
import { StaggerGroup } from "@/components/ui/stagger-group";
import { Magnetic } from "@/components/ui/magnetic";
import { SiteFooter } from "@/components/sections/site-footer";
import {
  PinIcon,
  FactoryIcon,
  PhoneIcon,
  WhatsappIcon,
  MailIcon,
  GlobeIcon,
  ClockIcon,
  ShieldIcon,
  FacebookIcon,
  LinkedinIcon,
  ArrowRightIcon,
  type IconProps,
} from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Contact | B-Trac Engineering Ltd.",
  description:
    "Contact B-Trac Engineering Ltd. for substation, solar, MEP/EPC, and water treatment inquiries. Head office in Banani, Dhaka. 24/7 emergency support line. We respond within 24 hours.",
  openGraph: {
    title: "Contact | B-Trac Engineering Ltd.",
    description:
      "Submit a project inquiry or call BTEL's engineering team directly — 24/7 emergency support, 24-hour response on all inquiries.",
    type: "website",
  },
};

const ICON_MAP: Record<ContactCardIcon, (props: IconProps) => React.JSX.Element> = {
  pin: PinIcon,
  factory: FactoryIcon,
  phone: PhoneIcon,
  whatsapp: WhatsappIcon,
  mail: MailIcon,
  globe: GlobeIcon,
  clock: ClockIcon,
  shield: ShieldIcon,
};

const SOCIAL_ICON_MAP: Record<string, (props: IconProps) => React.JSX.Element> = {
  Facebook: FacebookIcon,
  LinkedIn: LinkedinIcon,
};

export default async function ContactPage() {
  const content = await getContactContent();
  const hero = content?.contactHero;
  const form = content?.contactForm;
  const details = content?.contactDetails;
  const faq = content?.contactFaq;

  return (
    <main className="flex-1">
      {hero ? (
        <section className="relative overflow-hidden bg-navy pt-16">
          {hero.image ? (
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <Image
                src={hero.image}
                alt=""
                fill
                priority
                loading="eager"
                className="object-cover object-center opacity-50"
                sizes="100vw"
              />
            </div>
          ) : null}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(8,13,25,0.65) 0%, rgba(8,13,25,0.85) 60%, rgba(8,13,25,0.98) 100%), radial-gradient(ellipse 50% 60% at 80% 40%, rgba(159,185,252,0.12) 0%, transparent 60%)",
            }}
          />

          <div className="relative z-1 px-6 py-20 sm:px-12 lg:px-20">
            <ServiceDetailHero accent="teal" maxWidth="max-w-6xl">
              <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_480px] lg:items-start lg:gap-16">
                <div>
                  <nav aria-label="Breadcrumb" className="mb-5 text-[13px] text-muted">
                    <Link href="/" className="transition-colors hover:text-white">
                      Home
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-[#94A3B8]">Contact</span>
                  </nav>

                  {hero.badge ? (
                    <div
                      data-hero-item
                      className="mb-7 inline-flex items-center gap-2 rounded-full border border-teal/30 bg-teal/[0.10] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-teal"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 animate-[var(--animate-pulse-dot)] rounded-full bg-teal" />
                      {hero.badge}
                    </div>
                  ) : null}

                  <h1
                    data-hero-item
                    className="mb-5 font-display text-[clamp(40px,5.5vw,64px)] font-extrabold leading-[0.95] tracking-[-1px] text-white"
                  >
                    {hero.headingLine1}
                    <br />
                    <span className="text-teal">{hero.headingHighlight}</span>
                    {hero.headingLine3 ? (
                      <>
                        <br />
                        {hero.headingLine3}
                      </>
                    ) : null}
                  </h1>

                  <p data-hero-item className="max-w-xl text-base leading-[1.75] text-[#94A3B8] sm:text-lg">
                    {hero.subhead}
                  </p>

                  {hero.whatsappLinks.length > 0 ? (
                    <div data-hero-item className="mt-8">
                      {hero.whatsappEyebrow ? (
                        <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-[#94A3B8]">
                          {hero.whatsappEyebrow}
                        </div>
                      ) : null}
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                        {hero.whatsappLinks.map((line) => (
                          <Magnetic key={line.waId} className="sm:flex-1">
                            <a
                              href={`https://wa.me/${line.waId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-cursor-interactive
                              className="group relative flex items-center gap-3 overflow-hidden rounded-[10px] border border-[#25D366]/35 bg-[#25D366]/[0.08] px-4 py-3.5 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#25D366] hover:bg-[#25D366] hover:shadow-[0_12px_30px_-10px_rgba(37,211,102,0.65)] focus-visible:-translate-y-0.5 focus-visible:border-[#25D366] focus-visible:bg-[#25D366] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-navy motion-reduce:hover:translate-y-0"
                            >
                              <span
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-full motion-reduce:hidden"
                              />
                              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#25D366] text-white transition-all duration-300 group-hover:bg-white group-hover:text-[#128C7E] group-hover:rotate-[-8deg] group-hover:scale-110 motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:scale-100">
                                <WhatsappIcon width={24} height={24} />
                              </span>
                              <span className="relative flex flex-col leading-tight">
                                <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#25D366] transition-colors duration-300 group-hover:text-white/90">
                                  WhatsApp
                                </span>
                                <span className="mt-0.5 font-display text-[17px] font-bold text-white transition-colors duration-300 group-hover:text-navy">
                                  {line.label}
                                </span>
                              </span>
                              <span
                                aria-hidden="true"
                                className="relative ml-auto hidden text-white/0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-white/90 lg:block lg:-translate-x-1"
                              >
                                <ArrowRightIcon width={18} height={18} />
                              </span>
                            </a>
                          </Magnetic>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div data-hero-item>
                  <ContactPageForm content={form} />
                </div>
              </div>
            </ServiceDetailHero>
          </div>
        </section>
      ) : null}

      {details ? (
        <section
          className="px-6 py-20 sm:px-12 lg:px-20"
          style={{ background: "linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy2) 60%, var(--color-navy) 100%)" }}
        >
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-teal">
                {details.eyebrow}
              </div>
              <h2 className="mb-2 font-display text-[clamp(28px,3.2vw,38px)] font-extrabold leading-[1.1] text-white">
                {details.heading}
              </h2>
              {details.intro ? (
                <p className="max-w-md text-sm leading-[1.7] text-[#94A3B8]">{details.intro}</p>
              ) : null}
            </Reveal>

            <StaggerGroup
              as="div"
              itemSelector="[data-stagger-item]"
              className="mt-8 grid grid-cols-1 gap-2.5 sm:grid-cols-2"
            >
              {details.cards.map((card) => {
                const Icon = ICON_MAP[card.icon] ?? PinIcon;
                const cardContent = (
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-transform duration-300 group-hover:scale-110 ${
                        card.accent
                          ? "border-teal/25 bg-teal/[0.12] text-teal"
                          : "border-border bg-white/[0.04] text-muted"
                      }`}
                    >
                      <Icon width={17} height={17} />
                    </span>
                    <div className="min-w-0">
                      <div className="mb-0.5 text-[10px] font-bold uppercase tracking-[1.5px] text-muted">
                        {card.label}
                      </div>
                      <div className={`text-[13px] font-semibold leading-[1.45] ${card.accent ? "text-teal" : "text-white"}`}>
                        {card.value}
                      </div>
                    </div>
                  </div>
                );

                return (
                  <div
                    key={card.label}
                    data-stagger-item
                    className={`group rounded-[10px] border border-border bg-card px-4 py-4 transition-all duration-300 hover:-translate-y-1 hover:border-teal/30 hover:shadow-[0_12px_32px_rgba(0,0,0,0.25)] ${
                      card.full ? "sm:col-span-2" : ""
                    }`}
                  >
                    {card.href ? (
                      <a href={card.href} data-cursor-interactive className="block">
                        {cardContent}
                      </a>
                    ) : (
                      cardContent
                    )}
                  </div>
                );
              })}
            </StaggerGroup>

            {details.socials.length > 0 ? (
              <StaggerGroup
                as="div"
                itemSelector="[data-stagger-item]"
                stagger={0.08}
                className="mt-6 flex flex-wrap gap-2.5"
              >
                {details.socials.map((social) => {
                  const Icon = SOCIAL_ICON_MAP[social.label] ?? FacebookIcon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor-interactive
                      data-stagger-item
                      className="group inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-[13px] font-semibold text-[#94A3B8] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:text-white"
                    >
                      <Icon width={16} height={16} className="transition-transform duration-300 group-hover:scale-110" />
                      {social.label}
                    </a>
                  );
                })}
              </StaggerGroup>
            ) : null}

            {details.mapEmbedSrc ? (
              <Reveal delay={0.1} className="mt-6 overflow-hidden rounded-[10px] border border-border">
                <div className="border-b border-border bg-white/[0.03] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[1.5px] text-muted">
                  {details.mapLabel || "Head Office Location"}
                </div>
                <iframe
                  title="BTEL Head Office (embedded map)"
                  src={details.mapEmbedSrc}
                  width="100%"
                  height="280"
                  style={{ border: 0, display: "block" }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </Reveal>
            ) : null}
          </div>
        </section>
      ) : null}

      {faq && faq.faqs.length > 0 ? (
        <section className="bg-navy2 px-6 py-24 sm:px-12 lg:px-20 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto max-w-xl text-center">
              <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-teal">
                {faq.eyebrow}
              </div>
              <h2 className="mb-3 font-display text-[clamp(32px,3.6vw,44px)] font-extrabold leading-[1.1] text-white">
                {faq.heading}
              </h2>
              {faq.intro ? (
                <p className="text-base leading-[1.7] text-[#94A3B8]">{faq.intro}</p>
              ) : null}
            </Reveal>

            <FaqAccordion faqs={faq.faqs} />
          </div>
        </section>
      ) : null}

      <SiteFooter />
    </main>
  );
}
