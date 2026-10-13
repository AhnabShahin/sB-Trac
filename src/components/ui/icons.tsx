import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps) {
  return {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function FlameIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.38 0 2.5-1.12 2.5-2.5 0-1.74-1.34-2.4-2.5-3.5-1.16 1.1-2.5 1.76-2.5 3.5Z" />
      <path d="M12 2c2.5 3.5 6 6.5 6 11.5a6 6 0 0 1-12 0c0-5 3.5-8 6-11.5Z" />
    </svg>
  );
}

export function RecycleIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.19 9.5" />
      <path d="M11 19h8.2a1.8 1.8 0 0 0 1.564-.89 1.77 1.77 0 0 0 .016-1.777L16.8 9.5" />
      <path d="m14 4-2.1-3.5a1.8 1.8 0 0 0-3.08 0L6.72 4" />
      <path d="m11 15 3 4-3 4" />
      <path d="m4 12-4-2 2-4" />
      <path d="m20 12 4-2-2-4" />
    </svg>
  );
}

export function BoltIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

export function WrenchIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.83 2.83-2.83-2.83Z" />
    </svg>
  );
}

export function DropletIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 2c4 5 7 9.5 7 13a7 7 0 1 1-14 0c0-3.5 3-8 7-13Z" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

export function HandshakeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m2 12 4-4 3 3 3-3 3 3 4-4" />
      <path d="M2 12v4a2 2 0 0 0 2 2h1M22 12v4a2 2 0 0 1-2 2h-1" />
      <path d="M8 15h8" />
    </svg>
  );
}

export function TargetIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

export function WifiIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M2 8.5a16 16 0 0 1 20 0" />
      <path d="M5.5 12.5a11 11 0 0 1 13 0" />
      <path d="M9 16.5a6 6 0 0 1 6 0" />
      <circle cx="12" cy="20" r="1" fill="currentColor" />
    </svg>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function ChevronUpIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m6 15 6-6 6 6" />
    </svg>
  );
}

export function CraneIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 21h16M6 21V9l6-6 6 6M9 21v-6h6v6M6 12h12" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4.5 3h3.5l2 5-2.5 1.5a12 12 0 0 0 5 5L14 12l5 2v3.5c0 1.1-.9 2-2 2A15.5 15.5 0 0 1 2.5 5c0-1.1.9-2 2-2Z" />
    </svg>
  );
}

export function WhatsappIcon(props: IconProps) {
  // Brand glyph renders as a solid mark rather than a stroked outline, so it
  // overrides the shared `base()` stroke defaults and honours `currentColor`.
  return (
    <svg
      {...base({
        fill: "currentColor",
        stroke: "none",
        strokeWidth: 0,
        ...props,
      })}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6 8.5 7 8.5-7" />
    </svg>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 4 5.8 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.8-4-9s1.5-6.5 4-9Z" />
    </svg>
  );
}

export function RefreshIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M20 11a8 8 0 0 0-14.9-3.5M4 13a8 8 0 0 0 14.9 3.5" />
      <path d="M4.5 3.5v4h4M19.5 20.5v-4h-4" />
    </svg>
  );
}

export function HardHatIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 18a8 8 0 0 1 16 0Z" />
      <path d="M12 6v6M4 18h16M9 6.5a3 3 0 0 1 6 0" />
    </svg>
  );
}

export function CoinsIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <ellipse cx="9" cy="7" rx="6" ry="3" />
      <path d="M3 7v5c0 1.66 2.69 3 6 3s6-1.34 6-3V7" />
      <path d="M3 12v5c0 1.66 2.69 3 6 3 2.5 0 4.6-.83 5.5-2M15 9.5c2.9.2 6 1.4 6 3s-3.1 2.8-6 3M21 12.5v5c0 1.4-2.15 2.55-4.5 2.9" />
    </svg>
  );
}

export function FactoryIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 21V10l6 4v-4l6 4V7l6 4v10Z" />
      <path d="M3 21h18M7 21v-4M13 21v-4" />
    </svg>
  );
}

