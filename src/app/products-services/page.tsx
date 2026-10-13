import type { Metadata } from "next";
import { ServicesHeroSection } from "@/components/sections/services-hero-section";
import { ServiceListSection } from "@/components/sections/service-list-section";
import { ProductsShowcaseSection } from "@/components/sections/products-showcase-section";
import { ServicesCtaSection } from "@/components/sections/services-cta-section";
import { SiteFooter } from "@/components/sections/site-footer";

export const metadata: Metadata = {
  title: "Products & Services | B-Trac Engineering Ltd.",
  description:
    "BTEL's complete product and service range — switchgear & control panels, MEP/EPC, renewable energy, and NALCO water treatment chemicals, delivered across Bangladesh.",
  openGraph: {
    title: "Products & Services | B-Trac Engineering Ltd.",
    description:
      "Five engineering service divisions and a full product catalogue spanning power systems, renewable energy, MEP, and industrial water treatment.",
    type: "website",
  },
};

export default function ProductsServicesPage() {
  return (
    <main className="flex-1">
      <ServicesHeroSection />
      <ServiceListSection />
      <ProductsShowcaseSection />
      <ServicesCtaSection />
      <SiteFooter />
    </main>
  );
}
