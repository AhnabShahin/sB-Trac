"use client";

import type { ComponentProps, ReactNode } from "react";
import { HeroForm } from "@/components/admin/forms/hero-form";
import { ClientMarqueeForm } from "@/components/admin/forms/client-marquee-form";
import { PrincipleForm } from "@/components/admin/forms/principle-form";
import { StatBandForm } from "@/components/admin/forms/stat-band-form";
import { FoundationForm } from "@/components/admin/forms/foundation-form";
import { IsoForm } from "@/components/admin/forms/iso-form";
import { StrengthForm } from "@/components/admin/forms/strength-form";
import { TimelineForm } from "@/components/admin/forms/timeline-form";
import { ProjectsForm } from "@/components/admin/forms/projects-form";
import { SupportForm } from "@/components/admin/forms/support-form";
import { PartnerCtaForm } from "@/components/admin/forms/partner-cta-form";
import { ServicesHeroForm } from "@/components/admin/forms/services-hero-form";
import { ServiceListForm } from "@/components/admin/forms/service-list-form";
import { ProductsShowcaseForm } from "@/components/admin/forms/products-showcase-form";
import { ServicesCtaForm } from "@/components/admin/forms/services-cta-form";
import { ProjectsHeroForm } from "@/components/admin/forms/projects-hero-form";
import { ProjectsStatsForm } from "@/components/admin/forms/projects-stats-form";
import { PortfolioForm } from "@/components/admin/forms/portfolio-form";
import { TrackRecordForm } from "@/components/admin/forms/track-record-form";
import { ProjectsCtaForm } from "@/components/admin/forms/projects-cta-form";
import { PartnersHeroForm } from "@/components/admin/forms/partners-hero-form";
import { PartnerWallForm } from "@/components/admin/forms/partner-wall-form";
import { PartnersCtaForm } from "@/components/admin/forms/partners-cta-form";
import { ClientsHeroForm } from "@/components/admin/forms/clients-hero-form";
import { ClientsStatsForm } from "@/components/admin/forms/clients-stats-form";
import { ClientsBandsForm } from "@/components/admin/forms/clients-bands-form";
import { ClientsTestimonialsForm } from "@/components/admin/forms/clients-testimonials-form";
import { ClientsCtaForm } from "@/components/admin/forms/clients-cta-form";
import { ContactHeroForm } from "@/components/admin/forms/contact-hero-form";
import { ContactFormForm } from "@/components/admin/forms/contact-form-form";
import { ContactDetailsForm } from "@/components/admin/forms/contact-details-form";
import { ContactFaqForm } from "@/components/admin/forms/contact-faq-form";
import { ServiceHeroForm } from "@/components/admin/forms/service-hero-form";
import { ServiceCardSectionForm } from "@/components/admin/forms/service-card-section-form";
import { ServiceSliderForm } from "@/components/admin/forms/service-slider-form";
import { ServiceSpecsForm } from "@/components/admin/forms/service-specs-form";
import { ServiceProcessForm } from "@/components/admin/forms/service-process-form";
import { ServiceCtaForm } from "@/components/admin/forms/service-cta-form";
import { MepPillarsForm } from "@/components/admin/forms/mep-pillars-form";
import { MepBrandsForm } from "@/components/admin/forms/mep-brands-form";
import { AfterSalesStatsForm } from "@/components/admin/forms/after-sales-stats-form";
import { AfterSalesCoverageForm } from "@/components/admin/forms/after-sales-coverage-form";
import { AfterSalesCtaForm } from "@/components/admin/forms/after-sales-cta-form";
import { HeaderForm } from "@/components/admin/forms/header-form";
import { FooterForm } from "@/components/admin/forms/footer-form";
import { SiteVisitFormForm } from "@/components/admin/forms/site-visit-form-form";

// One editor screen. `dataKey` is the section's key in the page content; it is
// NOT always 1:1 with the nav `id` — several ids can edit slices of one key
// (the home "principle" is split into Who We Are / Stat Band / Vision…).
export interface SectionDef {
  id: string;
  label: string;
  dataKey: string;
  render: (value: unknown, onChange: (value: unknown) => void, slug: string) => ReactNode;
}

