export interface CompanyStat {
  value: string;
  accent?: string;
  description: string;
}

export async function getCompanyStats(): Promise<CompanyStat[]> {
  return [
    {
      value: "250",
      accent: "+",
      description: "Industry-leading clients served nationwide",
    },
    {
      value: "800",
      accent: "+",
      description: "Projects delivered & ongoing across all five divisions",
    },
    {
      value: "BDT 500",
      accent: "Cr+",
      description: "Total purchase order value delivered to date",
    },
    {
      value: "16",
      accent: "yr",
      description: "In operation since 2009. Bangla Trac Group since 2004",
    },
  ];
}

export interface PillarItem {
  label: string;
}

export interface Pillar {
  title: string;
  accent: "teal" | "blue" | "amber";
  description: string;
  items: PillarItem[];
}

export async function getPillars(): Promise<Pillar[]> {
  return [
    {
      title: "Vision",
      accent: "teal",
      description:
        "A dynamic global company driving stakeholders' success through excellence, integrity, humility & people leadership.",
      items: [],
    },
    {
      title: "Mission",
      accent: "blue",
      description:
        "We ensure safe, reliable & cost-effective engineering solutions by providing innovative products & services to maximize customer satisfaction.",
      items: [],
    },
    {
      title: "Values",
      accent: "amber",
      description: "",
      items: [
        { label: "People First" },
        { label: "Customers' Success" },
        { label: "Excellence Through Humility" },
        { label: "Integrity" },
        { label: "Innovation" },
        { label: "Environmentally Responsible" },
      ],
    },
  ];
}

export interface AtAGlanceFact {
  label: string;
  value: string;
  accent?: boolean;
}

export async function getAtAGlanceFacts(): Promise<AtAGlanceFact[]> {
  return [
    { label: "Founded", value: "2009" },
    { label: "Parent Group", value: "Bangla Trac Group" },
    { label: "Certification", value: "ISO 9001:2015", accent: true },
    { label: "Headquarters", value: "Banani, Dhaka" },
    { label: "Service Divisions", value: "5 Divisions" },
    { label: "Largest Project", value: "BDT 185 Cr (BATB, 2023)", accent: true },
  ];
}

export interface StrengthPillar {
  title: string;
  description: string;
  icon: "hardhat" | "coins" | "factory" | "truck";
}

export async function getStrengthPillars(): Promise<StrengthPillar[]> {
  return [
    {
      title: "Project Management",
      description: "Dedicated team of competent engineers & technicians. Timebound project execution and superior tactical support for every engagement.",
      icon: "hardhat",
    },
    {
      title: "Finance Management",
      description: "Revenue growth, equity growth & market share. Large project financing, solvency health, productivity and compliance with tax & regulatory requirements.",
      icon: "coins",
    },
    {
      title: "Production Facility",
      description: "ISO certified fully compliant production facility with dedicated workstations for different production criterions to ensure consistent quality output.",
      icon: "factory",
    },
    {
      title: "Supply Chain Management",
      description: "ERP-based supply chain with extensive quality control for inbound and outbound fleets. Ensuring materials arrive on time, every time.",
      icon: "truck",
    },
  ];
}

export interface TimelineMilestone {
  year: string;
  title: string;
  description: string;
  image?: string;
  webpImage?: string;
}

export async function getTimeline(): Promise<TimelineMilestone[]> {
  return [
    {
      year: "2004",
      title: "Bangla Trac Group Founded",
      description: "Parent conglomerate Bangla Trac Group established, laying the foundation for BTEL's future engineering operations.",
      image: "/assets/timeline/2004.jpg",
      webpImage: "/assets/timeline/2004.webp",
    },
    {
      year: "2009",
      title: "B-Trac Engineering Ltd. Incorporated",
      description: "B-Trac Engineering Ltd. incorporated and began workshop operations, taking on first projects in substation supply and electrical contracting across Dhaka.",
      image: "/assets/timeline/2009.jpg",
      webpImage: "/assets/timeline/2009.webp",
    },
    {
      year: "2013",
      title: "Factory Expansion in Bhulta, Narayanganj",
      description: "Expanded the workshop into a dedicated factory in Bhulta, Narayanganj, growing manufacturing capacity for all engineering divisions.",
      image: "/assets/timeline/2014.jpg",
      webpImage: "/assets/timeline/2014.webp",
    },
    {
      year: "2018",
      title: "ISO 9001:2015 Certification",
      description: "Achieved ISO 9001:2015 certification, cementing BTEL's commitment to international quality management standards.",
      image: "/assets/timeline/2018.jpg",
      webpImage: "/assets/timeline/2018.webp",
    },
    {
      year: "2023",
      title: "Became one of the largest MEP Solution provider for BATB with a project valued at BDT 185 Cr.",
      description: "Delivered the largest single project in BTEL history — British American Tobacco Bangladesh Savar Factory MEP, at BDT 185 Cr.",
      image: "/assets/timeline/2023.jpg",
      webpImage: "/assets/timeline/2023.webp",
    },
  ];
}

