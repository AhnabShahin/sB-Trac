import { HeroSection } from "@/components/sections/hero-section";
import { ClientMarqueeSection } from "@/components/sections/client-marquee-section";
import { PrincipleSection } from "@/components/sections/principle-section";
import { IsoBandSection } from "@/components/sections/iso-band-section";
import { StrengthCloudSection } from "@/components/sections/strength-cloud-section";
import { TimelineSection } from "@/components/sections/timeline-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { SupportSection } from "@/components/sections/support-section";
import { PartnerCtaSection } from "@/components/sections/partner-cta-section";
import { SiteFooter } from "@/components/sections/site-footer";

export default function Home() {
  return (
    <main className="flex-1">
      <HeroSection />
      <ClientMarqueeSection />
      <PrincipleSection />
      <IsoBandSection />
      <StrengthCloudSection />
      <TimelineSection />
      <ProjectsSection />
      <SupportSection />
      <PartnerCtaSection />
      <SiteFooter />
    </main>
  );
}
