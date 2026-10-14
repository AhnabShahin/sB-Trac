export type ServiceCategorySlug =
  | "substation"
  | "solar"
  | "mep"
  | "water-treatment"
  | "after-sales";

export interface ServiceCategory {
  slug: ServiceCategorySlug;
  label: string;
  accent: "blue" | "amber" | "teal" | "purple" | "cyan";
}

export const SERVICE_CATEGORIES: Record<ServiceCategorySlug, ServiceCategory> = {
  substation: { slug: "substation", label: "Substation & Switchgear", accent: "blue" },
  solar: { slug: "solar", label: "Solar Power", accent: "amber" },
  mep: { slug: "mep", label: "MEP / EPC", accent: "teal" },
  "water-treatment": { slug: "water-treatment", label: "Water Treatment", accent: "purple" },
  "after-sales": { slug: "after-sales", label: "After Sales Support", accent: "cyan" },
};

export interface Service {
  id: string;
  index: string;
  title: string;
  description: string;
  tags: string[];
  icon: "bolt" | "sun" | "wrench" | "droplet" | "clock";
  href: string;
  categorySlug: ServiceCategorySlug;
  image: string;
  webpImage?: string;
}

export async function getServices(): Promise<Service[]> {
  return [
    {
      id: "substation-switchgear",
      index: "01",
      title: "Substation & Switchgear Systems",
      description:
        "Full-scope substation EPC from 11kV to 132kV — protection relays, SCADA, switchgear, and power transformers.",
      tags: ["11kV–132kV", "EPC", "SCADA", "ABB · Schneider · Siemens"],
      icon: "bolt",
      href: "/products-services/substation",
      categorySlug: "substation",
      image: "/assets/hero/substation.jpg",
      webpImage: "/assets/hero/substation.webp",
    },
    {
      id: "solar-power",
      index: "02",
      title: "Solar Power Solutions",
      description:
        "Turnkey solar EPC — rooftop, ground-mounted, and hybrid systems for industrial and commercial clients.",
      tags: ["Grid-Tied", "Off-Grid", "Hybrid", "SMA · Huawei · LONGi"],
      icon: "sun",
      href: "/products-services/solar",
      categorySlug: "solar",
      image: "/assets/hero/solar.jpg",
      webpImage: "/assets/hero/solar.webp",
    },
    {
      id: "mep-epc",
      index: "03",
      title: "MEP / EPC Solutions",
      description:
        "Mechanical, Electrical, and Plumbing engineering for factories, commercial buildings, data centres, and power plants.",
      tags: ["HVAC", "LV/MV Power", "Plumbing", "Daikin · CAT · Wilo"],
      icon: "wrench",
      href: "/products-services/mep",
      categorySlug: "mep",
      image: "/assets/hero/mep.jpg",
      webpImage: "/assets/hero/mep.webp",
    },
    {
      id: "water-treatment",
      index: "04",
      title: "Water Treatment Chemicals",
      description:
        "Authorized distributor of NALCO (Ecolab) water treatment chemicals — boiler, cooling tower, RO, and engine coolant programs.",
      tags: ["Boiler", "Cooling Tower", "RO", "NALCO · Ecolab USA"],
      icon: "droplet",
      href: "/products-services/water-treatment",
      categorySlug: "water-treatment",
      image: "/assets/hero/water.jpg",
      webpImage: "/assets/hero/water.webp",
    },
    {
      id: "after-sales-support",
      index: "05",
      title: "After Sales Support & Service",
      description:
        "Nationwide, round-the-clock after-sales support — AMC contracts, spare parts supply, and emergency response across all delivered projects.",
      tags: ["AMC Contracts", "24/7 Support", "Spare Parts", "Nationwide Coverage"],
      icon: "clock",
      href: "/products-services/after-sales",
      categorySlug: "after-sales",
      image: "/assets/hero/after-sales.jpg",
      webpImage: "/assets/hero/after-sales.webp",
    },
  ];
}