import type { ServiceCategorySlug } from "@/data/services";

export type ProjectFilterTag = ServiceCategorySlug;

export interface Project {
  id: string;
  categorySlug: ServiceCategorySlug;
  /** Additional filter tag for the /projects portfolio filter bar when a project should be grouped separately from its service category. Defaults to categorySlug when omitted. */
  filterTag?: ProjectFilterTag;
  statusLabel: string;
  title: string;
  client: string;
  /** Category-appropriate metric: currency value (EPC/MEP), capacity (Solar), kVA (Substation), or tonnage (Water Treatment). */
  metric: string;
  /** PO value in BDT Crore, used for showcase/highest-value ranking. Omit when no PO value applies (e.g. AMC-only after-sales work). */
  valueCr?: number;
  status: "Ongoing" | "Completed";
  /** Longer copy shown only on featured cards in the /projects portfolio grid. */
  description?: string;
  /** Marks the project as the wide, lead card in the /projects portfolio grid. */
  featured?: boolean;
  image?: string;
  webpImage?: string;
}

export async function getProjects(): Promise<Project[]> {
  return [
    {
      id: "factory-conversion-mep",
      categorySlug: "mep",
      statusLabel: "MEP · Ongoing",
      title: "Factory Conversion MEP Works",
      client: "British American Tobacco Bangladesh (BATB)",
      metric: "BDT 91 Cr",
      valueCr: 91,
      status: "Ongoing",
      featured: true,
      image: "/assets/slider/mep/02.jpg",
      webpImage: "/assets/slider/mep/02.webp",
      description:
        "Complete mechanical, electrical, and plumbing systems for large-scale factory conversion. Covers HVAC, fire detection, power distribution, and piping infrastructure.",
    },
    {
      id: "3mw-solar-power-plant",
      categorySlug: "solar",
      statusLabel: "Solar Power · Ongoing",
      title: "3 MW Solar Power Plant",
      client: "Akij Jute Mills Ltd.",
      metric: "3 MW",
      valueCr: 6.15,
      status: "Ongoing",
      image: "/assets/slider/solar/01.jpg",
      webpImage: "/assets/slider/solar/01.webp",
    },
    {
      id: "batb-smd-savar-mep",
      categorySlug: "mep",
      statusLabel: "MEP / EPC · Completed 2023",
      title: "BATB SMD Savar MEP Works",
      client: "British American Tobacco Bangladesh (BATB)",
      metric: "BDT 185.98 Cr",
      valueCr: 185.98,
      status: "Completed",
      featured: true,
      image: "/assets/projects/featured.jpg",
      webpImage: "/assets/projects/featured.webp",
      description:
        "BTEL's largest single project. Complete turnkey MEP for BATB's Savar SMD facility — the most technically complex and value-intensive project in company history.",
    },
    {
      id: "1575-kwp-solar-power-plant",
      categorySlug: "solar",
      statusLabel: "Solar Power · Completed 2023",
      title: "1575 kWp Solar Power Plant",
      client: "Sharmin Group",
      metric: "BDT 7 Cr",
      valueCr: 7,
      status: "Completed",
      image: "/assets/slider/solar/02.jpg",
      webpImage: "/assets/slider/solar/02.webp",
    },
    {
      id: "11kv-complete-substation",
      categorySlug: "substation",
      statusLabel: "Substation · Completed 2023",
      title: "11KV Complete Substation System",
      client: "British American Tobacco Bangladesh",
      metric: "2,000 kVA",
      status: "Completed",
      image: "/assets/slider/substation/01.jpg",
      webpImage: "/assets/slider/substation/01.webp",
    },
    {
      id: "solar-irrigation-pump",
      categorySlug: "solar",
      statusLabel: "Solar · Completed 2020",
      title: "Solar Irrigation Pump Project",
      client: "Bangladesh Agricultural Dev. Corp.",
      metric: "~150 kWp",
      valueCr: 2.81,
      status: "Completed",
      image: "/assets/slider/solar/03.jpg",
      webpImage: "/assets/slider/solar/03.webp",
    },
    {
      id: "hv-lv-switchgear-supply",
      categorySlug: "substation",
      statusLabel: "Switchgear · Completed 2022",
      title: "HV/LV Switchgear Panel Supply & Installation",
      client: "Nestlé Bangladesh Ltd.",
      metric: "Turnkey",
      status: "Completed",
      image: "/assets/slider/substation/03.jpg",
      webpImage: "/assets/slider/substation/03.webp",
    },
    {
      id: "diesel-generator-epc",
      categorySlug: "mep",
      statusLabel: "MEP / EPC · Completed 2022",
      title: "Diesel Generator EPC Installation",
      client: "Bashundhara Group",
      metric: "Multi-unit",
      status: "Completed",
      image: "/assets/slider/mep/03.jpg",
      webpImage: "/assets/slider/mep/03.webp",
    },
    {
      id: "rooftop-solar-pv",
      categorySlug: "solar",
      statusLabel: "Solar Power · Completed 2022",
      title: "Rooftop Solar PV Installation",
      client: "PRAN-RFL Group (Multiple Facilities)",
      metric: "500 kWp+",
      status: "Completed",
      image: "/assets/slider/solar/04.jpg",
      webpImage: "/assets/slider/solar/04.webp",
    },
    {
      id: "33kv-substation-turnkey",
      categorySlug: "substation",
      statusLabel: "Substation · Completed 2021",
      title: "33KV Substation Turnkey Project",
      client: "Square Pharmaceuticals Ltd.",
      metric: "5,000 kVA",
      status: "Completed",
      image: "/assets/slider/substation/02.jpg",
      webpImage: "/assets/slider/substation/02.webp",
    },
    {
      id: "factory-relocation-mep",
      categorySlug: "mep",
      statusLabel: "MEP / EPC · Completed 2021",
      title: "Factory Relocation & MEP",
      client: "Unilever Bangladesh Ltd.",
      metric: "Turnkey",
      status: "Completed",
      image: "/assets/slider/mep/04.jpg",
      webpImage: "/assets/slider/mep/04.webp",
    },
    {
      id: "cooling-tower-water-treatment",
      categorySlug: "water-treatment",
      statusLabel: "Water Treatment · Ongoing",
      title: "Industrial Cooling Tower Water Treatment",
      client: "Pharma Group, Narayanganj",
      metric: "~90 MT/yr",
      status: "Ongoing",
      image: "/assets/slider/water/01.jpg",
      webpImage: "/assets/slider/water/01.webp",
    },
    {
      id: "boiler-chemical-treatment",
      categorySlug: "water-treatment",
      statusLabel: "Water Treatment · Completed 2024",
      title: "Steam Boiler Chemical Treatment Program",
      client: "Beverage Plant, Gazipur",
      metric: "~40 MT/yr",
      status: "Completed",
      image: "/assets/slider/water/02.jpg",
      webpImage: "/assets/slider/water/02.webp",
    },
    {
      id: "ro-membrane-antiscalant",
      categorySlug: "water-treatment",
      statusLabel: "Water Treatment · Ongoing",
      title: "RO Membrane Antiscalant & Cleaning Program",
      client: "Textile Mill, Narayanganj",
      metric: "~15 MT/yr",
      status: "Ongoing",
      image: "/assets/slider/water/03.jpg",
      webpImage: "/assets/slider/water/03.webp",
    },
  ];
}

