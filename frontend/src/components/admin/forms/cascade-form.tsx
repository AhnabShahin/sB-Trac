"use client";

import {
  AddButton,
  EmptyRow,
  Field,
  MediaListField,
  RemoveButton,
  RepeaterItem,
  Select,
  TextArea,
  TextInput,
  inputCls,
} from "@/components/admin/form-primitives";
import type { CascadeContent, CascadeListItem, CascadeSlideContent } from "@/data/content-types";

export const EMPTY_CASCADE: CascadeContent = {
  eyebrow: "",
  heading: "",
  intro: "",
  slides: [],
};

const EMPTY_SLIDE: CascadeSlideContent = {
  index: "",
  title: "",
  description: "",
  items: [],
  itemsVariant: "list",
};

const ITEMS_VARIANTS = [
  { value: "list", label: "Inline checklist" },
  { value: "stats", label: "Tile grid (closing slide)" },
];

export function CascadeForm({
  value,
  onChange,
  slug,
}: {
  value: CascadeContent | undefined;
  onChange: (next: CascadeContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_CASCADE;
  const set = (patch: Partial<CascadeContent>) => onChange({ ...v, ...patch });

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <h3 className="mb-4 font-display text-base font-semibold text-offwhite">
          Section heading
        </h3>
        <div className="space-y-4">
          <Field label="Eyebrow">
            <TextInput value={v.eyebrow} onChange={(x) => set({ eyebrow: x })} placeholder="Our Foundation" />
          </Field>
          <Field label="Heading">
            <TextInput value={v.heading} onChange={(x) => set({ heading: x })} placeholder="Built to Deliver" />
          </Field>
          <Field label="Intro">
            <TextArea value={v.intro} onChange={(x) => set({ intro: x })} rows={2} />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-base font-semibold text-offwhite">Pillars (6 slides)</h3>
            <p className="mt-0.5 text-xs leading-relaxed text-muted">
              Each pinned full-screen as the reader scrolls, stacking in order.
            </p>
          </div>
          <AddButton
            label="Add slide"
            onClick={() =>
              set({
                slides: [
                  ...v.slides,
                  { ...EMPTY_SLIDE, index: String(v.slides.length + 1).padStart(2, "0") },
                ],
              })
            }
          />
        </div>

        {v.slides.length === 0 ? (
          <EmptyRow text="No slides yet — add one, or load the demo." />
        ) : (
          <div className="space-y-3">
            {v.slides.map((slide, i) => {
              const upd = (patch: Partial<CascadeSlideContent>) =>
                set({ slides: v.slides.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) });
              const items = slide.items ?? [];
              const updItem = (j: number, patch: Partial<CascadeListItem>) =>
                upd({ items: items.map((it, idx) => (idx === j ? { ...it, ...patch } : it)) });

              return (
                <RepeaterItem key={i} onRemove={() => set({ slides: v.slides.filter((_, idx) => idx !== i) })}>
                  <div className="grid gap-3 sm:grid-cols-[6rem_1fr]">
                    <Field label="Index"><TextInput value={slide.index} onChange={(x) => upd({ index: x })} placeholder="01" /></Field>
                    <Field label="Title"><TextInput value={slide.title} onChange={(x) => upd({ title: x })} /></Field>
                  </div>
                  <Field label="Lead line (optional)" hint="A short bold line above the bullet list, e.g. a tagline.">
                    <TextInput value={slide.lead ?? ""} onChange={(x) => upd({ lead: x })} />
                  </Field>
                  <Field label="Description (optional)" hint="Leave empty for a pure bullet-list slide.">
                    <TextArea value={slide.description ?? ""} onChange={(x) => upd({ description: x })} rows={3} />
                  </Field>
                  <MediaListField
                    label="Images"
                    hint="Add one image, or several — more than one auto-slides left to right on the site."
                    slug={slug}
                    value={slide.images?.length ? slide.images : slide.image ? [slide.image] : []}
                    onChange={(list) => upd({ images: list, image: list[0] ?? "" })}
                  />

                  <div>
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-muted">Bullet items (optional)</span>
                      <div className="flex items-center gap-2">
                        <Select
                          value={slide.itemsVariant ?? "list"}
                          onChange={(x) => upd({ itemsVariant: x as CascadeSlideContent["itemsVariant"] })}
                          options={ITEMS_VARIANTS}
                        />
                        <AddButton label="Add item" onClick={() => upd({ items: [...items, { title: "", description: "" }] })} />
                      </div>
                    </div>
                    {items.length === 0 ? null : (
                      <div className="space-y-2">
                        {items.map((item, j) => (
                          <div key={j} className="flex gap-2">
                            <input
                              className={inputCls}
                              style={{ maxWidth: 160 }}
                              value={item.title ?? ""}
                              placeholder="Title (optional)"
                              onChange={(e) => updItem(j, { title: e.target.value })}
                            />
                            <input
                              className={inputCls}
                              value={item.description}
                              placeholder="Description"
                              onChange={(e) => updItem(j, { description: e.target.value })}
                            />
                            <RemoveButton onClick={() => upd({ items: items.filter((_, idx) => idx !== j) })} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </RepeaterItem>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
