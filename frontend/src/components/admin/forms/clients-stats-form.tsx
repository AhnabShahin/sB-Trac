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
import type { ClientsStat, ClientsStatsContent } from "@/data/content-types";

export const EMPTY_CLIENTS_STATS: ClientsStatsContent = { stats: [] };

export function ClientsStatsForm({
  value,
  onChange,
}: {
  value: ClientsStatsContent | undefined;
  onChange: (next: ClientsStatsContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_CLIENTS_STATS;
  const set = (stats: ClientsStat[]) => onChange({ ...v, stats });

  return (
    <div className="space-y-5">
      <SectionCard
        title="Stats band"
        description="The counter row below the hero."
        action={<AddButton label="Add stat" onClick={() => set([...v.stats, { value: 0, suffix: "+", label: "" }])} />}
      >
        {v.stats.length === 0 ? (
          <EmptyRow text="No stats yet — add one, or load the demo." />
        ) : (
          <div className="space-y-3">
            {v.stats.map((stat, i) => {
              const upd = (patch: Partial<ClientsStat>) => set(v.stats.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
              return (
                <RepeaterItem key={i} onRemove={() => set(v.stats.filter((_, idx) => idx !== i))}>
                  <div className="grid gap-3 sm:grid-cols-[6rem_6rem]">
                    <Field label="Value"><input type="number" className={inputCls} value={stat.value} onChange={(e) => upd({ value: Number(e.target.value) || 0 })} /></Field>
                    <Field label="Suffix"><TextInput value={stat.suffix} onChange={(x) => upd({ suffix: x })} placeholder="+" /></Field>
                  </div>
                  <Field label="Label" hint="Use a line break (Enter) to split onto two lines.">
                    <TextArea value={stat.label} onChange={(x) => upd({ label: x })} rows={2} />
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
