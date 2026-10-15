"use client";

import {
  AddButton,
  EmptyRow,
  Field,
  MediaField,
  RepeaterItem,
  SectionCard,
  TextInput,
} from "@/components/admin/form-primitives";
import type { ServiceSliderImageItem, ServiceSliderSectionContent } from "@/data/content-types";

export const EMPTY_SERVICE_SLIDER: ServiceSliderSectionContent = { eyebrow: "", images: [] };

// Shared by every products-services sub-page's project-photo slider.
export function ServiceSliderForm({
  value,
  onChange,
  slug,
}: {
  value: ServiceSliderSectionContent | undefined;
  onChange: (next: ServiceSliderSectionContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_SERVICE_SLIDER;
  const set = (patch: Partial<ServiceSliderSectionContent>) => onChange({ ...v, ...patch });

  return (
    <div className="space-y-5">
      <SectionCard title="Slider heading">
        <Field label="Eyebrow"><TextInput value={v.eyebrow} onChange={(x) => set({ eyebrow: x })} /></Field>
      </SectionCard>

      <SectionCard
        title="Photos"
        description="Each slide — a project photo and its caption."
        action={<AddButton label="Add photo" onClick={() => set({ images: [...v.images, { image: "", caption: "" }] })} />}
      >
        {v.images.length === 0 ? (
          <EmptyRow text="No photos yet — add one, or load the demo." />
        ) : (
          <div className="space-y-3">
            {v.images.map((img, i) => {
              const upd = (patch: Partial<ServiceSliderImageItem>) =>
                set({ images: v.images.map((im, idx) => (idx === i ? { ...im, ...patch } : im)) });
              return (
                <RepeaterItem key={i} onRemove={() => set({ images: v.images.filter((_, idx) => idx !== i) })}>
                  <MediaField label="Photo" kind="image" slug={slug} value={img.image} onChange={(x) => upd({ image: x })} />
                  <Field label="Caption"><TextInput value={img.caption} onChange={(x) => upd({ caption: x })} /></Field>
                </RepeaterItem>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
