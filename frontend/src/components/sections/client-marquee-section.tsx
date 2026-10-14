import { getMarqueeClients } from "@/data/site";
import { Marquee } from "@/components/ui/marquee";
import { LogoTile } from "@/components/ui/logo-tile";

export async function ClientMarqueeSection() {
  // This rail is marks-only: a client with no logo file would fall back to its name,
  // and a row of bare text in the middle of the hero reads as a rendering fault. Every
  // entry currently has a mark, so this is a guarantee rather than a fix — if a mark
  // ever goes missing, the rail silently drops that client instead of showing text.
  //
  // All 39 clients run on a single rail. At 160px per tile plus a 40px gap that is
  // roughly 7900px, far wider than any viewport, so the Marquee's duplicated half
  // always overflows and the loop seam never shows — no `repeat` needed.
  const clients = (await getMarqueeClients()).filter((client) => client.logo);

  return (
    // A real, full-bleed band. It used to be a zero-height section with the glass
    // pane translated onto the hero/section seam, so the logos straddled two
    // surfaces. It now owns its own vertical space and background.
    //
    // The band is off-white (`bg-offwhite`, the same token the light feature
    // sections use), which inverts the value relationship with the dark hero above
    // and the navy "Who We Are" section below: instead of fading from one navy
    // into the next, the rail is now a bright strip let into the dark page, which
    // separates the two without needing a border. The navy glows that used to sit
    // here are gone with the gradient — on a light surface they would only muddy it.
    // The heading here used to be a two-row counter-scrolling band under an
    // `<h2>`, and then a teal "Trusted by 60+ Industry Leaders" badge. Both are
    // gone — what remains is a bare rail of marks. The `aria-label` is kept: it is
    // not rendered, and without it the section has no accessible name at all. The
    // tiles inside already announce each client by name.
    <section
      aria-label="Trusted by 60+ industry leaders"
      className="relative overflow-hidden bg-offwhite"
    >
      {/* A single full-bleed rail: no max-width wrapper and no side padding, so the
          logos run to both edges of the viewport and the Marquee's own edge mask
          fades them out instead of the track stopping at an arbitrary column. The
          mask is a transparency ramp, so it works unchanged on a light band — it
          just blends the marks into off-white at both ends.

          This used to sit under a teal "Trusted by 60+ Industry Leaders" badge,
          which carried `pt-12 pb-8` above the rail and `pb-12 sm:pb-14` below it.
          With the badge gone the strip needs no heading block at all, so the
          padding collapses to one tight margin around the rail. */}
      <div className="relative pt-6 pb-6 sm:pt-7 sm:pb-7">
        <Marquee gap="gap-10" trailingSpace="pr-10">
          {clients.map((client) => (
            <LogoTile
              key={client.name}
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
