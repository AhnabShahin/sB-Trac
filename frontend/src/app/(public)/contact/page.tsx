import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  getContactInfoCards,
  getContactFaqs,
  OFFICE_MAP_EMBED_SRC,
  SOCIAL_LINKS,
  WHATSAPP_LINKS,
} from "@/data/contact";
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

const ICON_MAP: Record<string, (props: IconProps) => React.JSX.Element> = {
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
  const [cards, faqs] = await Promise.all([getContactInfoCards(), getContactFaqs()]);

  return (
    <main className="flex-1">
      <section
        className="relative overflow-hidden pt-16 bg-navy"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <picture className="relative block h-full w-full">
            <source srcSet="/assets/hero/contact.webp" type="image/webp" />
            <Image
              src="/assets/hero/contact.jpg"
              alt=""
              fill
              priority
              loading="eager"
              className="object-cover object-center opacity-50"
              sizes="100vw"
            />
          </picture>
        </div>
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

                <div
                  data-hero-item
                  className="mb-7 inline-flex items-center gap-2 rounded-full border border-teal/30 bg-teal/[0.10] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-teal"
                >
                  <span className="h-1.5 w-1.5 shrink-0 animate-[var(--animate-pulse-dot)] rounded-full bg-teal" />
                  We Respond Within 24 Hours
                </div>

                <h1
                  data-hero-item
                  className="mb-5 font-display text-[clamp(40px,5.5vw,64px)] font-extrabold leading-[0.95] tracking-[-1px] text-white"
                >
                  Let&apos;s Engineer
                  <br />
                  <span className="text-teal">Your Next</span>
                  <br />
                  Project
                </h1>

                <p data-hero-item className="max-w-xl text-base leading-[1.75] text-[#94A3B8] sm:text-lg">
                  Whether you&apos;re planning a substation, a solar plant, an
                  MEP fitout, or need water treatment chemicals — our
                  engineering team is ready to help. Submit an inquiry or call
                  us directly.
                </p>

                <div data-hero-item className="mt-8">
                  <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-[#94A3B8]">
                    Or chat with us instantly on WhatsApp
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                    {WHATSAPP_LINKS.map((line) => (
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
              </div>

              <div data-hero-item>
                <ContactPageForm />
              </div>
            </div>
          </ServiceDetailHero>
        </div>
      </section>

      <section
        className="px-6 py-20 sm:px-12 lg:px-20"
        style={{ background: "linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy2) 60%, var(--color-navy) 100%)" }}
      >
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-teal">
              Find Us
            </div>
            <h2 className="mb-2 font-display text-[clamp(28px,3.2vw,38px)] font-extrabold leading-[1.1] text-white">
              Contact Details
            </h2>
            <p className="max-w-md text-sm leading-[1.7] text-[#94A3B8]">
              Multiple ways to reach the BTEL team. For project
              inquiries, use the form above. For urgent support, call
              directly.
            </p>
          </Reveal>

          <StaggerGroup
            as="div"
            itemSelector="[data-stagger-item]"
            className="mt-8 grid grid-cols-1 gap-2.5 sm:grid-cols-2"
          >
            {cards.map((card) => {
              const Icon = ICON_MAP[card.icon];
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

          <StaggerGroup
            as="div"
            itemSelector="[data-stagger-item]"
            stagger={0.08}
            className="mt-6 flex flex-wrap gap-2.5"
          >
            {SOCIAL_LINKS.map((social) => {
              const Icon = SOCIAL_ICON_MAP[social.label];
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

          <Reveal delay={0.1} className="mt-6 overflow-hidden rounded-[10px] border border-border">
            <div className="border-b border-border bg-white/[0.03] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[1.5px] text-muted">
              Head Office Location
            </div>
            <iframe
              title="BTEL Head Office — Banani, Dhaka (embedded map)"
              src={OFFICE_MAP_EMBED_SRC}
              width="100%"
              height="280"
              style={{ border: 0, display: "block" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-navy2 px-6 py-24 sm:px-12 lg:px-20 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mx-auto max-w-xl text-center">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-teal">
              Common Questions
            </div>
            <h2 className="mb-3 font-display text-[clamp(32px,3.6vw,44px)] font-extrabold leading-[1.1] text-white">
              Frequently Asked
            </h2>
            <p className="text-base leading-[1.7] text-[#94A3B8]">
              Quick answers before reaching out.
            </p>
          </Reveal>

          <FaqAccordion faqs={faqs} />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
