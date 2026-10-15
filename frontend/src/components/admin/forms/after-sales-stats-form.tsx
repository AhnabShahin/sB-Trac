"use client";

import {
  AddButton,
  EmptyRow,
  Field,
  RepeaterItem,
  SectionCard,
  TextArea,
  TextInput,
} from "@/components/admin/form-primitives";
import type { AfterSalesStat, AfterSalesStatsContent } from "@/data/content-types";

export const EMPTY_AFTER_SALES_STATS: AfterSalesStatsContent = { stats: [] };

export function AfterSalesStatsForm({
  value,
  onChange,
}: {
  value: AfterSalesStatsContent | undefined;
  onChange: (next: AfterSalesStatsContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_AFTER_SALES_STATS;
  const set = (stats: AfterSalesStat[]) => onChange({ stats });

  return (
    <div className="space-y-5">
      <SectionCard
        title="Stats band"
        description="The counter row below the hero (e.g. 24 / 7)."
        action={<AddButton label="Add stat" onClick={() => set([...v.stats, { value: "", accent: "", description: "" }])} />}
      >
        {v.stats.length === 0 ? (
          <EmptyRow text="No stats yet — add one, or load the demo." />
        ) : (
          <div className="space-y-3">
            {v.stats.map((stat, i) => {
              const upd = (patch: Partial<AfterSalesStat>) => set(v.stats.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
              return (
                <RepeaterItem key={i} onRemove={() => set(v.stats.filter((_, idx) => idx !== i))}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Value"><TextInput value={stat.value} onChange={(x) => upd({ value: x })} placeholder="24" /></Field>
                    <Field label="Accent suffix"><TextInput value={stat.accent} onChange={(x) => upd({ accent: x })} placeholder="/7" /></Field>
                  </div>
                  <Field label="Caption"><TextArea value={stat.description} onChange={(x) => upd({ description: x })} rows={2} /></Field>
                </RepeaterItem>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