export interface PageConfig {
  slug: string;
  title: string;
  sections: SectionDef[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Form = (props: { value: any; onChange: any; slug: string }) => ReactNode;

const form =
  (id: string, label: string, dataKey: string, Component: Form): SectionDef => ({
    id,
    label,
    dataKey,
    render: (value, onChange, slug) => <Component value={value} onChange={onChange} slug={slug} />,
  });

// The products-services sub-pages (substation/solar/mep/water-treatment/
// after-sales) share a handful of generic section shapes (hero, card grid,
// slider, process, CTA). These presets fix each generic form's extra
// (non-value/onChange/slug) props per usage, so `form()` above still returns a
// plain SectionDef.
const CardSectionForm = (preset: Partial<Omit<ComponentProps<typeof ServiceCardSectionForm>, "value" | "onChange" | "slug">>): Form =>
  function CardSectionFormPreset(props) {
    return <ServiceCardSectionForm {...props} {...preset} />;
  };
const ProcessForm = (preset: Partial<Omit<ComponentProps<typeof ServiceProcessForm>, "value" | "onChange" | "slug">>): Form =>
  function ProcessFormPreset(props) {
    return <ServiceProcessForm {...props} {...preset} />;
  };
const CtaForm = (preset: Partial<Omit<ComponentProps<typeof ServiceCtaForm>, "value" | "onChange" | "slug">>): Form =>
  function CtaFormPreset(props) {
    return <ServiceCtaForm {...props} {...preset} />;
  };

export const PAGE_CONFIGS: Record<string, PageConfig> = {
  home: {
    slug: "home",
    title: "Home",
    sections: [
      form("hero", "Hero", "hero", HeroForm),
      form("clientMarquee", "Client Logos", "clientMarquee", ClientMarqueeForm),
      form("principle", "Who We Are", "principle", PrincipleForm),
      form("stats", "Stat Band", "principle", StatBandForm),
      form("foundation", "Vision / Mission / Values", "principle", FoundationForm),
      form("isoBand", "ISO Band", "isoBand", IsoForm),
      form("strength", "Our Strength", "strength", StrengthForm),
      form("timeline", "Our Journey", "timeline", TimelineForm),
      form("projects", "Project Portfolio", "projects", ProjectsForm),
      form("support", "After-Sales", "support", SupportForm),
      form("partnerCta", "Ready to Partner", "partnerCta", PartnerCtaForm),
    ],
  },
  "products-services": {
    slug: "products-services",
    title: "Products & Services",
    sections: [
      form("servicesHero", "Hero", "servicesHero", ServicesHeroForm),
      form("serviceList", "Service Divisions", "serviceList", ServiceListForm),
      form("productsShowcase", "Product Catalogue", "productsShowcase", ProductsShowcaseForm),
      form("servicesCta", "Closing CTA", "servicesCta", ServicesCtaForm),
    ],
  },
  substation: {
    slug: "substation",
    title: "Substation & Switchgear",
    sections: [
      form("hero", "Hero", "hero", ServiceHeroForm),
      form("capabilities", "Core Capabilities", "capabilities", CardSectionForm({ cardLabel: "capability" })),
      form("features", "Full-Scope Features", "features", CardSectionForm({ cardLabel: "feature" })),
      form("slider", "Project Slider", "slider", ServiceSliderForm),
      form("specs", "Specifications", "specs", ServiceSpecsForm),
      form("otherServices", "Other Service Divisions", "otherServices", CardSectionForm({ cardLabel: "division" })),
    ],
  },
  solar: {
    slug: "solar",
    title: "Solar Power",
    sections: [
      form("hero", "Hero", "hero", ServiceHeroForm),
      form("systemTypes", "System Types", "systemTypes", CardSectionForm({ cardLabel: "system type", showTag: true })),
      form("features", "Our Approach", "features", CardSectionForm({ cardLabel: "feature" })),
      form("process", "EPC Process", "process", ProcessForm({ showActive: true })),
      form("slider", "Project Slider", "slider", ServiceSliderForm),
      form("siteVisitCta", "Site Visit CTA", "siteVisitCta", CtaForm({})),
      form("siteVisitForm", "Site Visit Form", "siteVisitForm", SiteVisitFormForm),
      form("banner", "Closing Banner", "banner", CtaForm({ showImage: true })),
      form("otherServices", "Other Service Divisions", "otherServices", CardSectionForm({ cardLabel: "division" })),
    ],
  },
  mep: {
    slug: "mep",
    title: "MEP / EPC",
    sections: [
      form("hero", "Hero", "hero", ServiceHeroForm),
      form("pillars", "M · E · P Pillars", "pillars", MepPillarsForm),
      form("services", "What We Deliver", "services", CardSectionForm({ cardLabel: "service" })),
      form("slider", "Project Slider", "slider", ServiceSliderForm),
      form("brands", "Equipment Brands", "brands", MepBrandsForm),
      form("otherServices", "Other Service Divisions", "otherServices", CardSectionForm({ cardLabel: "division" })),
    ],
  },
  "water-treatment": {
    slug: "water-treatment",
    title: "Water Treatment Chemicals",
    sections: [
      form("hero", "Hero", "hero", ServiceHeroForm),
      form("features", "Key Advantages", "features", CardSectionForm({ cardLabel: "advantage" })),
      form("slider", "Project Slider", "slider", ServiceSliderForm),
      form("otherServices", "Other Service Divisions", "otherServices", CardSectionForm({ cardLabel: "division" })),
    ],
  },
  "after-sales": {
    slug: "after-sales",
    title: "After Sales Support",
    sections: [
      form("hero", "Hero", "hero", ServiceHeroForm),
      form("stats", "Stats Band", "stats", AfterSalesStatsForm),
      form("services", "Service Pillars", "services", CardSectionForm({ cardLabel: "service", showHighlight: true })),
      form("process", "Service Process", "process", ProcessForm({ showIcon: true })),
      form("coverage", "Coverage", "coverage", AfterSalesCoverageForm),
      form("cta", "Closing CTA", "cta", AfterSalesCtaForm),
    ],
  },
  header: {
    slug: "header",
    title: "Header",
    sections: [form("header", "Header", "header", HeaderForm)],
  },
  footer: {
    slug: "footer",
    title: "Footer",
    sections: [form("footer", "Footer", "footer", FooterForm)],
  },
  projects: {
    slug: "projects",
    title: "Project Portfolio",
    sections: [
      form("projectsHero", "Hero", "projectsHero", ProjectsHeroForm),
      form("statsBand", "Stats Band", "statsBand", ProjectsStatsForm),
      form("portfolio", "Portfolio", "portfolio", PortfolioForm),
      form("trackRecord", "Track Record", "trackRecord", TrackRecordForm),
      form("projectsCta", "Closing CTA", "projectsCta", ProjectsCtaForm),
    ],
  },
  partners: {
    slug: "partners",
    title: "Partners & Clients",
    sections: [
      form("partnersHero", "Hero", "partnersHero", PartnersHeroForm),
      form("partnerWall", "Partner Logos", "partnerWall", PartnerWallForm),
      form("partnersCta", "Closing CTA", "partnersCta", PartnersCtaForm),
    ],
  },
  clients: {
    slug: "clients",
    title: "Clients",
    sections: [
      form("clientsHero", "Hero", "clientsHero", ClientsHeroForm),
      form("clientsStats", "Stats Band", "clientsStats", ClientsStatsForm),
      form("clientsBands", "Industry Bands", "clientsBands", ClientsBandsForm),
      form("clientsTestimonials", "Testimonials", "clientsTestimonials", ClientsTestimonialsForm),
      form("clientsCta", "Closing CTA", "clientsCta", ClientsCtaForm),
    ],
  },
  contact: {
    slug: "contact",
    title: "Contact",
    sections: [
      form("contactHero", "Hero", "contactHero", ContactHeroForm),
      form("contactForm", "Inquiry Form", "contactForm", ContactFormForm),
      form("contactDetails", "Contact Details", "contactDetails", ContactDetailsForm),
      form("contactFaq", "FAQ", "contactFaq", ContactFaqForm),
    ],
  },
};
