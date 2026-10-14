import { getHomeContent } from "@/data/pages";
import { HeroView } from "@/components/sections/hero-view";

export async function HeroSection() {
  const content = await getHomeContent();

  // Blank until an admin saves (CLAUDE.md / product decision): no DB content =
  // no hero. The static chrome (header/footer) still renders around it.
  if (!content?.hero) return null;

  return <HeroView content={content.hero} />;
}
