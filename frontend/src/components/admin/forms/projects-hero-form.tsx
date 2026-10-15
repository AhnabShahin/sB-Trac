"use client";

import { Field, MediaField, SectionCard, Select, TextArea, TextInput } from "@/components/admin/form-primitives";
import type { ProjectsAccent, ProjectsHeroContent } from "@/data/content-types";

export const EMPTY_PROJECTS_HERO: ProjectsHeroContent = {
  accent: "blue",
  badge: "",
  headingLine1: "",
  headingHighlight: "",
  headingSuffix: "",
  subhead: "",
  image: "",
};

export const ACCENT_OPTIONS = [
  { value: "blue", label: "Blue" },
  { value: "teal", label: "Teal" },
  { value: "amber", label: "Amber" },
  { value: "purple", label: "Purple" },
  { value: "cyan", label: "Cyan" },
];

export function ProjectsHeroForm({
  value,
  onChange,
  slug,
}: {
  value: ProjectsHeroContent | undefined;
  onChange: (next: ProjectsHeroContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_PROJECTS_HERO;
  const set = (patch: Partial<ProjectsHeroContent>) => onChange({ ...v, ...patch });

  return (
    <div className="space-y-5">
      <SectionCard title="Hero heading" description="The page banner — badge, big heading and intro.">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_9rem]">
            <Field label="Badge"><TextInput value={v.badge} onChange={(x) => set({ badge: x })} placeholder="38+ Projects · BDT 400+ Cr Delivered" /></Field>
            <Field label="Accent colour"><Select value={v.accent} onChange={(x) => set({ accent: x as ProjectsAccent })} options={ACCENT_OPTIONS} /></Field>
          </div>
          <div>
            <span className="mb-1.5 block text-xs font-medium text-muted">Heading</span>
            <div className="grid gap-3 sm:grid-cols-3">
              <TextInput value={v.headingLine1} onChange={(x) => set({ headingLine1: x })} placeholder="Work That" />
              <TextInput value={v.headingHighlight} onChange={(x) => set({ headingHighlight: x })} placeholder="Speaks (gradient)" />
              <TextInput value={v.headingSuffix} onChange={(x) => set({ headingSuffix: x })} placeholder="For Itself" />
            </div>
          </div>
          <Field label="Intro"><TextArea value={v.subhead} onChange={(x) => set({ subhead: x })} rows={3} /></Field>
          <MediaField label="Background image" kind="image" slug={slug} value={v.image} onChange={(x) => set({ image: x })} />
        </div>
      </SectionCard>
    </div>
  );
}
