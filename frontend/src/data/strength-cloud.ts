/**
 * Data for the "Our Strength" word-cloud section, built from
 * `Asset/stregthg section.pdf`.
 *
 * The design is a 1000x1000 square whose LARGE grey words trace the B-T-R-A-C
 * letterforms, packed with smaller white/grey value-words and yellow accents,
 * with "Our Strength" set in yellow across the lower third. The section
 * recolours that yellow to the theme accent when it renders.
 *
 * The cloud itself ships as extracted artwork, not as a picture: the PDF
 * outlines all of its text to vector paths, so the letterforms are reproduced as
 * reusable glyph outlines placed in a code-rendered SVG (see
 * `strength-cloud-words.ts` and `strength-cloud-mark.ts`). These values back
 * that artwork as real text for screen readers and search engines.
 */

/**
 * Every distinct value-word that appears in the cloud. Backed onto the extracted
 * artwork as real text for screen readers and search engines.
 */
export const STRENGTH_VALUES = [
  "Our Strength",
  "Growth",
  "Sustainability",
  "Agility",
  "Integrity",
  "Reliability",
  "Discipline",
  "Performance",
  "Leadership",
  "Precision",
  "Consistency",
  "Collaboration",
  "Teamwork",
  "Trust",
  "Professionalism",
  "Accountability",
  "Customer Focus",
  "Quality Excellence",
  "Timely Delivery",
  "Delivery commitment",
] as const;

/**
 * The capability areas listed beside the cloud: the four management functions
 * the values above are delivered through. Each carries the name of the icon the
 * section draws for it, kept as a key rather than a component so this file stays
 * free of JSX.
 */
export const STRENGTH_AREAS = [
  {
    icon: "target",
    title: "Project Management",
    description:
      "Dedicated team of competent engineers & technicians. Timebound project execution and superior tactical support for every engagement.",
  },
  {
    icon: "coins",
    title: "Finance Management",
    description:
      "Revenue growth, equity growth & market share. Large project financing, solvency health, productivity and compliance with tax & regulatory requirements.",
  },
  {
    icon: "factory",
    title: "Production Facility",
    description:
      "ISO certified fully compliant production facility with dedicated workstations for different production criterions to ensure consistent quality output.",
  },
  {
    icon: "truck",
    title: "Supply Chain Management",
    description:
      "ERP-based supply chain with extensive quality control for inbound and outbound fleets. Ensuring materials arrive on time, every time.",
  },
] as const;