export function TruckIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M2 7h11v10H2z" />
      <path d="M13 10h4l4 3v4h-8z" />
      <circle cx="6.5" cy="18" r="1.75" />
      <circle cx="16.5" cy="18" r="1.75" />
    </svg>
  );
}

export function PanelIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="3" width="16" height="18" rx="1.5" />
      <path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2" />
    </svg>
  );
}

export function TransformerIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="5" y="8" width="14" height="10" rx="1.5" />
      <path d="M9 8V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3M9 22v-4M15 22v-4M8 12h2M14 12h2M8 15h2M14 15h2" />
    </svg>
  );
}

export function BroadcastIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="2" />
      <path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7M5.5 5.5a9 9 0 0 0 0 13M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  );
}

export function AnchorIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v14M8 12H4a8 8 0 0 0 8 9 8 8 0 0 0 8-9h-4" />
      <path d="M8.5 9.5 12 7l3.5 2.5" />
    </svg>
  );
}

export function FlaskIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M10 2h4M9 2v6.5L4.5 18a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L15 8.5V2" />
      <path d="M7 15h10" />
    </svg>
  );
}

export function LightbulbIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.3 1 2.5h6c0-1.2.4-1.9 1-2.5A6 6 0 0 0 12 3Z" />
    </svg>
  );
}

export function ThermostatIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M10 14.5V5a2 2 0 1 1 4 0v9.5a4 4 0 1 1-4 0Z" />
      <path d="M12 9h3" />
    </svg>
  );
}

export function FuelIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 21V6a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v15M3 21h11" />
      <path d="M14 9h2l3 3v6a1.5 1.5 0 0 1-3 0v-1.5a1 1 0 0 0-1-1H14" />
      <circle cx="8.5" cy="9" r="0.75" fill="currentColor" />
    </svg>
  );
}

export function PlugIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9 2v5M15 2v5M7 8h10v4a5 5 0 0 1-10 0V8Z" />
      <path d="M12 17v5" />
    </svg>
  );
}

export function ChecklistIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="3" width="16" height="18" rx="1.5" />
      <path d="m8 8 1.5 1.5L12 7M8 15.5l1.5 1.5L12 14.5M14 8.5h4M14 16h4" />
    </svg>
  );
}

export function LeafIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M20 4c-9 0-16 5-16 14 9 0 14-5 16-14Z" />
      <path d="M5 19c3-4 6.5-7 11-10" />
    </svg>
  );
}

export function BatteryIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="2" y="7" width="18" height="10" rx="2" />
      <path d="M22 10v4" />
      <path d="M6 10v4M10 10v4M14 10v4" />
    </svg>
  );
}

export function BuildingIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3" />
    </svg>
  );
}

export function WheatIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 22V4" />
      <path d="M12 6 8 9M12 6l4 3M12 10l-4 3M12 10l4 3M12 14l-3.5 2.5M12 14l3.5 2.5" />
    </svg>
  );
}

export function HospitalIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="8" width="18" height="13" rx="1" />
      <path d="M9 8V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4" />
      <path d="M12 12v5M9.5 14.5h5" />
    </svg>
  );
}

export function CartIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L20 8H6" />
      <circle cx="9.5" cy="20" r="1.4" />
      <circle cx="17" cy="20" r="1.4" />
    </svg>
  );
}

export function LandmarkIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 21h18M4 21V10M20 21V10M12 3 3 8h18L12 3ZM8 10v7M12 10v7M16 10v7" />
    </svg>
  );
}

export function CapIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 4 2 9l10 5 10-5-10-5Z" />
      <path d="M6 11.5V16c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4.5" />
      <path d="M22 9v6" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M15 8.5h-2c-.6 0-1 .4-1 1V12h3l-.4 3H12v7h-3v-7H7v-3h2V9.2C9 7 10.4 5.5 12.5 5.5H15v3Z" />
    </svg>
  );
}

export function LinkedinIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7.5 10v7M7.5 7.2v.1M12 17v-4.5c0-1.4 1-2.5 2.3-2.5S16.5 11 16.5 12.5V17M12 12.5V17" />
    </svg>
  );
}
