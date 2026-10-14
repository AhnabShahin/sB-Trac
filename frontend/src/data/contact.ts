export interface ContactRow {
  icon: "pin" | "factory" | "phone" | "whatsapp" | "mail" | "globe";
  label: string;
  value: string;
  href?: string;
}

export async function getContactRows(): Promise<ContactRow[]> {
  return [
    { icon: "pin", label: "Head Office", value: "Plot-68, Block-H, Road-11, Banani, Dhaka-1213" },
    // TODO: confirm exact factory street address in Bhulta, Narayanganj with client
    { icon: "factory", label: "Factory", value: "Bhulta, Narayanganj (factory address TBC)" },
    { icon: "phone", label: "Phone", value: "+88 01990-515151 · +88 01755-515151" },
    {
      icon: "whatsapp",
      label: "WhatsApp",
      value: "+88 01990-515151",
      // TODO: confirm dedicated WhatsApp business number with client — reusing office phone for now
      href: "https://wa.me/8801990515151",
    },
    { icon: "mail", label: "Email", value: "info@btraceng.com" },
    { icon: "globe", label: "Website", value: "www.btraceng.com" },
  ];
}

// TODO: replace with the confirmed head office address/coordinates once available
export const OFFICE_MAP_EMBED_SRC =
  "https://www.google.com/maps?q=Plot-68,+Block-H,+Road-11,+Banani,+Dhaka-1213&output=embed";

export const SERVICE_OPTIONS = [
  "Substation & Switchgear Systems",
  "Solar Power Solutions",
  "MEP / EPC Solutions",
  "Water Treatment Chemicals",
  "After Sales Support & Service",
  "Multiple Services",
];

export const CERT_BADGES = ["ISO 9001:2015", "EPC Licensed", "Since 2009"];

export const BUDGET_OPTIONS = [
  "Under 50 Lakh",
  "50 Lakh – 1 Cr",
  "1 Cr – 5 Cr",
  "5 Cr – 20 Cr",
  "20 Cr+",
  "Prefer not to say",
];

export const EMERGENCY_PHONES = ["+88 01990-515151", "+88 01755-515151"];

export interface WhatsappLink {
  label: string;
  /** Digits only, country code included — used to build the wa.me URL. */
  waId: string;
}

export const WHATSAPP_LINKS: WhatsappLink[] = [
  { label: "+88 01990-515151", waId: "8801990515151" },
  { label: "+88 01755-515151", waId: "8801755515151" },
];

export interface ContactInfoCard {
  icon: "pin" | "factory" | "phone" | "whatsapp" | "mail" | "globe" | "clock" | "shield";
  label: string;
  value: string;
  href?: string;
  full?: boolean;
  accent?: boolean;
}

export async function getContactInfoCards(): Promise<ContactInfoCard[]> {
  return [
    {
      icon: "pin",
      label: "Head Office",
      value: "Plot-68, Block-H, Road-11, Banani, Dhaka-1213, Bangladesh",
      full: true,
    },
    {
      icon: "factory",
      label: "Factory",
      // TODO: confirm exact factory street address in Bhulta, Narayanganj with client
      value: "Bhulta, Narayanganj (factory address TBC)",
      full: true,
    },
    { icon: "phone", label: "Phone", value: "+88 01990-515151 / +88 01755-515151", href: "tel:+8801990515151" },
    {
      icon: "whatsapp",
      label: "WhatsApp",
      value: "+88 01990-515151",
      // TODO: confirm dedicated WhatsApp business number with client — reusing office phone for now
      href: "https://wa.me/8801990515151",
    },
    { icon: "mail", label: "Email", value: "info@btraceng.com", href: "mailto:info@btraceng.com" },
    { icon: "globe", label: "Website", value: "www.btraceng.com", href: "https://www.btraceng.com" },
    { icon: "clock", label: "Office Hours", value: "Sun–Thu: 9am–6pm · Fri–Sat: Support only" },
    { icon: "shield", label: "Emergency", value: "24/7 Service Line · +88 01755-515151", href: "tel:+8801755515151", accent: true },
  ];
}

export interface SocialLink {
  label: "Facebook" | "LinkedIn";
  href: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "Facebook", href: "https://facebook.com/btraceng" },
  { label: "LinkedIn", href: "https://linkedin.com/company/b-tracengineering" },
];

export interface ContactFaq {
  question: string;
  answer: string;
}

export async function getContactFaqs(): Promise<ContactFaq[]> {
  return [
    {
      question: "How quickly does BTEL respond to inquiries?",
      answer:
        "Our engineering team reviews every inquiry and responds within 24 business hours. For urgent project requirements, call our direct lines — +88 01990-515151 or +88 01755-515151.",
    },
    {
      question: "Does BTEL handle turnkey projects or just supply?",
      answer:
        "BTEL is a full EPC company — we handle design, supply, installation, testing, commissioning, and after-sales support. We also do supply-only for transmission line hardware and NALCO water treatment chemicals.",
    },
    {
      question: "What is the minimum project size BTEL takes on?",
      answer:
        "BTEL works with projects of all sizes — from a single transformer to a BDT 185 Cr MEP contract. For chemical supply, there's no minimum order. Contact us to discuss your specific requirements.",
    },
    {
      question: "Is BTEL ISO certified?",
      answer:
        "Yes. B-Trac Engineering Ltd. is an ISO 9001:2015 certified organization — covering all aspects of design, procurement, project management, installation, and after-sales service.",
    },
    {
      question: "Does BTEL provide after-sales service for installed equipment?",
      answer:
        "Absolutely. BTEL offers Annual Maintenance Contracts (AMC), on-call service, emergency response, and preventive maintenance for all installed systems — nationwide, 24/7.",
    },
    {
      question: "Can BTEL supply NALCO chemicals without an engineering contract?",
      answer:
        "Yes. NALCO water treatment chemicals — boiler chemicals, RO chemicals, cooling tower chemicals, and engine coolants — can be ordered as standalone supply. Contact our water treatment team for pricing and availability.",
    },
  ];
}
