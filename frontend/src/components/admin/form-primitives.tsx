"use client";

import { useRef, useState } from "react";
import { deleteMedia, isManagedMedia, uploadMedia } from "@/services/media";

export const inputCls =
  "w-full rounded-lg border border-border bg-navy px-3.5 py-2.5 text-sm text-offwhite placeholder:text-muted/60 outline-none transition-all focus:border-teal/60 focus:ring-2 focus:ring-teal/15";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-[11px] text-muted">{hint}</span> : null}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      className={inputCls}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      className={`${inputCls} resize-y`}
      style={{ minHeight: (rows ?? 3) * 24 }}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function SectionCard({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-base font-semibold text-offwhite">{title}</h3>
          {description ? (
            <p className="mt-0.5 text-xs leading-relaxed text-muted">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

export function EmptyRow({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-navy/30 px-4 py-6 text-center text-xs text-muted">
      {text}
    </div>
  );
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-lg border border-teal/40 px-3 py-1.5 text-xs font-medium text-teal-light transition-colors hover:bg-teal/10"
    >
      <span className="text-sm leading-none">+</span> {label}
    </button>
  );
}

export function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Remove"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-sm text-muted transition-colors hover:border-red-500/40 hover:text-red-300"
    >
      ✕
    </button>
  );
}

export function RepeaterItem({
  children,
  onRemove,
}: {
  children: React.ReactNode;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-navy/40 p-3.5">
      <div className="flex gap-3">
        <div className="min-w-0 flex-1 space-y-3">{children}</div>
        <RemoveButton onClick={onRemove} />
      </div>
    </div>
  );
}

export function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      className={inputCls}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

// A media value can arrive in three shapes: a managed storage URL (an upload, or
// demo materialized to storage), an absolute external URL, or a demo-relative
// "/assets/…" path (straight from "Load demo", before apply-demo rewrites it).
// This reads all three the same way so the field looks and previews identically
// regardless of which one is currently in the box.
function mediaMeta(raw: string): { preview: string; name: string; source: string } {
  const value = raw.trim();
  if (!value) return { preview: "", name: "", source: "" };

  const isHttp = /^https?:\/\//i.test(value);
  // A bare "assets/…" (no leading slash) resolves against the current route and
  // breaks the preview; normalize relative paths to a root-absolute one.
  const preview = isHttp || value.startsWith("/") ? value : `/${value}`;
  const name = decodeURIComponent((preview.split("?")[0].split("/").pop() || preview));
  const source = value.includes("/storage/media/")
    ? "Uploaded"
    : value.includes("/demo-media/") || value.startsWith("/assets/")
      ? "Demo asset"
      : isHttp
        ? "External"
        : "Demo asset";

  return { preview, name, source };
}

export function MediaField({
  label,
  kind,
  slug,
  value,
  onChange,
}: {
  label: string;
  kind: "image" | "video";
  slug: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { preview, name, source } = mediaMeta(value);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (inputRef.current) inputRef.current.value = "";
    if (!file) return;
    setBusy(true);
    setError(null);
    const previous = value;
    try {
      const url = await uploadMedia(file, slug);
      onChange(url);
      if (isManagedMedia(previous) && previous !== url) deleteMedia(previous);
    } catch (err) {
      setError((err as Error)?.message ?? "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  function onRemove() {
    if (isManagedMedia(value)) deleteMedia(value);
    onChange("");
  }

  return (
    <div>
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      <input
        ref={inputRef}
        type="file"
        accept={kind === "video" ? "video/mp4,video/webm" : "image/*"}
        onChange={onPick}
        className="hidden"
      />
      <div className="flex items-stretch gap-2">
        {preview ? (
          <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-navy">
            {kind === "video" ? (
              <video src={preview} className="h-full w-full object-cover" muted playsInline />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className="h-full w-full object-cover" />
            )}
          </div>
        ) : (
          <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg border border-dashed border-border bg-navy/40 text-[10px] text-muted">
            {kind}
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {value ? (
            <div className="flex items-center gap-2">
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-offwhite" title={value}>
                {name}
              </span>
              <span className="shrink-0 rounded-full border border-border/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted">
                {source}
              </span>
            </div>
          ) : null}
          <input
            className={`${inputCls} text-xs text-muted`}
            value={value}
            placeholder="/assets/… or uploaded URL"
            onChange={(e) => onChange(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="rounded-lg border border-teal/40 px-3 py-1.5 text-xs font-medium text-teal-light transition-colors hover:bg-teal/10 disabled:opacity-40"
            >
              {busy ? "Uploading…" : value ? "Replace" : "Upload"}
            </button>
            {value ? (
              <button
                type="button"
                onClick={onRemove}
                className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:border-red-500/40 hover:text-red-300"
              >
                Remove
              </button>
            ) : null}
          </div>
        </div>
      </div>
      {error ? <p className="mt-1 text-xs text-red-300">{error}</p> : null}
    </div>
  );
}
