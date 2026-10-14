export type ProductAccent = "blue" | "amber" | "teal" | "purple" | "cyan";

export interface Product {
  id: string;
  title: string;
  /** The "WRITE UP" column from the product list — shown in full inside the modal. */
  writeUp: string;
  /** Optional spec bullets surfaced in the modal where the list gave ranges. */
  highlights?: string[];
  image: string;
  /** Further photos of the same item, shown as thumbnails in the modal. */
  gallery?: string[];
}

export interface ProductSubCategory {
  id: string;
  name: string;
  products: Product[];
}

export interface ProductCategory {
  id: string;
  /** Display name; the source list used abbreviations. */
  name: string;
  /** The abbreviation exactly as it appears in the source list. */
  shortName: string;
  description: string;
  accent: ProductAccent;
  image: string;
  subCategories: ProductSubCategory[];
}

/**
 * Real photography from `Asset/product with sample pics.pdf`, keyed by product title.
 * The first entry is the card/modal image; any extras become the modal gallery.
 */
const PRODUCT_PHOTOS: Record<string, string[]> = {
  // Switchgear & Control Panels
  "33kV & 11kV Substation System": ["substation-33kv-11kv"],
  "11kV Substation System": ["substation-11kv"],
  "Oil Type Transformer": ["oil-type-transformer"],
  "High Voltage Switchgears": ["hv-switchgear-1", "hv-switchgear-2"],
  "Low Voltage Switchgears": ["lv-switchgear"],
  "AIS and GIS Panels": ["ais-gis-panels"],
  "Synchronization Panels": ["synchronization-panels"],
  "Automatic Transfer Switch": ["automatic-transfer-switch"],
  "Automatic Voltage Regulators": ["automatic-voltage-regulators"],
  "Motor Control Centres (MCC)": ["motor-control-centres"],
  "NGR-NGS Panels": ["ngr-ngs-panels"],
  "Industrial Power Distribution Systems": ["power-distribution-systems"],
  "Industrial UPS": ["industrial-ups"],
  "Active / Passive Harmonic Filters": ["harmonic-filters"],
  "Lightning Protection Systems (LPS)": ["lightning-protection-lps"],
  "SCADA Automation Systems": ["scada-automation"],
  "Programmable Logic Controlling": ["programmable-logic-controlling"],
  // The PDF lists the DEIF range as one heading with a photo per model below it.
  "Generator Controllers": ["deif-agc", "deif-gpc3", "deif-agi"],
  "Marine Generator Controllers": ["deif-iom"],
  "Battery Chargers": ["deif-battery-chargers"],
  "Retrofitting Works of Existing Systems": ["retrofitting-works"],

  // MEP / EPC
  "Complete MEP Solutions": ["mep-solutions"],
  "Generator Installation Works": ["generator-installation"],
  "Boiler EPC Works": ["boiler-epc"],
  "Production Machinery Installation": ["machinery-installation"],
  "Heavy Lifting & Logistics Support": ["heavy-lifting"],
  "HVAC System": ["hvac-system"],
  "Building Management System (BMS)": ["building-management-system"],
  "Fire Hazard Management": ["fire-hazard"],
  "CCTV Solutions & Access Control": ["cctv-access-control"],
  "Sound Attenuation Works": ["sound-attenuation-1", "sound-attenuation-2"],
  "Industrial Piping Works": ["industrial-piping"],
  "Fuel Storage & Distribution": ["fuel-storage"],
  "Mufflers": ["mufflers"],

  // Renewable Energy
  "On-Grid Solar Power Plant": ["on-grid-solar"],
  "Hybrid Solar Power Solution": ["hybrid-solar"],
  "Energy Storage System (ESS)": ["energy-storage"],
};

/**
 * Fallback for the handful of catalogue items the sample-pics PDF never photographs
 * (the NALCO chemistry range, voltage stabilisers, testing facility). Each division
 * still reuses its own slider pool rather than borrowing another division's.
 */
const IMAGE_POOLS: Record<string, string[]> = {
  scp: [
    "/assets/slider/substation/01.jpg",
    "/assets/slider/substation/02.jpg",
    "/assets/slider/substation/03.jpg",
    "/assets/slider/substation/04.jpg",
  ],
  "mep-epc": [
    "/assets/slider/mep/01.jpg",
    "/assets/slider/mep/02.jpg",
    "/assets/slider/mep/03.jpg",
    "/assets/slider/mep/04.jpg",
  ],
  "renewable-energy": [
    "/assets/slider/solar/01.jpg",
    "/assets/slider/solar/02.jpg",
    "/assets/slider/solar/03.jpg",
  ],
  nalco: [
    "/assets/slider/water/01.jpg",
    "/assets/slider/water/02.jpg",
    "/assets/slider/water/03.jpg",
    "/assets/slider/water/04.jpg",
  ],
};