export interface SupportFeature {
  title: string;
  description: string;
  icon: "wrench" | "refresh" | "target" | "clock";
}

export async function getSupportFeatures(): Promise<SupportFeature[]> {
  return [
    {
      title: "Unparalleled Technical Expertise",
      description:
        "Strong after-sales capability ensuring reliable operation and timely service.",
      icon: "wrench",
    },
    {
      title: "Embracing Commitments",
      description: "Safeguarding sales by extensive after-sales service coverage.",
      icon: "refresh",
    },
    {
      title: "Precision Engineering",
      description: "Relentless pursuit of work perfection to ensure customer satisfaction.",
      icon: "target",
    },
    {
      title: "24/7 Effortless Vigilance",
      description:
        "Nationwide proven service excellence and emergency responses — in time, every time.",
      icon: "clock",
    },
  ];
}

import partnersManifest from "@/data/partners.json";

export interface PartnerBrand {
  name: string;
  slug?: string;
  logo?: string;
}

export async function getPartnerBrands(): Promise<PartnerBrand[]> {
  return partnersManifest;
}

export type PartnerCategory =
  | "Power & Electrical"
  | "Solar"
  | "Industrial"
  | "Cables & Transformers";

export interface PartnerCategoryMeta {
  category: PartnerCategory;
  description: string;
}

