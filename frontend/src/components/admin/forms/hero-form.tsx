"use client";

import {
  AddButton,
  EmptyRow,
  Field,
  MediaField,
  RepeaterItem,
  SectionCard,
  Select,
  TextArea,
  TextInput,
  inputCls,
} from "@/components/admin/form-primitives";
import type { HeroContent, HeroServiceCard, HeroSlide } from "@/data/content-types";

export const EMPTY_HERO: HeroContent = {
  badge: "",
  headline: { line1: "", line2Prefix: "", highlight: "" },
  subhead: "",
  primaryCta: { label: "", href: "" },
  secondaryCta: { label: "", href: "" },
  stats: [],
  slides: [],
  services: [],
};

const SERVICE_ICONS = [
  { value: "bolt", label: "Bolt" },
  { value: "sun", label: "Sun" },
  { value: "crane", label: "Crane" },
  { value: "droplet", label: "Droplet" },
  { value: "wrench", label: "Wrench" },
];

export function HeroForm({
  value,
  onChange,
  slug,
}: {
  value: HeroContent | undefined;
  onChange: (next: HeroContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_HERO;
  const set = (patch: Partial<HeroContent>) => onChange({ ...v, ...patch });

  return (
    <div className="space-y-5">
      <SectionCard title="Headline & intro" description="Badge, big headline and supporting paragraph.">
        <div className="space-y-4">
          <Field label="Badge">
            <TextInput value={v.badge} onChange={(x) => set({ badge: x })} placeholder="ISO 9001:2015 Certified · Since 2009" />
          </Field>
          <div>
            <span className="mb-1.5 block text-xs font-medium text-muted">Headline</span>
            <div className="grid gap-3 sm:grid-cols-3">
              <TextInput value={v.headline.line1} onChange={(x) => set({ headline: { ...v.headline, line1: x } })} placeholder="Line 1" />
              <TextInput value={v.headline.line2Prefix} onChange={(x) => set({ headline: { ...v.headline, line2Prefix: x } })} placeholder="Line 2 prefix" />
              <TextInput value={v.headline.highlight} onChange={(x) => set({ headline: { ...v.headline, highlight: x } })} placeholder="Highlight" />
            </div>
          </div>
          <Field label="Subheadline">
            <TextArea value={v.subhead} onChange={(x) => set({ subhead: x })} rows={4} />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Call-to-action buttons" description="The two buttons below the intro.">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-3">
            <span className="block text-xs font-semibold uppercase tracking-wide text-teal-light">Primary</span>
            <Field label="Label"><TextInput value={v.primaryCta.label} onChange={(x) => set({ primaryCta: { ...v.primaryCta, label: x } })} /></Field>
            <Field label="Link"><TextInput value={v.primaryCta.href} onChange={(x) => set({ primaryCta: { ...v.primaryCta, href: x } })} placeholder="/products-services" /></Field>
          </div>
          <div className="space-y-3">
            <span className="block text-xs font-semibold uppercase tracking-wide text-muted">Secondary</span>
            <Field label="Label"><TextInput value={v.secondaryCta.label} onChange={(x) => set({ secondaryCta: { ...v.secondaryCta, label: x } })} /></Field>
            <Field label="Link"><TextInput value={v.secondaryCta.href} onChange={(x) => set({ secondaryCta: { ...v.secondaryCta, href: x } })} placeholder="#projects" /></Field>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Hero stats"
        description="The counter row (e.g. 60+ Clients)."
        action={<AddButton label="Add stat" onClick={() => set({ stats: [...v.stats, { value: 0, suffix: "+", label: "" }] })} />}
      >
        {v.stats.length === 0 ? (
          <EmptyRow text="No stats yet — add one, or load the demo." />
        ) : (
          <div className="space-y-2.5">
            {v.stats.map((stat, i) => {
              const upd = (patch: Partial<typeof stat>) =>
                set({ stats: v.stats.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) });
              return (
                <div key={i} className="grid grid-cols-[5.5rem_5.5rem_1fr_auto] items-center gap-2 rounded-lg border border-border/60 bg-navy/40 p-2">
                  <input type="number" className={inputCls} value={stat.value} onChange={(e) => upd({ value: Number(e.target.value) || 0 })} />
                  <input className={inputCls} value={stat.suffix} placeholder="+" onChange={(e) => upd({ suffix: e.target.value })} />
                  <input className={inputCls} value={stat.label} placeholder="Clients" onChange={(e) => upd({ label: e.target.value })} />
                  <button type="button" aria-label="Remove" onClick={() => set({ stats: v.stats.filter((_, idx) => idx !== i) })} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-sm text-muted transition-colors hover:border-red-500/40 hover:text-red-300">✕</button>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Background media"
        description="Full-bleed image or video behind the hero."
        action={<AddButton label="Add slide" onClick={() => set({ slides: [...v.slides, { type: "image", src: "" }] })} />}
      >
        {v.slides.length === 0 ? (
          <EmptyRow text="No media yet — add a slide, or load the demo." />
        ) : (
          <div className="space-y-3">
            {v.slides.map((slide, i) => {
              const replace = (next: HeroSlide) => set({ slides: v.slides.map((s, idx) => (idx === i ? next : s)) });
              return (
                <RepeaterItem key={i} onRemove={() => set({ slides: v.slides.filter((_, idx) => idx !== i) })}>
                  <Field label="Type">
                    <Select
                      value={slide.type}
                      onChange={(t) => replace(t === "video" ? { type: "video", mp4Src: "", poster: "" } : { type: "image", src: "" })}
                      options={[{ value: "image", label: "Image" }, { value: "video", label: "Video" }]}
                    />
                  </Field>
                  {slide.type === "video" ? (
                    <>
                      <MediaField label="Video (MP4)" kind="video" slug={slug} value={slide.mp4Src} onChange={(x) => replace({ ...slide, mp4Src: x })} />
                      <MediaField label="Poster image" kind="image" slug={slug} value={slide.poster} onChange={(x) => replace({ ...slide, poster: x })} />
                    </>
                  ) : (
                    <MediaField label="Image" kind="image" slug={slug} value={slide.src} onChange={(x) => replace({ ...slide, src: x })} />
                  )}
                </RepeaterItem>
              );
            })}
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Service cards"
        description="The division tiles stacked beside the hero. Each has an icon, accent colour and a background photo shown on hover."
        action={<AddButton label="Add card" onClick={() => set({ services: [...v.services, { icon: "bolt", title: "", subtitle: "", accent: "#0A9E88", href: "", image: "", wide: false }] })} />}
      >
        {v.services.length === 0 ? (
          <EmptyRow text="No service cards yet — add one, or load the demo." />
        ) : (
          <div className="space-y-3">
            {v.services.map((card, i) => {
              const upd = (patch: Partial<HeroServiceCard>) => set({ services: v.services.map((c, idx) => (idx === i ? { ...c, ...patch } : c)) });
              const swatch = /^#[0-9a-fA-F]{6}$/.test(card.accent) ? card.accent : "#0A9E88";
              return (
                <RepeaterItem key={i} onRemove={() => set({ services: v.services.filter((_, idx) => idx !== i) })}>
                  <div className="grid gap-3 sm:grid-cols-[9rem_1fr]">
                    <Field label="Icon"><Select value={card.icon} onChange={(x) => upd({ icon: x as HeroServiceCard["icon"] })} options={SERVICE_ICONS} /></Field>
                    <Field label="Accent colour">
                      <div className="flex items-center gap-2">
                        <input type="color" aria-label="Accent colour" value={swatch} onChange={(e) => upd({ accent: e.target.value })} className="h-9 w-10 shrink-0 cursor-pointer rounded-lg border border-border bg-navy p-1" />
                        <input className={inputCls} value={card.accent} onChange={(e) => upd({ accent: e.target.value })} placeholder="#0A9E88" />
                      </div>
                    </Field>
                  </div>
                  <Field label="Title"><TextInput value={card.title} onChange={(x) => upd({ title: x })} placeholder="Substation & Switchgear" /></Field>
                  <Field label="Subtitle"><TextArea value={card.subtitle} onChange={(x) => upd({ subtitle: x })} rows={2} /></Field>
                  <Field label="Link"><TextInput value={card.href} onChange={(x) => upd({ href: x })} placeholder="/products-services/substation" /></Field>
                  <MediaField label="Background image" kind="image" slug={slug} value={card.image ?? ""} onChange={(x) => upd({ image: x })} />
                  <label className="flex items-center gap-2 text-xs font-medium text-muted">
                    <input type="checkbox" checked={!!card.wide} onChange={(e) => upd({ wide: e.target.checked })} />
                    Full-width card (spans both columns)
                  </label>
                </RepeaterItem>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
