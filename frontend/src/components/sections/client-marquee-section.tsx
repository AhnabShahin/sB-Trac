import { getHomeContent } from "@/data/pages";
import { Marquee } from "@/components/ui/marquee";
import { LogoTile } from "@/components/ui/logo-tile";

export async function ClientMarqueeSection() {
  const content = await getHomeContent();
  const c = content?.clientMarquee;
  // Marks-only rail: an entry with no logo would fall back to its name, which
  // reads as a rendering fault here, so logo-less entries are dropped.
  const clients = (c?.clients ?? []).filter((client) => client.logo);
  if (clients.length === 0) return null;

  return (
    <section
      aria-label={c?.ariaLabel || "Client logos"}
      className="relative overflow-hidden bg-offwhite"
    >
      <div className="relative pt-6 pb-6 sm:pt-7 sm:pb-7">
        <Marquee gap="gap-10" trailingSpace="pr-10">
          {clients.map((client, i) => (
            <LogoTile
              key={`${client.name}-${i}`}
              name={client.name}
              logoSrc={client.logo}
              variant="plain"
            />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