export const PARTNER_CATEGORY_META: Record<PartnerCategory, PartnerCategoryMeta> = {
  "Power & Electrical": {
    category: "Power & Electrical",
    description: "Power management, electrical systems, and industrial automation brands.",
  },
  Solar: {
    category: "Solar",
    description: "Solar inverters, modules, and mounting systems for utility & rooftop-scale plants.",
  },
  Industrial: {
    category: "Industrial",
    description: "Power generation, compressed air, and HVAC / climate control equipment.",
  },
  "Cables & Transformers": {
    category: "Cables & Transformers",
    description: "Transformers, industrial cabling, and electrical component brands.",
  },
};

export interface DetailedPartnerBrand {
  name: string;
  category: PartnerCategory;
  focus: string;
  featured?: boolean;
  authorized?: boolean;
}

export async function getDetailedPartnerBrands(): Promise<DetailedPartnerBrand[]> {
  return [
    { name: "DEIF", category: "Power & Electrical", focus: "Power Management", featured: true, authorized: true },
    { name: "NALCO Water", category: "Power & Electrical", focus: "Water Treatment", featured: true, authorized: true },
    { name: "ABB", category: "Power & Electrical", focus: "Electrical Systems" },
    { name: "Schneider Electric", category: "Power & Electrical", focus: "Energy Management" },
    { name: "Siemens", category: "Power & Electrical", focus: "Industrial Automation" },
    { name: "CHNT", category: "Power & Electrical", focus: "Electrical Components" },

    { name: "SMA", category: "Solar", focus: "Solar Inverters" },
    { name: "Huawei", category: "Solar", focus: "Solar Inverters" },
    { name: "Solis", category: "Solar", focus: "Solar Inverters" },
    { name: "Trina Solar", category: "Solar", focus: "Solar Modules" },
    { name: "JA Solar", category: "Solar", focus: "Solar Modules" },
    { name: "LONGi", category: "Solar", focus: "Solar Modules" },
    { name: "Jinko Solar", category: "Solar", focus: "Solar Modules" },
    { name: "Angels Solar", category: "Solar", focus: "Solar Solutions" },
    { name: "X-Energy", category: "Solar", focus: "Solar Energy" },
    { name: "Leader", category: "Solar", focus: "Solar Mounting" },

    { name: "CAT", category: "Industrial", focus: "Power Generation" },
    { name: "CompAir", category: "Industrial", focus: "Compressed Air" },
    { name: "Ingersoll Rand", category: "Industrial", focus: "Industrial Equipment" },
    { name: "Atlas Copco", category: "Industrial", focus: "Compressors" },
    { name: "Daikin", category: "Industrial", focus: "HVAC Systems" },
    { name: "TROX", category: "Industrial", focus: "Air Distribution" },
    { name: "Trane", category: "Industrial", focus: "HVAC / Chillers" },
    { name: "Wilo", category: "Industrial", focus: "Pumps & Systems" },
    { name: "Kruger", category: "Industrial", focus: "Fan Technology" },

    { name: "SGB-SMIT", category: "Cables & Transformers", focus: "Transformers" },
    { name: "ARADY", category: "Cables & Transformers", focus: "Transformers" },
    { name: "BBS Cables", category: "Cables & Transformers", focus: "Cable Systems" },
    { name: "Lapp Kabel", category: "Cables & Transformers", focus: "Industrial Cables" },
    { name: "BRB", category: "Cables & Transformers", focus: "Cable & Wire" },
  ];
}

