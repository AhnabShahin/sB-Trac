import { getContactRows, OFFICE_MAP_EMBED_SRC } from "@/data/contact";
import { Reveal } from "@/components/ui/reveal";
import { InquiryForm } from "@/components/sections/inquiry-form";
import { PinIcon, FactoryIcon, PhoneIcon, WhatsappIcon, MailIcon, GlobeIcon } from "@/components/ui/icons";

const ICON_MAP = {
  pin: PinIcon,
  factory: FactoryIcon,
  phone: PhoneIcon,
  whatsapp: WhatsappIcon,
  mail: MailIcon,
  globe: GlobeIcon,
} as const;

export async function ContactSection() {
  const rows = await getContactRows();

  return (
    <section
      id="contact"
      className="relative overflow-hidden px-6 py-24 sm:px-12 lg:px-20"
      style={{
        background:
          "linear-gradient(135deg, #101729 0%, #182037 60%, #141e40 100%)",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[200px] -top-[200px] h-[500px] w-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(159,185,252,0.12), transparent 70%)",
        }}
      />

      <div className="relative z-1 mx-auto grid max-w-6xl grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal>
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-teal">
              Get In Touch
            </div>
            <h2 className="mb-4 font-display text-[clamp(36px,4vw,52px)] font-extrabold leading-[1.05] text-white">
              Let&apos;s Engineer
              <br />
              Your Next Project
            </h2>
            <p className="max-w-[520px] text-base leading-[1.7] text-[#94A3B8]">
              Our engineering team responds within 24 hours. For urgent
              inquiries, call or message us directly.
            </p>
          </Reveal>

          <div className="mt-10 flex flex-col gap-5">
            {rows.map((row) => {
              const Icon = ICON_MAP[row.icon];
              const content = (
                <>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-light/20 bg-blue-light/[0.12] text-blue-light transition-all duration-300 group-hover:scale-110 group-hover:border-blue-light/40 group-hover:bg-blue-light/20">
                    <Icon width={18} height={18} />
                  </div>
                  <div>
                    <div className="mb-[3px] text-[11px] uppercase tracking-wide text-muted">
                      {row.label}
                    </div>
                    <div className="text-sm font-medium text-white transition-colors duration-300 group-hover:text-blue-light">
                      {row.value}
                    </div>
                  </div>
                </>
              );

              return row.href ? (
                <a
                  key={row.label}
                  href={row.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-interactive
                  className="group flex items-start gap-4 transition-opacity hover:opacity-90"
                >
                  {content}
                </a>
              ) : (
                <div key={row.label} className="group flex items-start gap-4">
                  {content}
                </div>
              );
            })}
          </div>
        </div>

        <Reveal delay={0.1}>
          <InquiryForm />
        </Reveal>
      </div>

      <Reveal delay={0.15} className="relative z-1 mx-auto mt-16 max-w-6xl">
        <div className="overflow-hidden rounded-lg border border-border">
          <iframe
            title="BTEL Head Office Location"
            src={OFFICE_MAP_EMBED_SRC}
            width="100%"
            height="360"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Reveal>
    </section>
  );
}
