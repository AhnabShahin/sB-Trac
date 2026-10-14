import clientsManifest from "@/data/clients.json";

export interface HeroStat {
  value: number;
  suffix: string;
  label: string;
}

export type HeroSlide =
  | { type: "image"; src: string; webpSrc?: string }
  | { type: "video"; mp4Src: string; webmSrc?: string; poster: string };

export async function getHeroSlides(): Promise<HeroSlide[]> {
  return [
    {
      type: "video",
      // 720p re-encode of the 1080p original (8.0MB -> 2.2MB, same 27.4s). The
      // source is preserved in `Asset/new hero btrac.mp4`. This is a full-bleed
      // background playing behind two dark gradient scrims at `opacity-85`, so
      // the extra pixels were never visible and cost 6MB on every homepage load.
      mp4Src: "/assets/video/home-hero-720.mp4",
      poster: "/assets/video/home-hero-poster.jpg",
    },
  ];
}

export async function getServiceBannerSlides(): Promise<HeroSlide[]> {
  // `webpSrc` is served through the `<picture>` source ahead of the `src`
  // fallback. These five banners all render at once (the crossfade slider keeps
  // every layer mounted and fades between them), so their weight lands together
  // on every service page: 9.4MB of PNG down to 474KB of WebP.
  return [
    { type: "image", src: "/assets/services-banner/substation.png", webpSrc: "/assets/services-banner/substation.webp" },
    { type: "image", src: "/assets/services-banner/solar.png", webpSrc: "/assets/services-banner/solar.webp" },
    { type: "image", src: "/assets/services-banner/mep.png", webpSrc: "/assets/services-banner/mep.webp" },
    { type: "image", src: "/assets/services-banner/water-treatment.png", webpSrc: "/assets/services-banner/water-treatment.webp" },
    { type: "image", src: "/assets/services-banner/after-sales.png", webpSrc: "/assets/services-banner/after-sales.webp" },
  ];
}

export async function getHeroStats(): Promise<HeroStat[]> {
  return [
    { value: 60, suffix: "+", label: "Clients" },
    { value: 38, suffix: "+", label: "Projects" },
    { value: 500, suffix: "Cr+", label: "Total PO Value (BDT)" },
    { value: 16, suffix: "yr", label: "Years of Experience" },
  ];
}

export interface ClientLogo {
  name: string;
  slug: string;
  logo: string;
}

export async function getMarqueeClients(): Promise<ClientLogo[]> {
  return clientsManifest;
}

/**
 * Client name -> logo mark, for the industry rails that group clients by sector and
 * only carry names. Names must match `getIndustryLeaders()` exactly; a client without
 * a mark here falls back to its name inside the tile.
 */
export async function getClientLogoIndex(): Promise<Record<string, string>> {
  return Object.fromEntries(
    clientsManifest.map((client) => [client.name, client.logo])
  );
}