export type ClientIndustry =
  | "FMCG & Consumer Goods"
  | "Industrial & Conglomerate Groups"
  | "Energy, Power & Heavy Industry"
  | "Pharmaceutical & Healthcare"
  | "Telecommunications"
  | "Government, Defence & Utilities"
  | "Education & Institutions";

export interface ClientIndustryMeta {
  industry: ClientIndustry;
  icon: "cart" | "crane" | "bolt" | "flask" | "broadcast" | "landmark" | "cap";
  accent: "teal" | "blue" | "amber" | "purple";
  focus: string;
}

export const CLIENT_INDUSTRY_META: Record<ClientIndustry, ClientIndustryMeta> = {
  "FMCG & Consumer Goods": {
    industry: "FMCG & Consumer Goods",
    icon: "cart",
    accent: "teal",
    focus: "Multinational brands · Electrical & MEP solutions",
  },
  "Industrial & Conglomerate Groups": {
    industry: "Industrial & Conglomerate Groups",
    icon: "crane",
    accent: "blue",
    focus: "Bangladesh's largest business houses · Substation, switchgear & EPC",
  },
  "Energy, Power & Heavy Industry": {
    industry: "Energy, Power & Heavy Industry",
    icon: "bolt",
    accent: "purple",
    focus: "Substations, solar & generator EPC",
  },
  "Pharmaceutical & Healthcare": {
    industry: "Pharmaceutical & Healthcare",
    icon: "flask",
    accent: "blue",
    focus: "HVAC, MEP, water treatment & clean-room electrical",
  },
  Telecommunications: {
    industry: "Telecommunications",
    icon: "broadcast",
    accent: "teal",
    focus: "Tower power, substation & electrical infrastructure",
  },
  "Government, Defence & Utilities": {
    industry: "Government, Defence & Utilities",
    icon: "landmark",
    accent: "amber",
    focus: "Power utilities, armed forces & development corporations",
  },
  "Education & Institutions": {
    industry: "Education & Institutions",
    icon: "cap",
    accent: "teal",
    focus: "Campus MEP, electrical & water treatment",
  },
};

export interface IndustryClient {
  name: string;
  industry: ClientIndustry;
}