type RawProduct = Omit<Product, "id" | "image" | "gallery">;
type RawSubCategory = { id: string; name: string; products: RawProduct[] };
type RawCategory = Omit<ProductCategory, "subCategories"> & { subCategories: RawSubCategory[] };

/** Source data transcribed from `Asset/Product list-website.pdf`. */
const RAW_CATEGORIES: RawCategory[] = [
  {
    id: "scp",
    name: "Switchgear & Control Panels",
    shortName: "SCP",
    description:
      "Turnkey electrical infrastructure — from 11kV substations and power transformers through switchgear, automation, and power quality.",
    accent: "blue",
    image: "/assets/hero/substation.jpg",
    subCategories: [
      {
        id: "substation-systems",
        name: "Substation Systems",
        products: [
          {
            title: "33kV & 11kV Substation System",
            writeUp:
              "Complete turnkey substation solutions for 33kV systems, including design, engineering, supply, installation, testing, commissioning and maintenance ranging from 3MVA to 20MVA.",
            highlights: ["33kV systems", "3MVA – 20MVA", "Turnkey scope"],
          },
          {
            title: "11kV Substation System",
            writeUp:
              "Complete turnkey substation solutions for 11kV systems, including design, engineering, supply, installation, testing, commissioning and maintenance ranging from 100kVA to 4000kVA.",
            highlights: ["11kV systems", "100kVA – 4000kVA", "Turnkey scope"],
          },
          {
            title: "Oil Type Transformer",
            writeUp:
              "High-efficiency oil immersed transformers for reliable power transformation in industrial and utility applications for upto 20MVA.",
            highlights: ["Up to 20MVA", "Oil immersed"],
          },
        ],
      },
      {
        id: "switchgear",
        name: "Switchgear",
        products: [
          {
            title: "High Voltage Switchgears",
            writeUp:
              "Safe and dependable HV switchgear systems for power protection, switching, and network control.",
          },
          {
            title: "Low Voltage Switchgears",
            writeUp:
              "Custom LV switchgears designed for reliable power distribution, protection, and operational safety for upto 12,000 Amps.",
            highlights: ["Up to 12,000 Amps", "Custom built"],
          },
          {
            title: "AIS and GIS Panels",
            writeUp:
              "Reliable air-insulated and gas-insulated switchgear solutions for modern substations.",
            highlights: ["AIS & GIS", "Modern substations"],
          },
        ],
      },
      {
        id: "power-control",
        name: "Power Control & Distribution",
        products: [
          {
            title: "Synchronization Panels",
            writeUp:
              "State of the art synchronization panels for seamless generator and grid power management.",
          },
          {
            title: "Automatic Transfer Switch",
            writeUp:
              "Automatic power source transfer systems ensuring uninterrupted electrical supply upto 4000 Amps.",
            highlights: ["Up to 4000 Amps", "Automatic transfer"],
          },
          {
            title: "Automatic Voltage Regulators",
            writeUp:
              "Automatic voltage regulation systems ensuring stable and reliable power output for 11kV and 33kV systems.",
            highlights: ["11kV & 33kV", "Automatic regulation"],
          },
          {
            title: "Motor Control Centres (MCC)",
            writeUp:
              "Crafted motor control panels providing efficient operation, protection, and monitoring of industrial motors.",
          },
          {
            title: "NGR-NGS Panels",
            writeUp:
              "NGR-NGS panels designed to improve electrical safety and fault protection.",
          },
          {
            title: "Industrial Power Distribution Systems",
            writeUp:
              "Complete power distribution infrastructure engineered for industrial facilities.",
          },
        ],
      },
      {
        id: "power-quality",
        name: "Power Quality & Backup",
        products: [
          {
            title: "Industrial UPS",
            writeUp:
              "Reliable industrial UPS systems delivering continuous power for critical equipment ranging from 10kVA to 1200kVA.",
            highlights: ["10kVA – 1200kVA", "Critical backup"],
          },
          {
            title: "Industrial Voltage Stabilizers",
            writeUp:
              "Precision voltage stabilization solutions protecting equipment from voltage fluctuations.",
          },
          {
            title: "Active / Passive Harmonic Filters",
            writeUp:
              "Power quality solutions that reduce harmonics and improve system efficiency, filters range from 30kW to 600kW.",
            highlights: ["30kW – 600kW", "Active & passive"],
          },
          {
            title: "Lightning Protection Systems (LPS)",
            writeUp:
              "Comprehensive lightning protection systems safeguarding facilities and equipment.",
          },
        ],
      },
      {
        id: "automation",
        name: "Automation & Control",
        products: [
          {
            title: "SCADA Automation Systems",
            writeUp:
              "Advanced SCADA solutions for real-time monitoring, control, and remote operation of electrical assets.",
            highlights: ["Real-time monitoring", "Remote operation"],
          },
          {
            title: "Programmable Logic Controlling",
            writeUp:
              "PLC-based automation systems for intelligent industrial process control. Featuring GE and WAGO.",
            highlights: ["PLC based", "GE & WAGO"],
          },
        ],
      },
      {
        id: "deif",
        name: "DEIF Distribution",
        products: [
          {
            title: "Generator Controllers",
            writeUp:
              "DEIF generator controllers for land-based prime power applications.",
            highlights: ["GPC3", "AGC 150"],
          },
          {
            title: "Marine Generator Controllers",
            writeUp:
              "DEIF marine-grade generator control for marine power management systems.",
            highlights: ["GPU 3", "PPU3", "DM4"],
          },
          {
            title: "Battery Chargers",
            writeUp:
              "DEIF battery charging solutions for standby and emergency power systems.",
            highlights: ["10A – 40A"],
          },
        ],
      },
      {
        id: "services",
        name: "Retrofit & Testing",
        products: [
          {
            title: "Retrofitting Works of Existing Systems",
            writeUp:
              "Modernization and upgrade services to improve the performance and reliability of existing electrical systems.",
          },
          {
            title: "Testing Facility",
            writeUp:
              "Comprehensive testing and quality assurance services to ensure compliance with industry standards.",
          },
        ],
      },
    ],
  },
  {
    id: "mep-epc",
    name: "MEP / EPC",
    shortName: "MEP / EPC",
    description:
      "End-to-end mechanical, electrical and plumbing engineering — delivered as design, procurement, construction, and commissioning.",
    accent: "teal",
    image: "/assets/hero/mep.jpg",
    subCategories: [
      {
        id: "mep-solutions",
        name: "MEP Solutions",
        products: [
          {
            title: "Complete MEP Solutions",
            writeUp:
              "End-to-end mechanical, electrical, and plumbing engineering, procurement, and construction services.",
            highlights: ["Design to build", "Single point of responsibility"],
          },
        ],
      },
      {
        id: "industrial-installation",
        name: "Industrial Installation",
        products: [
          {
            title: "Generator Installation Works",
            writeUp:
              "Professional installation, commissioning, and integration of industrial generator systems.",
          },
          {
            title: "Boiler EPC Works",
            writeUp:
              "Complete EPC solutions for industrial boiler installation and associated utilities.",
          },
          {
            title: "Production Machinery Installation",
            writeUp:
              "Expert installation and commissioning of industrial production machinery.",
          },
          {
            title: "Heavy Lifting & Logistics Support",
            writeUp:
              "Heavy equipment handling, rigging, transportation, and installation support.",
          },
        ],
      },
      {
        id: "building-systems",
        name: "Building Systems",
        products: [
          {
            title: "HVAC System",
            writeUp:
              "Energy-efficient HVAC solutions for commercial and industrial environments. Chiller capacity upto 450TR and AHU upto 110TR.",
            highlights: ["Chiller upto 450TR", "AHU upto 110TR"],
          },
          {
            title: "Building Management System (BMS)",
            writeUp:
              "Centralized building automation systems for monitoring and controlling facility operations.",
          },
          {
            title: "Fire Hazard Management",
            writeUp:
              "Integrated fire detection, suppression, and protection solutions.",
          },
          {
            title: "CCTV Solutions & Access Control",
            writeUp:
              "Integrated surveillance and access control systems for enhanced security.",
          },
          {
            title: "Sound Attenuation Works",
            writeUp:
              "Noise reduction and acoustic treatment solutions for industrial generators. Expert in constructing generator canopies and room canopies.",
          },
        ],
      },
      {
        id: "process-systems",
        name: "Process & Utility Systems",
        products: [
          {
            title: "Industrial Piping Works",
            writeUp:
              "Design and installation of industrial piping systems for multiple process applications.",
          },
          {
            title: "Fuel Storage & Distribution",
            writeUp:
              "Safe fuel storage, transfer, and distribution systems designed to industry standards.",
          },
          {
            title: "Mufflers",
            writeUp:
              "Industrial exhaust silencing solutions for generators and engines, featuring both industrial mufflers and residential mufflers.",
            highlights: ["Industrial & residential"],
          },
        ],
      },
    ],
  },
  {
    id: "renewable-energy",
    name: "Renewable Energy",
    shortName: "Renewable Energy",
    description:
      "Grid-connected, hybrid, and storage-backed solar systems engineered for industrial and commercial loads.",
    accent: "amber",
    image: "/assets/hero/solar.jpg",
    subCategories: [
      {
        id: "solar",
        name: "Solar Power",
        products: [
          {
            title: "On-Grid Solar Power Plant",
            writeUp:
              "Grid-connected solar PV systems designed to maximize clean energy generation and reduce operating costs.",
          },
          {
            title: "Hybrid Solar Power Solution",
            writeUp:
              "Hybrid solar systems combining solar, battery, and grid or generator power for uninterrupted operation.",
            highlights: ["Solar + battery + grid"],
          },
        ],
      },
      {
        id: "storage",
        name: "Energy Storage",
        products: [
          {
            title: "Energy Storage System (ESS)",
            writeUp:
              "Battery energy storage solutions for peak shaving, backup power, and renewable energy optimization.",
            highlights: ["Peak shaving", "Backup power"],
          },
        ],
      },
    ],
  },
  {
    id: "nalco",
    name: "NALCO Water Treatment",
    shortName: "NALCO",
    description:
      "Authorized NALCO (Ecolab) chemistry and on-site water testing instruments for boiler, cooling tower, RO, and closed-loop programs.",
    accent: "purple",
    image: "/assets/hero/water.jpg",
    subCategories: [
      {
        id: "chemicals",
        name: "Water Treatment Chemicals",
        products: [
          {
            title: "Boiler Water Treatment Chemicals",
            writeUp:
              "NALCO boiler water treatment chemistry for industrial boiler feed, internal, and blowdown programs.",
          },
          {
            title: "Cooling Tower Chemicals",
            writeUp:
              "NALCO cooling tower chemicals for microbiological control, corrosion inhibition, and water conservation.",
          },
          {
            title: "RO Water Treatment Chemicals",
            writeUp:
              "NALCO RO membrane antiscalant, cleaning, and biocidal chemistry for reverse osmosis systems.",
          },
          {
            title: "Engine Coolant Chemical",
            writeUp:
              "NALCO engine coolant chemistry for closed-loop industrial engine cooling systems.",
          },
          {
            title: "Closed Circuit Chemicals",
            writeUp:
              "NALCO closed circuit chemicals for heating, cooling, and recirculating water systems.",
          },
        ],
      },
      {
        id: "testing",
        name: "Water Testing Instruments",
        products: [
          {
            title: "Water Test Kits",
            writeUp:
              "Field water analysis instruments for on-site testing of boiler, cooling tower, and treated water systems.",
            highlights: [
              "DR 900 meter (HAC)",
              "TDS & PH meter",
              "Conductivity meter",
              "Iron & hardness test kits",
              "Phosphate test kit",
            ],
          },
        ],
      },
    ],
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Expands the raw table into the shape the page renders, attaching each product's own photo. */
export async function getProductCategories(): Promise<ProductCategory[]> {
  return RAW_CATEGORIES.map((category) => {
    const pool = IMAGE_POOLS[category.id] ?? [category.image];
    let cursor = 0;

    return {
      ...category,
      subCategories: category.subCategories.map((sub) => ({
        ...sub,
        products: sub.products.map((product) => {
          const photos = PRODUCT_PHOTOS[product.title]?.map(
            (slug) => `/assets/products/${slug}.jpg`
          );
          const [image, ...gallery] = photos ?? [
            pool[cursor++ % pool.length],
          ];

          return {
            ...product,
            id: `${category.id}-${slugify(product.title)}`,
            image,
            ...(gallery.length > 0 ? { gallery } : {}),
          };
        }),
      })),
    };
  });
}
