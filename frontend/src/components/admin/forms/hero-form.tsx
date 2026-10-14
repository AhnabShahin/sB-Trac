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
import type { HeroContent, HeroSlide } from "@/data/content-types";

export const EMPTY_HERO: HeroContent = {
  badge: "",
  headline: { line1: "", line2Prefix: "", highlight: "" },
  subhead: "",
  primaryCta: { label: "", href: "" },
  secondaryCta: { label: "", href: "" },
  stats: [],
  slides: [],
};

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
    </div>
  );
}