export async function getIndustryLeaders(): Promise<IndustryClient[]> {
  return [
    { name: "British American Tobacco", industry: "FMCG & Consumer Goods" },
    { name: "Nestlé Bangladesh", industry: "FMCG & Consumer Goods" },
    { name: "Unilever Bangladesh", industry: "FMCG & Consumer Goods" },
    { name: "Coca-Cola Bangladesh", industry: "FMCG & Consumer Goods" },
    { name: "Arla Foods", industry: "FMCG & Consumer Goods" },
    { name: "PRAN-RFL Group", industry: "FMCG & Consumer Goods" },
    { name: "Marico Bangladesh", industry: "FMCG & Consumer Goods" },
    { name: "Reckitt Bangladesh", industry: "FMCG & Consumer Goods" },

    { name: "Bashundhara Group", industry: "Industrial & Conglomerate Groups" },
    { name: "Akij Group", industry: "Industrial & Conglomerate Groups" },
    { name: "Meghna Group", industry: "Industrial & Conglomerate Groups" },
    { name: "PHP Group", industry: "Industrial & Conglomerate Groups" },
    { name: "Ha-Meem Group", industry: "Industrial & Conglomerate Groups" },
    { name: "KDS Group", industry: "Industrial & Conglomerate Groups" },
    { name: "Abul Khair Group", industry: "Industrial & Conglomerate Groups" },
    { name: "Partex Group", industry: "Industrial & Conglomerate Groups" },
    { name: "Nassa Group", industry: "Industrial & Conglomerate Groups" },
    { name: "DBL Group", industry: "Industrial & Conglomerate Groups" },
    { name: "Square Group", industry: "Industrial & Conglomerate Groups" },
    { name: "ACI Group", industry: "Industrial & Conglomerate Groups" },
    { name: "Abedin Group", industry: "Industrial & Conglomerate Groups" },

    { name: "Chevron Bangladesh", industry: "Energy, Power & Heavy Industry" },
    { name: "GPH Ispat", industry: "Energy, Power & Heavy Industry" },
    { name: "Walton Hi-Tech", industry: "Energy, Power & Heavy Industry" },
    { name: "Sharmin Group", industry: "Energy, Power & Heavy Industry" },
    { name: "Summit Power", industry: "Energy, Power & Heavy Industry" },
    { name: "Doreen Power", industry: "Energy, Power & Heavy Industry" },
    { name: "United Power", industry: "Energy, Power & Heavy Industry" },
    { name: "Arotech", industry: "Energy, Power & Heavy Industry" },

    { name: "Renata PLC", industry: "Pharmaceutical & Healthcare" },
    { name: "Incepta Pharma", industry: "Pharmaceutical & Healthcare" },
    { name: "IBN Sina Pharma", industry: "Pharmaceutical & Healthcare" },
    { name: "Beximco Pharma", industry: "Pharmaceutical & Healthcare" },
    { name: "Square Pharma", industry: "Pharmaceutical & Healthcare" },
    { name: "Opsonin Pharma", industry: "Pharmaceutical & Healthcare" },

    { name: "Grameenphone", industry: "Telecommunications" },
    { name: "Robi Axiata", industry: "Telecommunications" },
    { name: "Banglalink", industry: "Telecommunications" },
    { name: "TowerCo Bangladesh", industry: "Telecommunications" },

    { name: "Bangladesh Navy", industry: "Government, Defence & Utilities" },
    { name: "Bangladesh Ordnance Factories", industry: "Government, Defence & Utilities" },
    { name: "Bangladesh Agricultural Dev. Corp.", industry: "Government, Defence & Utilities" },
    { name: "BREB", industry: "Government, Defence & Utilities" },
    { name: "PGCB", industry: "Government, Defence & Utilities" },
    { name: "DESCO", industry: "Government, Defence & Utilities" },
    { name: "BPDB", industry: "Government, Defence & Utilities" },
    { name: "WZPDCL", industry: "Government, Defence & Utilities" },

    { name: "BRAC University", industry: "Education & Institutions" },
    { name: "North South University", industry: "Education & Institutions" },
    { name: "Independent University", industry: "Education & Institutions" },
    { name: "Dhaka Chamber of Commerce", industry: "Education & Institutions" },
  ];
}

export interface ClientStat {
  value: string;
  accent?: string;
  label: string;
}

export async function getClientStats(): Promise<ClientStat[]> {
  return [
    { value: "65", accent: "+", label: "Active Clients\nAcross All Divisions" },
    { value: "7", accent: "+", label: "Industry Sectors\nServed" },
    { value: "15", accent: "+", label: "Years of Client\nRelationships" },
    { value: "95", accent: "%", label: "Client Retention\nRate" },
  ];
}

export interface ClientTestimonial {
  quote: string;
  author: string;
  role: string;
}

export async function getClientTestimonials(): Promise<ClientTestimonial[]> {
  return [
    {
      quote:
        "BTEL delivered our 33KV substation on schedule and without compromise. Their team's technical depth and on-site coordination was outstanding throughout the project lifecycle.",
      author: "Engineering Manager",
      role: "FMCG Multinational, Dhaka",
    },
    {
      quote:
        "We've worked with BTEL across three facility expansions. Their NALCO water treatment chemical supply and after-sales support has been consistently reliable — they genuinely understand our operational needs.",
      author: "Facilities Director",
      role: "Pharmaceutical Group, Narayanganj",
    },
    {
      quote:
        "From generator EPC to HVAC commissioning, BTEL handled everything under one roof. The quality of execution and timeliness set them apart from other vendors we've worked with.",
      author: "Project Director",
      role: "Industrial Conglomerate, Chittagong",
    },
  ];
}
