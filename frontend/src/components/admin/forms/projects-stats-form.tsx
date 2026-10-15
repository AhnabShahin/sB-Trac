"use client";

import {
  AddButton,
  EmptyRow,
  Field,
  RepeaterItem,
  SectionCard,
  TextArea,
  TextInput,
  inputCls,
} from "@/components/admin/form-primitives";
import type { ProjectsStat, ProjectsStatsContent } from "@/data/content-types";

export const EMPTY_PROJECTS_STATS: ProjectsStatsContent = { stats: [] };

export function ProjectsStatsForm({
  value,
  onChange,
}: {
  value: ProjectsStatsContent | undefined;
  onChange: (next: ProjectsStatsContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_PROJECTS_STATS;
  const set = (stats: ProjectsStat[]) => onChange({ ...v, stats });

  return (
    <div className="space-y-5">
      <SectionCard
        title="Stats band"
        description="The counter row below the hero."
        action={<AddButton label="Add stat" onClick={() => set([...v.stats, { value: 0, suffix: "+", prefix: "", description: "" }])} />}
      >
        {v.stats.length === 0 ? (
          <EmptyRow text="No stats yet — add one, or load the demo." />
        ) : (
          <div className="space-y-3">
            {v.stats.map((stat, i) => {
              const upd = (patch: Partial<ProjectsStat>) => set(v.stats.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
              return (
                <RepeaterItem key={i} onRemove={() => set(v.stats.filter((_, idx) => idx !== i))}>
                  <div className="grid gap-3 sm:grid-cols-[5rem_5rem_5rem]">
                    <Field label="Prefix"><TextInput value={stat.prefix ?? ""} onChange={(x) => upd({ prefix: x })} placeholder="BDT " /></Field>
                    <Field label="Value"><input type="number" className={inputCls} value={stat.value} onChange={(e) => upd({ value: Number(e.target.value) || 0 })} /></Field>
                    <Field label="Suffix"><TextInput value={stat.suffix} onChange={(x) => upd({ suffix: x })} placeholder="Cr+" /></Field>
                  </div>
                  <Field label="Caption" hint="Use a line break (Enter) to split onto two lines.">
                    <TextArea value={stat.description} onChange={(x) => upd({ description: x })} rows={2} />
                  </Field>
                </RepeaterItem>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
